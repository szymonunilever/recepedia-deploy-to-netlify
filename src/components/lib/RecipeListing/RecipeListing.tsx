import cx from 'classnames';
import { remove } from 'lodash';
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { TagName, Text } from '../Text';
import { RecipeListingProps, RecipeListViewType } from './models';
import {
  RecipeFilter,
  RecipeItem,
  RecipeListingTrivial,
  RecipeSortingOptions,
  Tag,
} from './partials';
import theme from './RecipeListing.module.scss';
import {
  applyContentDefaults,
  applyFilters,
  applyingFavorites,
  sortBy,
} from './utils';

const RecipeListing = ({
  className,
  content,
  titleLevel = 2,
  viewType = RecipeListViewType.Base,
  withFavorite = false,
  recipePerLoad = 4,
  favorites = [],
  list,
  initialCount = 4,
  onFavoriteChange,
  tags = { categories: [] },
}: RecipeListingProps) => {
  const {
    title,
    cta,
    resultLabel,
    resultLabelPlural,
    optionLabels,
    sortSelectPlaceholder,
    nullResult,
    filtersCta,
  } = applyContentDefaults(content);

  const wrapClasses = cx(theme.recipeList, className);
  let listModified = sortBy(
    RecipeSortingOptions.newest,
    applyingFavorites(list, withFavorite, favorites)
  );

  const [listState, setListState] = useState<{
    listItems: RecipeItem[];
    filterLength: number;
    filter: Tag[];
    sorting: RecipeSortingOptions;
  }>({
    listItems:
      initialCount > 0 ? listModified.slice(0, initialCount) : listModified,
    filterLength: listModified.length,
    filter: [],
    sorting: RecipeSortingOptions.newest,
  });

  const changeFavorites = ({ id, val }: { id: string; val: boolean }) => {
    val ? favorites.push(id) : remove(favorites, n => n === id);
    if (onFavoriteChange) {
      onFavoriteChange(favorites);
    }
  };
  const onFilterChange = (filter: Tag[]) => {
    const recipeCount = listState.listItems.length;
    listModified = sortBy(listState.sorting, listModified);
    setListState({
      ...listState,
      listItems:
        recipeCount > 0
          ? applyFilters(filter, listModified).slice(0, recipeCount)
          : applyFilters(filter, listModified),
      filterLength: applyFilters(filter, listModified).length,
      filter,
    });
  };

  const onChangeSorting = (sorting: RecipeSortingOptions) => {
    const recipeCount = listState.listItems.length;
    const { filter } = listState;
    listModified = sortBy(sorting, listModified);
    setListState({
      ...listState,
      listItems:
        recipeCount > 0
          ? applyFilters(filter, listModified).slice(0, recipeCount)
          : applyFilters(filter, listModified),
      sorting,
    });
  };

  const loadMore = () => {
    const recipeCount = listState.listItems.length + recipePerLoad;
    const { filter } = listState;
    setListState({
      ...listState,
      listItems:
        recipeCount > 0
          ? applyFilters(filter, listModified).slice(0, recipeCount)
          : applyFilters(filter, listModified),
    });
  };

  const listHeader = title ? (
    <Text
      className="recipe-list__header"
      // @ts-ignore
      tag={TagName[`h${titleLevel}`]}
      text={title}
    />
  ) : null;

  const recipeListBasic = (
    <>
      <RecipeListingTrivial
        list={listState.listItems}
        recipeCount={listState.listItems.length}
        withFavorite={withFavorite}
        onFavoriteChange={changeFavorites}
        content={nullResult}
        // @ts-ignore
        titleLevel={titleLevel + 1}
      />
      {listState.listItems.length > 0 && initialCount !== 0 ? (
        <Button
          className="recipe-list__load-more"
          onClick={loadMore}
          hidden={listState.listItems.length === listState.filterLength}
          content={cta}
        />
      ) : null}
    </>
  );

  const view: JSX.Element =
    viewType === RecipeListViewType.Trivial ? (
      <RecipeListingTrivial
        list={listState.listItems}
        recipeCount={listState.listItems.length}
        withFavorite={withFavorite}
        onFavoriteChange={changeFavorites}
        content={nullResult}
        // @ts-ignore
        titleLevel={titleLevel + 1}
      />
    ) : viewType === RecipeListViewType.Base ? (
      <>{recipeListBasic}</>
    ) : (
      <>
        <RecipeFilter
          className="recipe-list__filter"
          allFilters={tags}
          onChangeFilter={onFilterChange}
          onChangeSorting={onChangeSorting}
          resultLabel={resultLabel}
          resultLabelPlural={resultLabelPlural}
          results={listState.filterLength}
          optionLabels={optionLabels}
          content={filtersCta}
          sortSelectPlaceholder={sortSelectPlaceholder}
        />
        <>{recipeListBasic}</>
      </>
    );

  return (
    <div data-componentname="recipeListing" className={wrapClasses}>
      {listHeader}
      {view}
    </div>
  );
};

export default RecipeListing;
