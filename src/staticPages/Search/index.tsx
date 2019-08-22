import { graphql } from 'gatsby';
import React, { useEffect, useState, useCallback } from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import cx from 'classnames';
import Hero from 'src/components/lib/components/Hero';
import { findPageComponentContent } from 'src/utils';
import Kritique from 'integrations/Kritique';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import PageListing from 'src/components/lib/components/PageListing';
import pageListingData from 'src/components/data/pageListing.json';
import DigitalData from '../../../integrations/DigitalData';
import theme from './search.module.scss';
import SearchListing from 'src/components/lib/components/SearchListing';
import TagLinks from 'src/components/TagsLinks';
import { PageListingViewTypes } from 'src/components/lib/components/PageListing/models';
import { ReactComponent as SearchIcon } from 'src/svgs/inline/search-icon.svg';
import { ReactComponent as CloseSvg } from 'src/svgs/inline/x-mark.svg';
import { RecipeListViewType } from 'src/components/lib/components/RecipeListing';
import { ReactComponent as FavoriteIcon } from 'src/svgs/inline/favorite.svg';
import withLocation from 'src/components/lib/components/WithLocation';
import { WithLocationProps } from 'src/components/lib/components/WithLocation/models';
import { RatingAndReviewsProvider } from 'src/components/lib/models/ratings&reviews';
import useSearchResults from './useSearchResults';
import { getTagsFromRecipes } from 'src/utils/getTagsFromRecipes';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';

const SearchPage = ({ data, pageContext, searchQuery }: SearchPageProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  const { allTag } = data;

  const {
    getSearchData,
    getRecipeSearchData,
    getArticleSearchData,
    getSearchSuggestionData,
    recipeResults,
    articleResults,
    searchInputResults,
    resultsFetched,
    initialRecipesCount,
    initialTagsCount,
  } = useSearchResults(searchQuery);

  const [tagList, setTagList] = useState<Internal.Tag[]>([]);
  const [favorites, setFavorites] = useState(
    (getUserProfileByKey(ProfileKey.favorites) as number[]) || []
  );
  const updateFavoriteState = useCallback((favorites: number[]) => {
    updateFavorites(favorites);
    setFavorites(favorites);
  }, []);
  useEffect(() => {
    setTagList(getTagsFromRecipes(recipeResults.list, allTag.nodes));
  }, [recipeResults]);

  return (
    <Layout className={cx('search-page', theme.searchPage)}>
      <SEO {...seo} />
      <DigitalData title={seo.title} type={type} />
      <Kritique />
      <section className={theme.searchListingWrap}>
        <SearchListing
          searchQuery={searchQuery}
          searchResults={{
            recipeResults,
            searchInputResults,
            articleResults,
            resultsFetched,
          }}
          searchResultTitleLevel={3}
          config={{
            searchInputConfig: {
              getSearchSuggestionData,
              onClickSearchResultsItem: getSearchData,
              searchResultsCount: 8,
              labelIcon: <SearchIcon />,
              buttonResetIcon: <CloseSvg />,
              buttonSubmitIcon: <SearchIcon />,
            },
            recipeConfig: {
              getRecipeSearchData,
              viewType: RecipeListViewType.Base,
              FavoriteIcon,
              withFavorite: true,
              initialCount: initialRecipesCount,
              recipePerLoad: 4,
              favorites: favorites,
              onFavoriteChange: updateFavoriteState,
              imageSizes: '(min-width: 768px) 25vw, 50vw',
              ratingProvider: RatingAndReviewsProvider.kritique,
            },
            articleConfig: {
              getArticleSearchData,
            },
          }}
          content={{
            ...findPageComponentContent(components, 'SearchListing'),
          }}
        />
      </section>

      {tagList.length ? (
        <section className={theme.tagList}>
          <TagLinks
            initialCount={initialTagsCount}
            list={tagList}
            content={findPageComponentContent(components, 'Tags')}
          />
        </section>
      ) : null}

      <section>
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted"
        />
      </section>

      <section className={cx(theme.searchBottomCarousel, '_pb--40 _pt--40')}>
        <PageListing
          content={findPageComponentContent(
            components,
            'PageListing',
            'RecipeCategories'
          )}
          list={pageListingData}
          viewType={PageListingViewTypes.carousel}
          titleLevel={2}
          carouselConfig={{
            arrowIcon: <ArrowIcon />,
          }}
        />
      </section>
    </Layout>
  );
};

export default withLocation<SearchPageProps & WithLocationProps>(SearchPage);

export const pageQuery = graphql`
  {
    allTag {
      nodes {
        ...TagFields
      }
    }
  }
`;

export interface SearchPageProps {
  data: {
    allTag: {
      nodes: Internal.Tag[];
    };
  };
  pageContext: {
    page: AppContent.Page;
  };
  searchQuery: string;
}
