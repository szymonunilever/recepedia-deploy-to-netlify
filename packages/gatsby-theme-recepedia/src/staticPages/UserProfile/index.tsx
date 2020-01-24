import cx from 'classnames';
import { graphql, Link, useStaticQuery } from 'gatsby';
import {
  Button,
  LoadMoreType,
  NullResult,
  PreferencesQuiz,
  RatingAndReviewsProvider,
  RecipeCard,
  CardLinkWrapper,
  RecipeListing,
  RecipeListViewType,
  Tab,
  Tabs,
  UserPreferences,
  UserPreferencesIcons,
  WithLocation as withLocation,
  WithLocationProps,
} from 'gatsby-awd-components/src';
import get from 'lodash/get';
import React, {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import { IMAGE_SIZES } from 'src/constants';
import { ReactComponent as IconArrowDown } from 'src/svgs/inline/arrow-down.svg';
import { ReactComponent as IconArrowUp } from 'src/svgs/inline/arrow-up.svg';
import {
  ReactComponent as IconSuccess,
  ReactComponent as CheckMarkIcon,
} from 'src/svgs/inline/checkmark-bigger.svg';
import { ReactComponent as IconDelete } from 'src/svgs/inline/delete.svg';
import { ReactComponent as IconEdit } from 'src/svgs/inline/edit.svg';
import { ReactComponent as IconError } from 'src/svgs/inline/x-mark.svg';
import { findPageComponentContent } from 'src/utils';
import {
  getUserProfileByKey,
  saveUserProfileByKey,
  updateFavorites,
} from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
import useFavorite from 'src/utils/useFavorite';
import DigitalData from '../../../integrations/DigitalData';
// Component Styles
import '../../scss/pages/_userProfile.scss';
import {
  favoriteButtonDefaults,
  RecipeListingIcons as icons,
} from '../../themeDefaultComponentProps';
import useFavoritesSearch from './useFavoritesSearch';
import { getPagePath } from '../../utils/getPagePath';
import theme from './UserProfile.module.scss';

const userPreferencesIcons: UserPreferencesIcons = {
  arrowUp: <IconArrowUp />,
  arrowDown: <IconArrowDown />,
  error: <IconError />,
  success: <IconSuccess />,
  edit: <IconEdit />,
  delete: <IconDelete />,
  checkMark: <CheckMarkIcon />,
};
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
const FavoritesRecipeListingPage: FunctionComponent<FavoriteRecipeListingProps> = ({
  pageContext: {
    page: { components, seo, type },
  },
  location,
}) => {
  const brandLogoLink = getPagePath('Search');
  const mealPlannerURL = getPagePath('MealPlanner');
  const allRecipesURL = getPagePath('AllRecipes');

  const wizardPages = useStaticQuery(graphql`
    {
      allPage(filter: { type: { in: ["Home", "MealPlanner"] } }) {
        nodes {
          type
          components {
            items {
              name
              content
            }
          }
        }
      }
    }
  `).allPage.nodes;
  const introQuizQuestions = JSON.parse(
    findPageComponentContent(
      wizardPages.find(node => node.type === 'Home').components,
      'Wizard'
    )
  ).questions;
  const MPQuizQuestions = JSON.parse(
    findPageComponentContent(
      wizardPages.find(node => node.type === 'MealPlanner').components,
      'Wizard'
    )
  ).wizardQuiz.questions;

  const recipeContent = findPageComponentContent(
    components,
    'RecipeListing',
    'Favorites'
  );
  const buttonContent = findPageComponentContent(
    components,
    'Button',
    'ProfileFavorites'
  );
  const tabsContent = findPageComponentContent(components, 'Tabs');
  const preferencesQuizContent = findPageComponentContent(
    components,
    'PreferencesQuiz',
    'IntroQuiz'
  );
  const mealPlannerQuizContent = findPageComponentContent(
    components,
    'PreferencesQuiz',
    'MealPlanner'
  );
  const userPreferencesContent = findPageComponentContent(
    components,
    'UserPreferences'
  );
  const mealPlanResultsContent = findPageComponentContent(
    components,
    'RecipeListing',
    'MealPlan'
  );
  const mealPlanButtonContent = findPageComponentContent(
    components,
    'Button',
    'ChangeMealPlan'
  );
  const nullResultContent = findPageComponentContent(components, 'NullResult');

  const [initialQuizAnswers, setInitialQuizAnswers] = useState(
    getUserProfileByKey(ProfileKey.initialQuiz)
  );
  const [mpAnswers, setMpAnswers] = useState(
    getUserProfileByKey(ProfileKey.mealPlannerAnswers)
  );

  const savedFavorites: number[] = Array.isArray(
    getUserProfileByKey(ProfileKey.favorites)
  )
    ? (getUserProfileByKey(ProfileKey.favorites) as number[])
    : [];
  const savedMealPlannerResults: number[] = Array.isArray(
    getUserProfileByKey(ProfileKey.mealPlannerResults)
  )
    ? (getUserProfileByKey(ProfileKey.mealPlannerResults) as number[])
    : [];
  const { getRecipeDataByIds, recipeList, totalCount } = useFavoritesSearch();
  const {
    getRecipeDataByIds: getMealPlannerResults,
    recipeList: mealPlannerResults,
  } = useFavoritesSearch();
  const hasFavorites = Array.isArray(recipeList)
    ? recipeList.length
    : undefined;
  const passedMealPlanner = Boolean(
    mealPlannerResults && mealPlannerResults.length
  );
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );

  const onLoadMoreRecipes = useCallback(
    (tags: Internal.Tag[], sortingOption: string, size: number) =>
      getRecipeDataByIds(savedFavorites.join(' OR '), savedFavorites, {
        from: get(recipeList, 'length', 0),
        size,
      }),
    [recipeList]
  );

  const deleteQuestion = useCallback((quizKey: ProfileKey, key: string) => {
    const quiz = getUserProfileByKey(quizKey);
    // @ts-ignore
    delete quiz[key];
    saveUserProfileByKey(quiz, quizKey);
    quizKey === ProfileKey.initialQuiz
      ? setInitialQuizAnswers(quiz)
      : setMpAnswers(quiz);
  }, []);
  const saveQuestion = useCallback(
    (quizKey: ProfileKey, key: string, value: string | object | null) => {
      const quiz = getUserProfileByKey(quizKey);
      // @ts-ignore
      quiz[key] = value;
      saveUserProfileByKey(quiz, quizKey);
      quizKey === ProfileKey.initialQuiz
        ? setInitialQuizAnswers(quiz)
        : setMpAnswers(quiz);
    },
    []
  );
  const onNewsletterFormSubmit = useCallback((values: object) => {
    // @todo real call
    // eslint-disable-next-line no-console
    console.log('values', values);
  }, []);

  useEffect(() => {
    getRecipeDataByIds(savedFavorites.join(' OR '), savedFavorites, {
      from: 0,
      size: 8,
    });
  }, []);
  useEffect(() => {
    const query = savedMealPlannerResults.join(' OR ');
    if (query) {
      getMealPlannerResults(query, savedMealPlannerResults, {
        from: 0,
        size: 7,
        sort: 'desc',
      });
    }
  }, []);
  const data = [
    {
      pattern: '{num}',
      replacement: (totalCount || 0).toString(),
    },
  ];
  const mealPlannerName =
    getUserProfileByKey(ProfileKey.mealPlannerName) ||
    mealPlanResultsContent.title;

  return (
    <Layout className="header--bg">
      <SEO {...seo} />
      <DigitalData title={seo && seo.title} type={type} />
      <Tabs
        content={tabsContent.tabsContent}
        tabsHeaderContent={tabsContent.tabsHeaderContent}
        data={data}
        className={cx(theme.userProfile, '')}
        tabFromLocation
        location={location}
        titleLevel={1}
      >
        <Tab
          view="ProfileFavorites"
          hasContent={Boolean(hasFavorites && hasFavorites > 0)}
        >
          <div className="user-profile-favorites">
            {hasFavorites === undefined ? null : hasFavorites ? (
              <RecipeListing
                content={recipeContent}
                list={recipeList || []}
                ratingProvider={RatingAndReviewsProvider.inline}
                className="recipe-list recipe-list--carousel favorites"
                initialCount={8}
                titleLevel={2}
                viewType={RecipeListViewType.Base}
                loadMoreConfig={{
                  type: LoadMoreType.async,
                  onLoadMore: onLoadMoreRecipes,
                  allCount: totalCount,
                }}
                imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
                brandLogoLink={brandLogoLink}
              >
                {recipeList
                  ? recipeList.map(recipe => (
                      <CardLinkWrapper
                        key={recipe.id}
                        title={recipe.title}
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
                            {...favoriteButtonDefaults}
                            isSelected={
                              favorites.indexOf(recipe.recipeId) !== -1
                            }
                            onClick={updateFavoriteState}
                          />
                        </RecipeCard>
                      </CardLinkWrapper>
                    ))
                  : []}
              </RecipeListing>
            ) : (
              <Fragment>
                <NullResult
                  content={nullResultContent}
                  className="recipe-list__null-results"
                  titleLevel={2}
                />
                <Link className="favorites__button" to={allRecipesURL}>
                  {buttonContent.label}
                </Link>
              </Fragment>
            )}
          </div>
        </Tab>
        <Tab view="UserPreferences" className={theme.userPreferences}>
          <UserPreferences
            icons={userPreferencesIcons}
            deleteQuestion={deleteQuestion}
            saveQuestion={saveQuestion}
            onNewsletterFormSubmit={onNewsletterFormSubmit}
            content={userPreferencesContent}
          >
            <PreferencesQuiz
              questions={introQuizQuestions}
              // @ts-ignore
              answers={initialQuizAnswers}
              heading={preferencesQuizContent.quizTitle}
              quizKey={ProfileKey.initialQuiz}
            />
            <PreferencesQuiz
              questions={MPQuizQuestions}
              // @ts-ignore
              answers={mpAnswers}
              heading={mealPlannerQuizContent.quizTitle}
              quizKey={ProfileKey.mealPlannerAnswers}
            />
          </UserPreferences>
        </Tab>
        <Tab
          view="MealPlanner"
          visible={passedMealPlanner}
          className="recipe-list--carousel"
        >
          <Fragment>
            <RecipeListing
              content={{ title: mealPlannerName }}
              viewType={RecipeListViewType.Carousel}
              list={mealPlannerResults || []}
              carouselConfig={carouselConfig}
              titleLevel={2}
              imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.MEAL_PLANNER}
              ratingProvider={RatingAndReviewsProvider.inline}
              brandLogoLink={brandLogoLink}
            >
              {mealPlannerResults
                ? mealPlannerResults.map(recipe => (
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
                  ))
                : []}
            </RecipeListing>
            <div className={theme.mealPlannerBtnWrap}>
              <Link
                className={cx(theme.mealPlannerBtn, 'button')}
                to={mealPlannerURL}
              >
                {mealPlanButtonContent.label}
              </Link>
            </div>
          </Fragment>
        </Tab>
      </Tabs>
    </Layout>
  );
};

export default withLocation<FavoriteRecipeListingProps & WithLocationProps>(
  // @ts-ignore
  FavoritesRecipeListingPage
);

interface FavoriteRecipeListingProps {
  pageContext: {
    page: AppContent.Page;
  };
  location?: Location;
}
