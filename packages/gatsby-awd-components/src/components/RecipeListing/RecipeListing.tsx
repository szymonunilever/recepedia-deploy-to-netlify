import cx from 'classnames';
import React, { FunctionComponent, memo, ReactElement, useEffect, useRef, useState } from 'react';
import { Button } from '../Button';
import { RecipeCardLinkWrapperProps } from '../RecipeCardLinkWrapper';
import { TagName, Text } from '../Text';
import { LoadMoreType, RecipeListingProps, RecipeListViewType } from './models';
import {
  RecipeAddPlaceholderProps,
  RecipeFilter,
  RecipeListingTrivial, RecipeListingTrivialProps,
  RecipeSortingOptions,
  RecipeSortingOptionsFieldsMappings,
} from './partials';
import {RecipeCardProps} from '../RecipeCard';
import theme from './RecipeListing.module.scss';
import RecipeListingCarousel from './RecipeListingCarousel';
import {
  applyContentDefaults,
  applyFilters,
  applyingFavorites,
  sortBy,
} from './utils';
import get from 'lodash/get';
import { RatingAndReviewsProvider } from '../../models';
import reloadKritiqueWidget from '../../utils/useKritiqueReload';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

export const RecipeListing: FunctionComponent<RecipeListingProps> = ({
  className,
  viewType = RecipeListViewType.Base,
  recipePerLoad = 4,
  initialCount = 4,
  onViewChange,
  titleLevel,
  filterTitle,
  loadMoreConfig = { type : LoadMoreType.sync },
  tags = { tagGroups : [] },
  carouselConfig = {
    breakpoints : [
      {
        width : 1366,
        switchElementsBelowBreakpoint : 1,
        switchElementsAfterBreakpoint : 2,
        visibleElementsBelowBreakpoint : 2,
        visibleElementsAboveBreakpoint : 4,
      },
    ],
  },
  isExternalItemLink = false,
  icons,
  ratingProvider,
  list,
  children,
  ...props
}) => {

 let cards: ReactElement<RecipeCardProps>[] | ReactElement<RecipeCardLinkWrapperProps>[] = [];
 let holders: ReactElement<RecipeAddPlaceholderProps>[] =[];
  if(Array.isArray(children)){
    children.forEach(child=>{
      // @ts-ignore
      child && child.props.hasOwnProperty('slug')? cards.push(child) : holders.push(child);
    })
  }else{
    // @ts-ignore
    cards.push(children);
  }
useEffect(()=>{
  cards = [];
  holders = [];
  if(Array.isArray(children)){
    children.forEach(child=>{
      // @ts-ignore
      child && child.props.hasOwnProperty('slug')? cards.push(child) : holders.push(child);
    })
  }else{
    // @ts-ignore
    cards.push(children);
  }
}, [children]);



  let loadButtonRef = React.createRef();
  const getActualChildren = (list:Internal.Recipe[], children:RecipeListingTrivialProps['children']): ReactElement<RecipeCardProps>[]|ReactElement<RecipeCardLinkWrapperProps>[] =>{
    const recipeIds = list.map(recipe => recipe.recipeId);
    if(typeof children!=='undefined') {

      if (Array.isArray(children)) {
        // @ts-ignore
        return children.filter(child => {
          if(child.props.hasOwnProperty('recipeId')){
            return recipeIds.indexOf(child.props.recipeId) !== -1;
          } else if(child.props.children.props.hasOwnProperty('recipeId')){
            return recipeIds.indexOf(child.props.children.props.recipeId) !== -1;
          } else {
            return false;
          }
        });
      } else {
        // @ts-ignore
        return (recipeIds.indexOf(children.props.children.props.recipeId) !== -1) ? [children] : [];
      }
    }else{
      return [];
    }
  };
  const isAsyncLoadMore = () =>
    get(loadMoreConfig, 'type') === LoadMoreType.async;
  const { title, cta, sortSelectPlaceholder } = applyContentDefaults(props.content);
  const wrapClasses = cx(theme.recipeList, 'recipe-list', className);
  let listModified =
    viewType === RecipeListViewType.Advanced
      ? sortBy(RecipeSortingOptions.newest, list)
      : list;
  const getSlicedList = (recList = listModified): Internal.Recipe[] => {
    return !isAsyncLoadMore() ? recList.slice(0, displayNumber) : recList;
  };

  const [ displayNumber, setDisplayNumber ] = useState(initialCount);
  const [ sortingValue, setSortingValue ] = useState<RecipeSortingOptions>(
    RecipeSortingOptions.newest,
  );
  const [ filteringValue, setFilteringValue ] = useState<Internal.Tag[]>([]);
  const [ actualChildren, setActualChildren ] = useState<ReactElement<RecipeCardProps>[] | ReactElement<RecipeCardLinkWrapperProps>[]>(
    getActualChildren(getSlicedList(), cards),
  );

  const allCount = loadMoreConfig.allCount || actualChildren.length;

  useEffect(() => {
    setDisplayNumber(Math.max(initialCount, displayNumber));
  }, [ initialCount, children ]);

  useEffect(() => {
    setActualChildren(getActualChildren(getSlicedList(list), cards));
  }, [ list, displayNumber, children ]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (
      didMountRef.current &&
      ratingProvider === RatingAndReviewsProvider.kritique
    ) {
      reloadKritiqueWidget();
    } else {
      didMountRef.current = true;
    }
  }, [ list, children ]);

  const onFilterChange = (filter: Internal.Tag[]) => {
    if (isAsyncLoadMore()) {
      if (onViewChange) {
        onViewChange(
          filter,
          RecipeSortingOptionsFieldsMappings[ sortingValue ],
        ).then(() => {
          setFilteringValue(filter);
        });
      }
    } else {
      const recipeCount = displayNumber;
      const filtered = applyFilters(filter, sortBy(sortingValue, listModified));
      setActualChildren(
        getActualChildren((recipeCount > 0 ? filtered.slice(0, recipeCount) : filtered), cards)
      );
      setFilteringValue(filter);
    }
  };

  const onChangeSorting = (sorting: RecipeSortingOptions) => {
    if (isAsyncLoadMore()) {
      if (onViewChange) {
        onViewChange(
          filteringValue,
          RecipeSortingOptionsFieldsMappings[ sorting ],
        ).then(() => {
          setSortingValue(sorting);
        });
      }
    } else {
      listModified = sortBy(sorting, listModified);
      const recipeCount = displayNumber;
      const filtered = applyFilters(filteringValue, listModified);
      setSortingValue(sorting);
      setActualChildren(
        getActualChildren((recipeCount > 0 ? filtered.slice(0, recipeCount) : filtered), cards)
      );
      setDisplayNumber(recipeCount);
    }
  };

  const loadMore = () => {
    const recipeCount = displayNumber + recipePerLoad;

    if (isAsyncLoadMore()) {
      //@ts-ignore
      loadMoreConfig.onLoadMore(
        filteringValue,
        RecipeSortingOptionsFieldsMappings[ sortingValue ],
        recipePerLoad,
      );
    } else {
      let filteredList = applyFilters(filteringValue, listModified);
      setActualChildren(
        getActualChildren(recipeCount > 0 ? filteredList : filteredList.slice(0, recipeCount), cards)
      );
    }
    setDisplayNumber(recipeCount);
  };

  const listHeader = title ? (
    <Text
      className={cx(theme.recipeList__header, 'recipe-list__header')}
      // @ts-ignore
      tag={TagName[ `h${titleLevel}` ]}
      text={title}
    />
  ) : null;

  const shouldLoadMoreAppear =
    loadMoreConfig && isAsyncLoadMore()
      ? list.length < allCount
      : actualChildren.length > 0 &&
      initialCount !== 0 &&
      displayNumber < list.length;

  const listing = (
    <RecipeListingTrivial
      ratingProvider={ratingProvider}
      {...props}
      holders={holders}
    >
      {actualChildren}
    </RecipeListingTrivial>
  );
  const recipeListBasic = (
    <>
      {listing}
      {shouldLoadMoreAppear ? (
        <Button
          className={cx(theme.recipeList__loadMore, 'recipe-list__load-more')}
          onClick={loadMore}
          content={cta}
          attributes={{ ref : loadButtonRef }}
        />
      ) : null}
    </>
  );
  const view: JSX.Element =
    viewType == RecipeListViewType.Trivial ? (
      listing
    ) : viewType == RecipeListViewType.Base ? (
      recipeListBasic
    ) : viewType == RecipeListViewType.Carousel ? (
      <RecipeListingCarousel
        list={listModified}
        config={carouselConfig}
        ratingProvider={ratingProvider}
        isExternalRecipeLink={isExternalItemLink}
        {...props}
      >
        {cards}
      </RecipeListingCarousel>
    ) : (
      <>
        <RecipeFilter
          className={cx(theme.recipeList__filter, 'recipe-list__filter')}
          allFilters={tags}
          icons={icons}
          filterTitle={filterTitle}
          onChangeFilter={onFilterChange}
          onChangeSorting={onChangeSorting}
          results={
            (loadMoreConfig && loadMoreConfig.allCount) || actualChildren.length
          }
          sortSelectPlaceholder={sortSelectPlaceholder}
          {...props}
        />
        <>{recipeListBasic}</>
      </>
    );

  return (
    <div
      {...getComponentDataAttrs('recipeListing', props.content)}
      className={wrapClasses}
    >
      {listHeader}
      {view}
    </div>
  );
};

export default memo(RecipeListing);
