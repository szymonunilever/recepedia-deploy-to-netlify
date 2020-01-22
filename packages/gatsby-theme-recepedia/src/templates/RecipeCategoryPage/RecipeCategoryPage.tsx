import React from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import SEO from 'src/components/Seo';
import {
  RecipeCard,
  Listing,
  CardLinkWrapper,
  AdaptiveImage,
  Hero,
  LoadMoreType,
  PageListing,
  RecipeListing,
  RecipeListViewType,
  TagName,
  Tags,
  Text,
  RatingAndReviewsProvider,
  RichText,
  PageListingViewTypes,
  Button,
  RecipeCardWrapper,
  Card,
} from 'gatsby-awd-components/src';
import { findPageComponentContent, getImageAlt } from 'src/utils';
import cx from 'classnames';
import { favoriteButtonDefaults } from '../../themeDefaultComponentProps';
import theme from '../RecipeCategoryPage/RecipeCategoryPage.module.scss';
import DigitalData from '../../../integrations/DigitalData';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import useMedia from 'src/utils/useMedia';
import { WindowLocation } from '@reach/router';
// Component Styles
import '../../scss/pages/_recipeCategories.scss';
//TODO: add this part to main page json and remove this import
import withRecipeAsyncLoadMore from 'src/components/withRecipeAsyncLoadMore';
import { WithRecipeAsyncLoadMore } from 'src/components/withRecipeAsyncLoadMore/models';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
import useFavorite from 'src/utils/useFavorite';
import { IMAGE_SIZES } from 'src/constants';
import { dietaryAttributesIcons } from '../../themeDefaultComponentProps';
import { getPagePath } from '../../utils/getPagePath';
const RecipeCategoryPage = ({
  data,
  pageContext,
  location,
  recipeResultsList,
  recipeResultsCount,
  onLoadMoreRecipes,
}: RecipeCategoryPageProps) => {
  const {
    page: { components, seo, type },
    category,
  } = pageContext;
  const brandLogoLink = getPagePath('Search');

  const { localImage, title, description } = category;
  const {
    tags: { nodes: categoryTags },
    allArticle,
    allCategory,
    primaryTag,
  } = data;

  const activeAttribute =
    primaryTag && dietaryAttributesIcons[`${primaryTag.tagId}`];
  const attributeIcon = activeAttribute && activeAttribute.active;
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
  const initialTagsCount = useMedia(undefined, [9, 5]);
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  if (localImage) {
    const seoImage = seo.meta.find(item => {
      return item.name == 'og:image';
    });
    seoImage && (seoImage.content = localImage.childImageSharp.fluid.src);
  }
  const tagList = categoryTags ? categoryTags.map(tag => tag.tagId) : [];
  let relatedArticles = allArticle.nodes
    .filter(art => art.tags && art.tags.some(tag => tagList.includes(tag)))
    .slice(0, 4);
  if (!relatedArticles.length) {
    relatedArticles = allArticle.nodes.slice(0, 4);
  }
  const searchPath = getPagePath('Search');
  const articleCards = relatedArticles.map(relatedArticle => (
    <CardLinkWrapper
      key={relatedArticle.fields.slug}
      title={relatedArticle.title}
      slug={relatedArticle.fields.slug}
      cardKey={relatedArticle.fields.slug}
    >
      <RecipeCardWrapper
        key={relatedArticle.fields.slug}
        ratingProvider={RatingAndReviewsProvider.none}
        cardKey={relatedArticle.fields.slug}
      >
        <Card
          showDescription
          idPropertyName="id"
          key={relatedArticle.fields.slug}
          content={{
            ...relatedArticle,
            title: relatedArticle.title,
            description: relatedArticle.shortDescription,
            localImage: relatedArticle.localImage,
          }}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          cardKey={relatedArticle.fields.slug}
          brandName={relatedArticle.brand}
          brandLink={searchPath}
        />
      </RecipeCardWrapper>
    </CardLinkWrapper>
  ));
  return (
    <Layout className={classWrapper}>
      <SEO
        {...seo}
        title={title}
        description={description}
        canonical={location.href}
      />
      <DigitalData title={title} type={type} />
      <section className={cx(theme.pageTitle__wrap, '_pt--40')}>
        {category.primaryTag && attributeIcon && (
          <span className={theme.nutritionIcon}>{attributeIcon}</span>
        )}
        <Text className={theme.pageTitle} tag={TagName['h1']} text={title} />
      </section>
      <section>
        <div className="container">
          <RichText
            type="html"
            className={cx(theme.heroDescription, 'wrapper')}
            content={{ text: description }}
          />
        </div>
      </section>
      {localImage && (
        <section className={cx(theme.heroBg, 'wrapper')}>
          <AdaptiveImage
            className={theme.heroBgImage}
            localImage={localImage}
            alt={getImageAlt(title, category.fields.slug)}
            sizes={'(max-width: 1366px) 100vw, 1100px'}
          />
        </section>
      )}
      <section
        className={cx(
          theme.greyBg,
          theme.recipeCategoryPageRecipes,
          '_bg--main wrapper'
        )}
      >
        <RecipeListing
          className="_pb--40"
          content={{
            ...recipesListingContent,
            title: recipesListingContent.title.replace(
              '{numRes}',
              recipeResultsCount
            ),
          }}
          list={recipeResultsList}
          ratingProvider={RatingAndReviewsProvider.inline}
          viewType={RecipeListViewType.Base}
          loadMoreConfig={{
            type: LoadMoreType.async,
            onLoadMore: onLoadMoreRecipes,
            allCount: recipeResultsCount,
          }}
          titleLevel={2}
          recipePerLoad={4}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          brandLogoLink={brandLogoLink}
        >
          {recipeResultsList
            ? recipeResultsList.map(recipe => (
                <CardLinkWrapper
                  cardKey={recipe.id}
                  title={recipe.title}
                  key={recipe.id}
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
                      {...favoriteButtonDefaults}
                      isSelected={favorites.indexOf(recipe.recipeId) !== -1}
                      onClick={updateFavoriteState}
                    />
                  </RecipeCard>
                </CardLinkWrapper>
              ))
            : []}
        </RecipeListing>
        {articleCards.length ? (
          <div className={cx(theme.articleRecent, '_pb--40 _pt--40')}>
            <Listing
              content={findPageComponentContent(components, 'RelatedArticles')}
              titleLevel={2}
            >
              {articleCards}
            </Listing>
          </div>
        ) : null}
      </section>
      {categoryTags.length > 0 && (
        <section className={theme.tagList}>
          <Tags
            initialCount={initialTagsCount}
            list={categoryTags}
            content={findPageComponentContent(components, 'Tags')}
          />
        </section>
      )}

      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className={'hero--planner color--inverted'}
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>

      <section
        className={cx(theme.recipeBottomCarousel, '_pt--40 _pb--40 wrapper')}
      >
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

export default withRecipeAsyncLoadMore(RecipeCategoryPage);

export const query = graphql`
  query($tags: [Int], $slug: String, $primaryTagId: Int) {
    allRecipe(
      limit: 8
      sort: { order: DESC, fields: creationTime }
      filter: {
        tagGroups: { elemMatch: { tags: { elemMatch: { id: { in: $tags } } } } }
      }
    ) {
      nodes {
        ...RecipeFields
      }
      totalCount
    }

    tags: allTag(filter: { tagId: { in: $tags } }) {
      nodes {
        ...TagFields
      }
    }

    allCategory(
      limit: 15
      filter: { showOnHomepage: { ne: 0 }, fields: { slug: { ne: $slug } } }
      sort: { order: ASC, fields: showOnHomepage }
    ) {
      nodes {
        ...CategoryFields
      }
    }
    primaryTag: tag(tagId: { eq: $primaryTagId }) {
      id
      name
      tagId
      title
      disclaimer
      fields {
        slug
      }
    }
    allArticle(sort: { fields: creationTime, order: DESC }) {
      nodes {
        ...ArticleFields
      }
    }
  }
`;

interface RecipeCategoryPageProps extends WithRecipeAsyncLoadMore {
  data: {
    allRecipe: {
      nodes: Internal.Recipe[];
    };
    allArticle: {
      nodes: Internal.Article[];
    };
    tags: {
      nodes: Internal.Tag[];
    };
    allCategory: {
      nodes: Internal.Category[];
    };
    primaryTag: Internal.Tag;
  };
  pageContext: {
    page: AppContent.Page;
    category: Internal.Category;
    tags: number[];
    recipeDetails: AppContent.Category.RecipeDetails;
    slug: string;
  };
  location: WindowLocation;
}
