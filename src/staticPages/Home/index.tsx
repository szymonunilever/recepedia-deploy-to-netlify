import { graphql } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import { Text, TagName } from 'src/components/lib/components/Text';
import cx from 'classnames';
import {
  RecipeListing,
  RecipeListViewType,
} from 'src/components/lib/components/RecipeListing';
import Hero from 'src/components/lib/components/Hero';
import { findPageComponentContent } from 'src/utils';
import Kritique from 'integrations/Kritique';
import ArrowIcon from 'src/svgs/inline/arrow-down.svg';
import PageListing from 'src/components/lib/components/PageListing';
import pageListingData from 'src/components/data/pageListing.json';
import DigitalData from 'integrations/DigitalData';
import theme from './home.module.scss';
import { RatingAndReviewsProvider } from 'src/components/lib/models/ratings&reviews';
import FavoriteIcon from '../../svgs/inline/favorite.svg';
import IntroQuiz from '../../components/page/IntroQuiz';
import localImage from '../../../stories/assets/localImage';
import quizContent from '../../components/data/introQuiz.json';

const HomePage = ({ data, pageContext }: HomePageProps) => {
  const [searchAgent, setSearchAgent] = useState(false);
  const {
    page: { seo, components },
  } = pageContext;
  // introQuizTitle and IntroQuizDescription should come from pageContext properties
  const introQuizTitle = 'Hello ! Welcome to Recepedia';
  const introQuizDescription =
    'We want to know you better and feed you with recipes you love!';
  const introContent = {
    title: introQuizTitle,
    description: introQuizDescription,
  };

  const recipes = data.allRecipe.nodes;

  useEffect(() => {
    //@ts-ignore
    setSearchAgent(window.searchAgentOnPage);
  }, []);

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
      <SEO {...seo} />
      {!searchAgent && (
        <IntroQuiz introContent={introContent} quizContent={quizContent} />
      )}
      <Kritique />
      <DigitalData pageContext={pageContext} data={data} />
      <section className="_bg--main">
        <div className="container">
          <Text
            tag={TagName['h1']}
            text={
              findPageComponentContent(components.items, 'Text', 'PageTitle')
                .text
            }
          />
        </div>
      </section>

      <section className={cx(theme.homeTopSection, 'bg--half')}>
        <div className="container">
          <RecipeListing
            content={findPageComponentContent(
              components.items,
              'RecipeListing',
              'LatestAndGreatest'
            )}
            list={recipes}
            ratingProvider={RatingAndReviewsProvider.kritique}
            className="recipe-list--blue-header recipe-list--carousel cards--2-4"
            viewType={RecipeListViewType.Carousel}
            titleLevel={2}
            withFavorite
            FavoriteIcon={FavoriteIcon}
            favorites={[]}
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
        </div>
      </section>

      <section className="_pt--40 _pb--40">
        <div className="container">
          <RecipeListing
            content={findPageComponentContent(
              components.items,
              'RecipeListing',
              'TopRecipes'
            )}
            list={recipes}
            withFavorite
            FavoriteIcon={FavoriteIcon}
            favorites={[]}
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
        </div>
      </section>

      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components.items, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted"
        />
      </section>
      <section className="_pt--40 _pb--40">
        <div className="container">
          <PageListing
            content={findPageComponentContent(components.items, 'PageListing')}
            list={pageListingData}
            initialCount={12}
          />
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

export const pageQuery = graphql`
  {
    allRecipe(limit: 6) {
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
    allRecipe: {
      nodes: Internal.Recipe[];
    };
    allTag: {
      nodes: Internal.Tag[];
    };
  };
  pageContext: {
    page: AppContent.Page;
  };
}
