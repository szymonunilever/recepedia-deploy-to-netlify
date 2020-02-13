import React, { useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import { getImageAlt } from 'gatsby-awd-components/src/utils';
import cx from 'classnames';
import { favoriteButtonDefaults } from '../../themeDefaultComponentProps';
import theme from './ContentHubPage.module.scss';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
// Component Styles
import '../../scss/pages/_contentHub.scss';
//TODO: add this part to main page json and remove this import
import useMedia from 'src/utils/useMedia';
import withRecipeAsyncLoadMore from 'src/components/withRecipeAsyncLoadMore';
import { WithRecipeAsyncLoadMore } from 'src/components/withRecipeAsyncLoadMore/models';
import useFavorite from 'src/utils/useFavorite';
import { IMAGE_SIZES } from 'src/constants';
import noindexTagsList from 'src/tags-noindex';
import { getPagePath } from '../../utils/getPagePath';
import {
  PageListing,
  PageListingViewTypes,
} from 'gatsby-awd-components/src/components/PageListing';
import RecipeListing, {
  LoadMoreType,
  RecipeListViewType,
} from 'gatsby-awd-components/src/components/RecipeListing';
import { CardLinkWrapper } from 'gatsby-awd-components/src/components/CardLinkWrapper';
import { RecipeCard } from 'gatsby-awd-components/src/components/RecipeCard';
import { Hero } from 'gatsby-awd-components/src/components/Hero';
import { RatingAndReviewsProvider } from 'gatsby-awd-components/src';
import Tags from 'gatsby-awd-components/src/components/Tags';
import Button from 'gatsby-awd-components/src/components/Button';

const ContentHubPage: React.FunctionComponent<ContentHubPageProps> = ({
  data,
  pageContext,
  location,
  tagList,
  recipeResultsList,
  recipeResultsCount,
  onLoadMoreRecipes,
}) => {
  const {
    page: { components, seo, type },
    name,
    slug: tagSlug,
  } = pageContext;
  const {
    tag,
    allCategory,
    site: {
      siteMetadata: { lang: locale },
    },
  } = data;
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  const brandLogoLink = getPagePath('Search');

  const pageListingData = allCategory.nodes.map(category => ({
    ...category,
    path: category.fields.slug,
    image: {
      alt: getImageAlt(category.title, category.fields.slug),
    },
  }));

  const classWrapper = cx(theme.recipeCategoryPage, 'recipe-category-page');
  const recipesListingContent = findPageComponentContent(
    components,
    'RecipeListing',
    'RecipesByCategory'
  );

  const onLoadMore = useCallback(() => {
    // @ts-ignore
    return onLoadMoreRecipes([], { creationTime: { order: 'DESC' } }, 4, {
      query: name,
      fields: ['tagGroups.tags.name'],
    });
  }, [recipeResultsList]);

  const noindexLocalTags = noindexTagsList[locale.toLowerCase()];
  return (
    <Layout className={classWrapper}>
      <SEO
        {...seo}
        title={tag.title}
        description={`Receitas - ${tag.title}`}
        canonical={location.href}
      >
        {noindexLocalTags &&
          noindexLocalTags.indexOf(tagSlug.replace(/\//g, '')) > -1 && (
            <meta name="robots" content="noindex" />
          )}
      </SEO>
      <DigitalData title={tag.title} type={type} />

      <section className={cx(theme.contentHubRecipes, 'bg--half wrapper')}>
        <RecipeListing
          content={{
            ...recipesListingContent,
            title: recipesListingContent.title
              .replace('{numRes}', recipeResultsCount)
              .replace('{categoryName}', `${tag.title}`),
          }}
          list={recipeResultsList}
          ratingProvider={RatingAndReviewsProvider.inline}
          viewType={RecipeListViewType.Base}
          loadMoreConfig={{
            type: LoadMoreType.async,
            onLoadMore,
            allCount: recipeResultsCount,
          }}
          initialCount={useMedia()}
          titleLevel={1}
          recipePerLoad={4}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          brandLogoLink={brandLogoLink}
        >
          {recipeResultsList
            ? recipeResultsList.map(recipe => (
                <CardLinkWrapper
                  title={recipe.title}
                  key={recipe.id}
                  slug={recipe.fields.slug}
                  cardKey={recipe.id}
                >
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    slug={recipe.fields.slug}
                    ratingProvider={RatingAndReviewsProvider.inline}
                    imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
                    content={{ title: recipe.title }}
                  >
                    <Button
                      {...favoriteButtonDefaults}
                      isSelected={favorites.indexOf(recipe.recipeId) !== -1}
                      onClick={updateFavoriteState}
                    />
                  </RecipeCard>
                </CardLinkWrapper>
              ))
            : []}
        </RecipeListing>
      </section>
      <section className={theme.tagList}>
        <Tags
          list={tagList}
          content={findPageComponentContent(components, 'Tags')}
          initialCount={useMedia(undefined, [9, 5])}
        />
      </section>

      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted"
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>

      <section className="_pb--40 _pt--40 wrapper">
        <PageListing
          content={findPageComponentContent(
            components,
            'PageListing',
            'RecipeCategories'
          )}
          viewType={PageListingViewTypes.carousel}
          list={pageListingData}
          carouselConfig={{
            arrowIcon: <ArrowIcon />,
          }}
          imageSizes={IMAGE_SIZES.PAGE_LISTINGS.CAROUSEL}
        />
      </section>
    </Layout>
  );
};

export default withRecipeAsyncLoadMore<ContentHubPageProps>(ContentHubPage);

export const query = graphql`
  query($slug: String, $name: String) {
    tag(fields: { slug: { eq: $slug } }) {
      name
      title
      tagId
      id
    }

    allRecipe(
      limit: 8
      sort: { order: DESC, fields: creationTime }
      filter: {
        tagGroups: {
          elemMatch: { tags: { elemMatch: { name: { eq: $name } } } }
        }
      }
    ) {
      nodes {
        ...RecipeCardFields
        tagGroups {
          label
          name
          tags {
            id
            name
          }
        }
      }
      totalCount
    }

    allTag {
      nodes {
        ...TagFields
      }
    }

    allCategory(
      limit: 15
      filter: { showOnHomepage: { ne: 0 } }
      sort: { order: ASC, fields: showOnHomepage }
    ) {
      nodes {
        ...CategoryFields
      }
    }

    site {
      siteMetadata {
        lang
      }
    }
  }
`;

interface ContentHubPageProps extends WithRecipeAsyncLoadMore {
  data: {
    tag: Internal.Tag;
    allRecipe: {
      nodes: Internal.Recipe[];
    };
    allTag: {
      nodes: Internal.Tag[];
    };
    allCategory: {
      nodes: Internal.Category[];
    };
    site: {
      siteMetadata: {
        lang: string;
      };
    };
  };
  pageContext: {
    page: AppContent.Page;
    name: string;
    slug: string;
  };
  location: WindowLocation;
}
