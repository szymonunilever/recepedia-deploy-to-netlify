import { IMAGE_SIZES } from 'gatsby-theme-recepedia/src/constants';
import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from 'react';
import {
  Button,
  RecipeCard,
  SearchInput,
  Tabs,
  Tab,
  RecipeListing,
  NullResult,
  MediaGallery,
  Filter,
  CardLinkWrapper,
  ProductListing,
  LoadMoreType
} from '../index';
import cx from 'classnames';
import get from 'lodash/get';
import trim from 'lodash/trim';
import { SearchParams } from './models';
import { SearchListingProps } from './models';
import { RatingAndReviewsProvider } from '../../models';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import { icons } from '../../mocks/global';
import theme from './SearchListing.module.scss';


const SearchListing: FunctionComponent<SearchListingProps> = ({
  content,
  config: { recipeConfig, searchInputConfig, articleConfig, productConfig },
  searchQuery,
  className,
  searchResults: {
    recipeResults,
    searchInputResults,
    articleResults,
    productResults,
    articleResultsFetched,
    recipeResultsFetched,
    productResultsFetched,
  },
  brandLogoLink,
}) => {
  const classNames = cx(theme.searchListing, 'search-listing', className);
  const [filteringValue, setFilteringValue] = useState<Internal.Tag[]>([]);
  const [defaultSearchValue, setDefaultSearchValue] = useState(searchQuery);

  useEffect(() => {
    setDefaultSearchValue(searchQuery);
  }, [searchQuery]);

  const onSubmit = useCallback(
    (searchQuery: string) => {
      const trimmedSearchQuery = trim(searchQuery);
      if(searchQuery !== defaultSearchValue) {
        setDefaultSearchValue(searchQuery);
      }

      setFilteringValue([]);

      if (recipeConfig.getRecipeSearchData) {
        recipeConfig.getRecipeSearchData(trimmedSearchQuery, {
          size: recipeConfig.initialCount,
        });
      }

      if (articleConfig.getArticleSearchData) {
        articleConfig.getArticleSearchData(trimmedSearchQuery, {
          size: articleConfig.initialCount,
        });
      }

      if (productConfig.getProductSearchData) {
        productConfig.getProductSearchData(trimmedSearchQuery, {
          size: productConfig.initialCount,
        });
      }
    },
    [recipeConfig.initialCount]
  );

  const onLoadMoreRecipes = async (
    tags: Internal.Tag[],
    sorting: string,
    size: number
  ) => {
    if (recipeConfig.onViewChange) {
      return recipeConfig.onViewChange(filteringValue, {
        from: recipeResults.list.length,
        size: size,
      });
    }

    return Promise.resolve();
  };

  const onLoadMoreArticles = (size: number) => {
    if (articleConfig.getArticleSearchData) {
      articleConfig.getArticleSearchData(defaultSearchValue, {
        from: articleResults.list.length,
        size,
      });
    }
  };

  const onLoadMoreProducts = (size: number) => {
    if (productConfig.getProductSearchData) {
      productConfig.getProductSearchData(defaultSearchValue, {
        from: productResults.list.length,
        size,
      });
    }
  };

  const onClickSearchResultsItem = useCallback(
    async (searchQuery: string, params: SearchParams) => {
      setDefaultSearchValue(searchQuery);

      if (searchInputConfig.onClickSearchResultsItem) {
        searchInputConfig.onClickSearchResultsItem(searchQuery, {
          size: params.size,
        });
      }
    },
    []
  );

  const searchResultsText = content.searchListingContent.title
    .replace(
      '{numRes}',
      (recipeResults.count + articleResults.count + productResults.count).toString()
    )
    .replace(
      '{searchInputValue}',
      `${defaultSearchValue ? `\n"${trim(defaultSearchValue)}"` : '" "'}`
    );

  const loadMoreConfig = {
    type: LoadMoreType.async,
    onLoadMore: onLoadMoreRecipes,
    allCount: recipeResults.count,
  };

  const recipes = !!recipeResults.list.length && (
    <RecipeListing
      list={recipeResults.list}
      titleLevel={2}
      content={content.recipesContent}
      ratingProvider={RatingAndReviewsProvider.inline}
      loadMoreConfig={loadMoreConfig}
      {...recipeConfig}
      hideFilter
      brandLogoLink={brandLogoLink}
    >
      {recipeResults.list
        ? recipeResults.list.map(recipe => (
          <CardLinkWrapper
            title={recipe.title}
            key={recipe.id}
            cardKey={recipe.id}
            slug={recipe.fields.slug}
          >
            <RecipeCard
              {...recipe}
              slug={recipe.fields.slug}
              ratingProvider={RatingAndReviewsProvider.inline}
              imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
              content={{ title: recipe.title }}
            >
              <Button
                {...recipeConfig.recipeCardButtonPropsDefault}
                isSelected={
                  recipeConfig.favorites.indexOf(recipe.recipeId) !== -1
                }
                onClick={recipeConfig.onFavoriteChange}
              />
            </RecipeCard>
          </CardLinkWrapper>
          ))
        : []}
    </RecipeListing>
  );
  const articles = !!content.tabsContent.tabs.find(
    tab => get(tab, 'view') === 'articles'
  ) &&
    !!articleResults.list.length && (
      <MediaGallery
        content={content.articleContent}
        onLoadMore={onLoadMoreArticles}
        list={articleResults.list}
        allCount={articleResults.count}
        brandLogoLink={brandLogoLink}
      />
    );

  const products = !!content.tabsContent.tabs.find(
    tab => get(tab, 'view') === 'products'
    ) && !!productResults.list.length && (
      <ProductListing
        content={content.productContent}
        onLoadMore={onLoadMoreProducts}
        list={productResults.list}
        allCount={productResults.count}
        brandLogoLink={brandLogoLink}
      />
    );

  const tabs = content.tabsContent.tabs.reduce(
    (
      tabs: {
        list: JSX.Element[];
        content: {
          tabs: AppContent.Tabs.Tab[];
        };
      },
      tab
    ) => {
      const { view } = tab;
      const onlyCategory = [!!recipes, !!articles, !!products].filter(
        item => item
      ).length;

      switch (view) {
        case 'all': {
          onlyCategory !== 1 && tabs.list.push(
            <Tab view={view} key={view}>
              {recipes}
              {articles}
              {products}
            </Tab>
          );
          onlyCategory !== 1 && tabs.content.tabs.push({
            ...tab,
            resultsCount: recipeResults.count + articleResults.count + productResults.count,
          });
          break;
        }

        case 'articles': {
          articles && tabs.list.push(
            <Tab view={view} key={view}>
              {articles}
            </Tab>
          );
          articles && tabs.content.tabs.push({
            ...tab,
            resultsCount: articleResults.count,
          });

          break;
        }

        case 'recipes': {
          recipes && tabs.list.push(
            <Tab view={view} key={view}>
              {recipes}
            </Tab>
          );
          recipes && tabs.content.tabs.push({
            ...tab,
            resultsCount: recipeResults.count,
          });
          break;
        }

        case 'products': {
          products && tabs.list.push(
            <Tab view={view} key={view}>
              {products}
            </Tab>
          );
          products && tabs.content.tabs.push({
            ...tab,
            resultsCount: productResults.count,
          });
          break;
        }
      }

      return tabs;
    },
    { list: [], content: { tabs: [] } }
  );

  const onChangeFilter = (filter: Internal.Tag[]) => {
    if (recipeConfig.onViewChange) {
      recipeConfig.onViewChange(filter, null).then(() => {
        setFilteringValue(filter);
      });
    }

    if (articleConfig.onArticleViewChange) {
      articleConfig.onArticleViewChange(filter, null);
    }

    if (productConfig.onProductViewChange) {
      productConfig.onProductViewChange(filter, null);
    }
  };

  return (
    <div
      className={classNames}
      {...getComponentDataAttrs('search-listing', content.searchListingContent)}
    >
      <SearchInput
        searchPagePath={searchInputConfig.searchPagePath}
        searchResults={searchInputResults.list}
        content={content.searchInputContent}
        {...searchInputConfig}
        defaultSearchValue={defaultSearchValue}
        getSearchResults={searchInputConfig.getSearchSuggestionData}
        onSubmit={onSubmit}
        onClickSearchResultsItem={onClickSearchResultsItem}
      />
      <Filter
        className={cx(theme.recipeList__filter, 'wrapper search-filter')}
        // @ts-ignore
        allFilters={recipeConfig.tags}
        icons={icons}
        onChangeFilter={onChangeFilter}
        content={content.recipesContent}
        filterTitle={searchResultsText}
        currentFilters={filteringValue}
        searchQuery={defaultSearchValue}
        results={recipeResults.count + articleResults.count + productResults.count}
      />
      {recipeResults.count + articleResults.count + productResults.count ? (
        <Tabs
          className="search-tabs"
          content={tabs.content}
          dataFetched={
            articleResultsFetched &&
            recipeResultsFetched &&
            productResultsFetched
          }
        >
          {tabs.list.map(tab => tab)}
        </Tabs>
        ) : <NullResult content={content.nullResultContent} />
      }
    </div>
  );
};

export default SearchListing;
