import { WindowLocation } from '@reach/router';
import cx from 'classnames';
import { graphql } from 'gatsby';
import DigitalData from 'integrations/DigitalData';
import Kritique from 'integrations/Kritique';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from 'src/components/Layout/Layout';
import {
  Hero,
  PageListing,
  RecipeListing,
  RecipeListViewType,
  TagName,
  RatingAndReviewsProvider,
  Text,
  RecipeListingIcons,
} from 'gatsby-awd-components/src';

import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';

import get from 'lodash/get';

import IntroQuiz from '../../components/page/IntroQuiz';

import theme from './home.module.scss';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
import useFavorite from 'src/utils/useFavorite';
import { getRecipes, isQuizesStored } from './helpers';
// Component Styles
import '../../scss/pages/_home.scss';
import { IMAGE_SIZES } from 'src/constants';
import xor from 'lodash/xor';
import { FROM, RESULT_SIZE } from '../../utils/getPersonalizationSearchData';
import {
  ReactComponent as ArrowIcon,
  ReactComponent as OpenIcon,
} from 'src/svgs/inline/arrow-down.svg';
import { ReactComponent as ClosedIcon } from 'src/svgs/inline/arrow-up.svg';
import { ReactComponent as FavoriteIcon } from 'src/svgs/inline/favorite.svg';
import { ReactComponent as FilterIcon } from 'src/svgs/inline/filter.svg';
import {
  ReactComponent as RemoveTagIcon,
  ReactComponent as CloseSvg,
} from 'src/svgs/inline/x-mark.svg';
export const icons: RecipeListingIcons = {
  close: CloseSvg,
  closed: ClosedIcon,
  favorite: FavoriteIcon,
  filter: FilterIcon,
  open: OpenIcon,
  removeTag: RemoveTagIcon,
};

const HomePage = ({ data, pageContext, location }: HomePageProps) => {
  const { latestAndGrates, topRecipes, allCategory } = data;
  topRecipes.nodes = xor(topRecipes.nodes, latestAndGrates.nodes).slice(
    FROM,
    RESULT_SIZE
  );
  const pageListingData = allCategory.nodes.map(category => ({
    ...category,
    path: category.fields.slug,
  }));
  const {
    page: { seo, components, type },
  } = pageContext;

  const quizContent = findPageComponentContent(components, 'Wizard');
  const introContent = {
    title: findPageComponentContent(components, 'Text', 'IntroQuizTitle')
      .text as string,
    description: findPageComponentContent(
      components,
      'Text',
      'IntroQuizDescription'
    ).text as string,
  };

  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  const [searchAgent, setSearchAgent] = useState(false);
  const [introModalClosed, setintroModalClosed] = useState(false);
  const [topRecipesResult, setTopRecipesResult] = useState<Internal.Recipe[]>(
    topRecipes.nodes
  );
  const [latestAndGratestResult, setLatestAndGratestResult] = useState<
    Internal.Recipe[]
  >(latestAndGrates.nodes);
  const [loadedTop, setLoadedTop] = useState(false);
  const [loadedLatest, setLoadedLatest] = useState(false);

  const isIntroDone = useCallback(() => {
    setintroModalClosed(true);
  }, []);

  const searchRecipes = () => {
    setLoadedLatest(false);
    setLoadedTop(false);
    getRecipes(latestAndGrates.nodes, {
      sort: [
        { creationTime: { order: 'desc' } },
        { averageRating: { order: 'desc' } },
      ],
    })
      .then(latestResult => {
        setLatestAndGratestResult(latestResult);
        setLoadedLatest(true);
        const recipeIds = latestResult.map(recipe => get(recipe, 'recipeId'));
        getRecipes(topRecipes.nodes, {
          sort: [
            { averageRating: { order: 'desc' } },
            { creationTime: { order: 'desc' } },
          ],
          exclude: [{ terms: { recipeId: recipeIds } }],
        })
          .then(topResult => {
            setTopRecipesResult(topResult);
            setLoadedTop(true);
          })
          .catch();
      })
      .catch();
  };

  useEffect(() => {
    //@ts-ignore
    setSearchAgent(window.searchAgentOnPage);
    //@ts-ignore
    setLoadedLatest(window.searchAgentOnPage);
    //@ts-ignore
    setLoadedTop(window.searchAgentOnPage);
    if (isQuizesStored() && !searchAgent) {
      searchRecipes();
    } else {
      setLoadedLatest(true);
      setLoadedTop(true);
    }
  }, []);

  useEffect(() => {
    if (isQuizesStored() && introModalClosed) {
      searchRecipes();
    }
  }, [introModalClosed]);

  return (
    <Layout className="header--bg">
      <SEO {...seo} canonical={location.href} />
      {!searchAgent && (
        <IntroQuiz
          introContent={introContent}
          quizContent={quizContent}
          onClose={isIntroDone}
          imageSizesOptions={IMAGE_SIZES.QUIZ_OPTIONS}
        />
      )}
      <Kritique />
      <DigitalData title={seo.title} type={type} />
      <section className={cx(theme.homeTitle, '_bg--main wrapper')}>
        <Text
          tag={TagName['h1']}
          text={findPageComponentContent(components, 'Text', 'PageTitle').text}
        />
      </section>
      <section className={cx(theme.homeHeroCarousel, 'bg--half wrapper')}>
        <RecipeListing
          icons={icons}
          content={findPageComponentContent(
            components,
            'RecipeListing',
            'LatestAndGreatest'
          )}
          favorites={Array.isArray(favorites) ? favorites : []}
          onFavoriteChange={updateFavoriteState}
          withFavorite={true}
          list={latestAndGratestResult}
          ratingProvider={RatingAndReviewsProvider.kritique}
          className={`${!loadedLatest &&
            theme.recipeHidden} recipe-list--blue-header recipe-list--carousel`}
          viewType={RecipeListViewType.Carousel}
          titleLevel={2}
          carouselConfig={{
            breakpoints: [
              {
                width: 768,
                switchElementsBelowBreakpoint: 1,
                switchElementsAfterBreakpoint: 1,
                visibleElementsBelowBreakpoint: 2,
                visibleElementsAboveBreakpoint: 4,
              },
            ],
            arrowIcon: <ArrowIcon />,
          }}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
        />
      </section>

      <section className={cx(theme.homeMiddleCarousel, 'wrapper')}>
        <RecipeListing
          icons={icons}
          content={findPageComponentContent(
            components,
            'RecipeListing',
            'TopRecipes'
          )}
          favorites={Array.isArray(favorites) ? favorites : []}
          onFavoriteChange={updateFavoriteState}
          withFavorite={true}
          list={topRecipesResult}
          ratingProvider={RatingAndReviewsProvider.kritique}
          viewType={RecipeListViewType.Carousel}
          className={`${!loadedTop &&
            theme.recipeHidden} recipe-list--carousel`}
          titleLevel={2}
          carouselConfig={{
            breakpoints: [
              {
                width: 768,
                switchElementsBelowBreakpoint: 1,
                switchElementsAfterBreakpoint: 1,
                visibleElementsBelowBreakpoint: 1,
                visibleElementsAboveBreakpoint: 2,
              },
            ],
            arrowIcon: <ArrowIcon />,
          }}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.NON_STANDARD}
        />
      </section>

      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          imageIsLink={false}
          className="hero--planner color--inverted"
        />
      </section>
      <section
        className={cx(theme.homeBottomCarousel, '_pt--40 _pb--40 wrapper')}
      >
        <PageListing
          content={findPageComponentContent(components, 'PageListing')}
          list={pageListingData}
          initialCount={12}
          imageSizes={IMAGE_SIZES.PAGE_LISTINGS.TILES}
        />
      </section>
    </Layout>
  );
};

export default HomePage;

export const pageQuery = graphql`
  {
    latestAndGrates: allRecipe(
      sort: { order: [DESC, DESC], fields: [creationTime, averageRating] }
      limit: 6
    ) {
      nodes {
        ...RecipeFields
      }
    }

    topRecipes: allRecipe(
      sort: { order: [DESC, DESC], fields: [averageRating, creationTime] }
      limit: 12
    ) {
      nodes {
        ...RecipeFields
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
  }
`;

interface HomePageProps {
  data: {
    latestAndGrates: {
      nodes: Internal.Recipe[];
    };
    topRecipes: {
      nodes: Internal.Recipe[];
    };
    allTag: {
      nodes: Internal.Tag[];
    };
    allCategory: {
      nodes: Internal.Category[];
    };
  };
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}
