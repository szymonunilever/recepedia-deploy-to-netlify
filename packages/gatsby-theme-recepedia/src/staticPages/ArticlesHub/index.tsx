import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import cx from 'classnames';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import { IMAGE_SIZES } from 'src/constants';
import MediaGallery, {
  MediaGalleryViewType,
} from 'gatsby-awd-components/src/components/MediaGallery';
import { ReactComponent as IconArrowDown } from '../../svgs/inline/arrow-down.svg';
import { ReactComponent as Spinner } from '../../svgs/inline/spinner.svg';
import withArticleAsyncLoadMore from '../../components/withArticleAsyncLoadMore';
import { WithArticleAsyncLoadMore } from '../../components/withArticleAsyncLoadMore/models';
import { getPagePath } from '../../utils/getPagePath';
import { favoriteButtonDefaults } from '../../themeDefaultComponentProps';
import useFavorite from '../../utils/useFavorite';
import {
  getUserProfileByKey,
  updateFavorites,
} from '../../utils/browserStorage';
import { ProfileKey } from '../../utils/browserStorage/models';
// Component Styles
import '../../scss/pages/_articleHub.scss';
import theme from 'src/staticPages/ArticlesHub/ArticleHub.module.scss';
import useMedia from '../../utils/useMedia';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { CardLinkWrapper } from 'gatsby-awd-components/src/components/CardLinkWrapper';
import {
  RecipeListing,
  RecipeListViewType,
} from 'gatsby-awd-components/src/components/RecipeListing';
import { Hero } from 'gatsby-awd-components/src/components/Hero';
import { RecipeCard } from 'gatsby-awd-components/src/components/RecipeCard';
import Loader from 'gatsby-awd-components/src/components/Loader';
import { RatingAndReviewsProvider } from 'gatsby-awd-components/src';
import { Tags } from 'gatsby-awd-components/src/components/Tags';
import Button from 'gatsby-awd-components/src/components/Button';

const ArticlesHub: React.FunctionComponent<ArticlesHubProps> = ({
  data,
  pageContext,
  location,
  onLoadMoreArticles,
  articleResultsCount,
  articleResultsList,
  dataFetched,
}) => {
  const {
    page: { components, seo, type, title = '' },
  } = pageContext;
  const { allRecipe, allArticle, allTag } = data;
  const brandLogoLink = getPagePath('Search');
  const initialCount = useMedia(undefined, [9, 5]);
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  const [tagList, setTagList] = useState<Internal.Tag[]>([]);
  const carouselConfig = {
    breakpoints: [
      {
        width: 1366,
        switchElementsBelowBreakpoint: 1,
        switchElementsAfterBreakpoint: 1,
        visibleElementsBelowBreakpoint: 2,
        visibleElementsAboveBreakpoint: 4,
      },
    ],
    arrowIcon: <IconArrowDown />,
  };

  useEffect(() => {
    const articleTags: number[] = [];
    allArticle.nodes.forEach(article => {
      article.tags.forEach(tag => {
        if (articleTags.includes(tag)) {
          return;
        }
        articleTags.push(tag);
      });
    });
    setTagList(allTag.nodes.filter(tag => articleTags.includes(tag.tagId)));
  }, [allArticle]);

  const onLoadMore = useCallback(
    size => {
      return onLoadMoreArticles(articleResultsList.length, size);
    },
    [onLoadMoreArticles]
  );

  return (
    <Layout className={theme.articleHubWrap}>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <Loader isLoading={!dataFetched}>
        <Spinner />
      </Loader>
      <section className={cx(theme.articleHubTitle, 'wrapper', '_pt--40')}>
        <Text tag={TagName['h1']} text={title} />
      </section>
      <section className="wrapper _pb--40">
        <MediaGallery
          content={findPageComponentContent(components, 'ArticleListing')}
          list={articleResultsList}
          allCount={articleResultsCount}
          onLoadMore={onLoadMore}
          viewType={MediaGalleryViewType.TwoRowed}
          brandLogoLink={brandLogoLink}
        />
      </section>
      {!!tagList.length && (
        <section className={cx(theme.articleHubTags, 'wrapper')}>
          <Tags
            list={tagList}
            content={findPageComponentContent(components, 'Tags')}
            initialCount={initialCount}
            className="_pb--40 _pt--40"
          />
        </section>
      )}
      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted"
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>
      <section className="wrapper _pb--40 _pt--40">
        <RecipeListing
          content={findPageComponentContent(components, 'RecipeListing')}
          viewType={RecipeListViewType.Carousel}
          list={allRecipe.nodes}
          carouselConfig={carouselConfig}
          titleLevel={2}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.MEAL_PLANNER}
          ratingProvider={RatingAndReviewsProvider.inline}
          brandLogoLink={brandLogoLink}
          className={cx(theme.articleHubRecipeListing)}
        >
          {allRecipe.nodes.map(recipe => (
            <CardLinkWrapper
              key={recipe.id}
              title={recipe.title}
              cardKey={recipe.id}
              slug={recipe.fields.slug}
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
          ))}
        </RecipeListing>
      </section>
    </Layout>
  );
};

export default withArticleAsyncLoadMore<ArticlesHubProps>(ArticlesHub);

export const query = graphql`
  query {
    allArticle {
      nodes {
        ...ArticleFields
      }
      totalCount
    }
    allTag {
      nodes {
        ...TagFields
      }
    }
    allRecipe(limit: 6) {
      nodes {
        ...RecipeCardFields
      }
    }
  }
`;

interface ArticlesHubProps extends WithArticleAsyncLoadMore {
  data: {
    allRecipe: {
      nodes: Internal.Recipe[];
    };
    allArticle: {
      nodes: Internal.Article[];
      totalCount: number;
    };
    allTag: {
      nodes: Internal.Tag[];
    };
  };
  articleResults: {
    list: Internal.Article[];
    count: number;
  };
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}
