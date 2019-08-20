import { WindowLocation } from '@reach/router';
import cx from 'classnames';
import { graphql } from 'gatsby';
import DigitalData from 'integrations/DigitalData';
import Kritique from 'integrations/Kritique';
import React, { useEffect, useState } from 'react';
import pageListingData from 'src/components/data/pageListing.json';
import Layout from 'src/components/Layout/Layout';
import Hero from 'src/components/lib/components/Hero';
import PageListing from 'src/components/lib/components/PageListing';
import {
  RecipeListing,
  RecipeListViewType,
} from 'src/components/lib/components/RecipeListing';
import { TagName, Text } from 'src/components/lib/components/Text';
import { RatingAndReviewsProvider } from 'src/components/lib/models/ratings&reviews';
import SEO from 'src/components/Seo';
import { RecipePersonalizationFormula } from 'src/constants';
import { findPageComponentContent, useElasticSearch } from 'src/utils';
import keys from '../../../integrations/keys.json';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import { ReactComponent as FavoriteIcon } from '../../svgs/inline/favorite.svg';
import localImage from '../../../stories/assets/localImage';
import IntroQuiz from '../../components/page/IntroQuiz';
import generateQuery from '../../utils/queryGenerator';
import theme from './home.module.scss';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
import RecipeListingWithFavorites from 'src/components/lib/components/RecipeListing/WithFavorites';

const RESULT_SIZE = 6;
const FROM = 0;

const RecipeListingWithFavorite = RecipeListingWithFavorites(
  RecipeListing,
  updateFavorites,
  getUserProfileByKey(ProfileKey.favorites) as string[],
  FavoriteIcon
);

export const getPersonalizationSearchData = (
  searchQuery: string,
  {
    from = FROM,
    size = RESULT_SIZE,
    sort = [],
  }: { from: number; size: number; sort: any[] }
) => {
  const searchParams = {
    index: keys.elasticSearch.recipeIndex,
    body: {
      from,
      size,
      sort,
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        query_string: {
          query: `${searchQuery}`,
        },
      },
    },
  };
  return useElasticSearch<Internal.Recipe>(searchParams);
};

const HomePage = ({ data, pageContext, location }: HomePageProps) => {
  const [searchAgent, setSearchAgent] = useState(false);
  const isQuizStored = () =>
    !!Object.keys(getUserProfileByKey(ProfileKey.initialQuiz)).length;
  const [introDone, setIntroDone] = useState(isQuizStored());
  const isIntroDone = () => {
    setIntroDone(isQuizStored());
  };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPersonalizedRecipes = (): Promise<any>[] => {
    const introQuizAnswers = getUserProfileByKey(ProfileKey.initialQuiz);
    const mealPlanerAnswers = getUserProfileByKey(
      ProfileKey.mealPlannerAnswers
    );
    const queryString = generateQuery(
      introQuizAnswers,
      mealPlanerAnswers,
      RecipePersonalizationFormula
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: Promise<any>[] = [];
    if (queryString) {
      //TODO: When we will have rating we need to change query sorting params.
      promises.push(
        getPersonalizationSearchData(queryString, {
          from: FROM,
          size: RESULT_SIZE,
          sort: [{ creationTime: { order: 'desc' } }],
        })
      );

      //TODO: When we will have rating we need to change query sorting params.
      promises.push(
        getPersonalizationSearchData(queryString, {
          from: FROM,
          size: RESULT_SIZE,
          sort: [],
        })
      );
      return promises;
    }
    return [new Promise<any>((resolve, reject) => reject(''))];
  };
  const { latestAndGrates, topRecipes } = data;
  const [recipesFound, setRecipesFound] = useState<{
    personal: boolean;
    latestAndGratesNodes: Internal.Recipe[];
    topRecipesNodes: Internal.Recipe[];
  }>({
    personal: false,
    latestAndGratesNodes: [],
    topRecipesNodes: [],
  });
  useEffect(() => {
    //@ts-ignore
    setSearchAgent(window.searchAgentOnPage);
    if (!recipesFound.personal) {
      const promises = getPersonalizedRecipes();
      promises &&
        Promise.all(promises)
          .then(data => {
            const result = data.map(res =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              res.hits.hits.map((hit: any) => hit._source)
            );
            const latestAndGratesNodes =
              data[0].hits.total >= 6 ? result[0] : latestAndGrates.nodes;
            const topRecipesNodes =
              data[1].hits.total >= 6 ? result[1] : topRecipes.nodes;

            setRecipesFound({
              personal: true,
              latestAndGratesNodes,
              topRecipesNodes,
            });
          })
          .catch(() => {
            setRecipesFound({
              personal: true,
              latestAndGratesNodes: latestAndGrates.nodes,
              topRecipesNodes: topRecipes.nodes,
            });
          });
    } else if (!recipesFound.personal) {
      setRecipesFound({
        personal: false,
        latestAndGratesNodes: latestAndGrates.nodes,
        topRecipesNodes: topRecipes.nodes,
      });
    }
  });

  quizContent &&
    //@ts-ignore
    quizContent.questions.forEach(item => {
      //@ts-ignore
      item.options.forEach(option => {
        //@ts-ignore
        option.label.image.localImage = localImage;
      });
    });

  return (
    <Layout className="header--bg">
      <SEO {...seo} canonical={location.href} />
      {!searchAgent && (
        <IntroQuiz
          introContent={introContent}
          quizContent={quizContent}
          onClose={isIntroDone}
        />
      )}
      <Kritique />
      <DigitalData title={seo.title} type={type} />
      <section className={cx(theme.homeTitle, '_bg--main')}>
        <Text
          tag={TagName['h1']}
          text={findPageComponentContent(components, 'Text', 'PageTitle').text}
        />
      </section>

      {recipesFound.latestAndGratesNodes.length > 0 && (
        <section className={cx(theme.homeTopSection, 'bg--half')}>
          <RecipeListingWithFavorite
            content={findPageComponentContent(
              components,
              'RecipeListing',
              'LatestAndGreatest'
            )}
            list={recipesFound.latestAndGratesNodes}
            ratingProvider={RatingAndReviewsProvider.kritique}
            favorites={getUserProfileByKey(ProfileKey.favorites) as string[]}
            className="recipe-list--blue-header recipe-list--carousel cards--2-4"
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
            imageSizes={'(min-width: 768px) 25vw, 50vw'}
          />
        </section>
      )}
      {recipesFound.topRecipesNodes.length > 0 && (
        <section className="_pt--40 _pb--40">
          <RecipeListingWithFavorite
            content={findPageComponentContent(
              components,
              'RecipeListing',
              'TopRecipes'
            )}
            list={recipesFound.topRecipesNodes}
            favorites={getUserProfileByKey(ProfileKey.favorites) as string[]}
            ratingProvider={RatingAndReviewsProvider.kritique}
            viewType={RecipeListViewType.Carousel}
            className="recipe-list--carousel cards--1-2"
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
            imageSizes={'(min-width: 768px) 50vw, 100vw'}
          />
        </section>
      )}
      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted"
        />
      </section>
      <section className="_pt--40 _pb--40">
        <PageListing
          content={findPageComponentContent(components, 'PageListing')}
          list={pageListingData}
          initialCount={12}
        />
      </section>
    </Layout>
  );
};

export default HomePage;

//TODO: When we will have rating we need to change query sorting params for both requests latestAndGrates and topRecipes.
export const pageQuery = graphql`
  {
    latestAndGrates: allRecipe(
      sort: { order: DESC, fields: creationTime }
      limit: 6
    ) {
      nodes {
        ...RecipeFields
      }
    }

    topRecipes: allRecipe(limit: 6) {
      nodes {
        ...RecipeFields
      }
    }

    allTag {
      nodes {
        ...TagFields
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
  };
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}
