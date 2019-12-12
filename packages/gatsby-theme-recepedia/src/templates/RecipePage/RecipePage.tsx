import React from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import SEO from 'src/components/Seo';
import {
  RecipeCard,
  CardLinkWrapper,
  Hero,
  Rating,
  RecipeAttributes,
  RecipeAttributesKeys,
  RecipeCookingMethod,
  RecipeCopy,
  RecipeCopyViewType,
  RecipeDietaryAttributes,
  RecipeHero,
  RecipeListing,
  RecipeListViewType,
  RecipeMicrodata,
  RecipeNutrients,
  RecipeNutrientsViewType,
  Reviews,
  SocialIcons,
  SocialSharing,
  SocialSharingViewType,
  Tabs,
  Tab,
  TagName,
  Tags,
  Button,
  RatingAndReviewsProvider,
  Text,
} from 'gatsby-awd-components/src';
import { ReactComponent as RecipeClock } from 'src/svgs/inline/recipe-clock.svg';
import { ReactComponent as RecipeDifficulty } from 'src/svgs/inline/recipe-difficulty.svg';
import { ReactComponent as RecipePeople } from 'src/svgs/inline/recipe-people.svg';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import {
  favoriteButtonDefaults,
  RecipeListingIcons as recipeListingIcons,
} from '../../themeDefaultComponentProps';
import theme from './RecipePage.module.scss';
import cx from 'classnames';
import { findPageComponentContent } from 'src/utils';
import { ReactComponent as FavoriteIcon } from '../../svgs/inline/favorite.svg';
import * as icons from 'src/svgs/attributes';
import { ReactComponent as CloseIcon } from 'src/svgs/inline/x-mark.svg';
import AddThis from '../../../integrations/AddThis';
import { ReactComponent as FacebookIcon } from 'src/svgs/inline/facebook.svg';
import { ReactComponent as TwitterIcon } from 'src/svgs/inline/twitter.svg';
import { ReactComponent as PinterestIcon } from 'src/svgs/inline/pinterest.svg';
import DigitalData from '../../../integrations/DigitalData';
import { getTagsFromRecipes } from 'src/utils/getTagsFromRecipes';
import { WindowLocation } from '@reach/router';
import useMedia from 'src/utils/useMedia';
import { getUserProfileByKey, updateFavorites } from 'src/utils/browserStorage';
import { ProfileKey } from 'src/utils/browserStorage/models';
import useFavorite from 'src/utils/useFavorite';
// Component Styles
import '../../scss/pages/_recipePage.scss';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { ReactComponent as InfoIcon } from '../../svgs/inline/info.svg';
import { IMAGE_SIZES } from 'src/constants';
import { ReactComponent as OpenModelButtonIcon } from '../../svgs/inline/social-sharing.svg';

const infoIcon = <InfoIcon />;
const dietaryAttributesIcons = [
  {
    id: [11, 12909],
    active: <icons.VegeterianActive />,
    inActive: <icons.VegeterianInactive />,
  },
  {
    id: [10, 13153],
    active: <icons.VeganActive />,
    inActive: <icons.VeganInactive />,
  },
  {
    id: [3, 12941],
    active: <icons.GlutenFreeActive />,
    inActive: <icons.GlutenFreeInactive />,
  },
  {
    id: [4, 12886],
    active: <icons.LactoseFreeActive />,
    inActive: <icons.LactoseFreeInactive />,
  },
  {
    id: [2, 12942],
    active: <icons.EggFreeActive />,
    inActive: <icons.EggFreeInactive />,
  },

  // TODO replace below icons with proper onesafter
  {
    id: [1, 12914],
    active: <icons.DairyFreeActive />,
    inActive: <icons.DairyFreeInactive />,
  },
  {
    id: 12595,
    active: <icons.SeafoodFreeActive />,
  },
  {
    id: 12628,
    active: <icons.SoyFreeActive />,
  },
  {
    id: 12913,
    active: <icons.SugarFreeActive />,
  },
];
const socialIcons: SocialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  pinterest: PinterestIcon,
};

const isRecipeValidForReview = (recipe: Internal.Recipe, tagIds: number[]) =>
  Boolean(recipe.description) && !isEmpty(tagIds);

const RecipePage: React.FunctionComponent<RecipePageProps> = ({
  pageContext,
  location,
  data: { recipeTags },
}) => {
  const {
    page: { components, seo, type },
    recipe,
    relatedRecipes,
  } = pageContext;
  const classWrapper = cx(theme.recipePage, 'recipe-page header--bg');
  const tags = recipeTags.nodes;
  const isRecipeValid = isRecipeValidForReview(recipe, pageContext.tagIds);
  /*We use this way because we don't need to show inactive dietary attributes.
   * If we need to show it we should do few requests to get All dietary attributes includes freeFormTags
   * for use custom dietary attributes and use it for attributes property in RecipeDietaryAttributes component.
   * And add showInactiveAttributes flag for this component.*/
  const recipeRMSTags = flatMap(recipe.tagGroups, tagGroup => tagGroup.tags);
  const existingImagesIds = flatMap(dietaryAttributesIcons, icon => icon.id);
  const showDietaryTags = intersection(existingImagesIds, pageContext.tagIds);

  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  const initialTagsCount = useMedia(undefined, [9, 5]);
  const tagList = getTagsFromRecipes([recipe], tags);
  const recipeHero = (
    <>
      <RecipeHero
        content={recipe}
        imageSizes={'(max-width: 1366px) 100vw, 800px'}
      />
      <div className={theme.recipeHeroActions}>
        <div>
          <Button
            Icon={FavoriteIcon}
            isSelected={favorites.includes(recipe.recipeId)}
            onClick={() => {
              updateFavoriteState(
                !favorites.includes(recipe.recipeId),
                recipe.recipeId
              );
            }}
            isToggle={true}
            className="recipe-hero__favorite action-button"
            attributes={{ 'aria-label': 'favorite toggle' }}
          />
        </div>
        <>
          <SocialSharing
            content={findPageComponentContent(components, 'SocialSharing')}
            viewType={SocialSharingViewType.Modal}
            CloseButtonIcon={CloseIcon}
            icons={socialIcons}
            titleLevel={4}
            WidgetScript={AddThis}
            OpenModelButtonIcon={OpenModelButtonIcon}
          />
        </>
      </div>
    </>
  );

  if (recipe.localImage) {
    const seoImage = seo.meta.find(item => {
      return item.name == 'og:image';
    });
    seoImage &&
      (seoImage.content = recipe.localImage.childImageSharp.fluid.src);
  }

  return (
    <Layout className={classWrapper}>
      <SEO
        {...seo}
        title={recipe.title}
        description={recipe.description}
        canonical={location.href}
      />
      <DigitalData title={recipe.title} type={type} />
      <RecipeMicrodata recipe={recipe} />

      <section className={cx(theme.recipePageHero, '_bg--main wrapper')}>
        <div className={theme.recipeTopBlock}>
          <div className={theme.recipeTopBlockItem}>
            <div className={theme.recipeHeroDesktop}>{recipeHero}</div>
          </div>
          <div className={theme.recipeTopBlockItem}>
            <div className={theme.recipeHeroMobile}>{recipeHero}</div>
            <div className={theme.recipeBlockTitle}>
              <RecipeCopy
                viewType={RecipeCopyViewType.Title}
                recipe={recipe}
                content={{}}
                className="recipe-copy__title"
              />
              {isRecipeValid ? (
                <Rating
                  recipeId={recipe.recipeId}
                  provider={RatingAndReviewsProvider.kritique}
                  averageRating={recipe.averageRating}
                  linkTo={recipe.fields.slug}
                />
              ) : null}
            </div>
            <div className={theme.recipeBlockDescription}>
              <RecipeCopy
                viewType={RecipeCopyViewType.Description}
                recipe={recipe}
                content={{}}
                className="recipe-copy__description"
              />
              <RecipeAttributes
                //@ts-ignore
                recipe={recipe}
                visible={[
                  RecipeAttributesKeys.serves,
                  RecipeAttributesKeys.cookTime,
                  RecipeAttributesKeys.difficulties,
                ]}
                icons={{
                  cookTime: RecipeClock,
                  serves: RecipePeople,
                  difficulties: RecipeDifficulty,
                }}
                className="recipe-attributes"
                content={findPageComponentContent(
                  components,
                  'RecipeAttributes'
                )}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div
          className={cx(
            theme.recipeIngredientsCooking,
            '_pb--40 , _pt--40 wrapper'
          )}
        >
          <RecipeCopy
            viewType={RecipeCopyViewType.Ingredients}
            recipe={recipe}
            content={findPageComponentContent(
              components,
              'RecipeCopy',
              'Ingredients'
            )}
            className={theme.recipeCopyIngredients}
          />
          <RecipeCookingMethod
            methodList={recipe.methods}
            className={theme.recipeCookingMethod}
            content={findPageComponentContent(
              components,
              'RecipeCookingMethod'
            )}
          />
        </div>
        <div className={theme.recipeIngredientsCookingMobile}>
          <Tabs
            className={cx(theme.recipeIngredientsCookingTabs, 'tabs')}
            content={findPageComponentContent(components, 'Tabs')}
          >
            <Tab
              className={cx(theme.recipeIngredientsTab)}
              view="recipeTabIngredients"
            >
              <RecipeCopy
                viewType={RecipeCopyViewType.Ingredients}
                recipe={recipe}
                content={{}}
                className={theme.recipeCopyIngredients}
              />
            </Tab>
            <Tab
              className={cx(theme.recipeCookingTab)}
              view="recipeTabCookingMethod"
            >
              <RecipeCookingMethod
                methodList={recipe.methods}
                className={theme.recipeCookingMethod}
                content={{}}
              />
            </Tab>
          </Tabs>
        </div>
      </section>
      {showDietaryTags.length || recipe.nutrients.length ? (
        <section
          className={cx(theme.recipePageNutritional, '_pb--40 _pt--40 wrapper')}
        >
          <Text
            text={
              findPageComponentContent(components, 'Text', 'NutritionalTitle')
                .text
            }
            tag={TagName.h2}
          />
          <RecipeDietaryAttributes
            activeAttributes={recipeRMSTags}
            infoIcon={infoIcon}
            showInactiveAttributes
            attributes={tags}
            icons={dietaryAttributesIcons}
          />
          <RecipeNutrients
            recipe={recipe}
            content={findPageComponentContent(components, 'RecipeNutrients')}
            viewType={RecipeNutrientsViewType.WithAction}
            CloseButton={CloseIcon}
          />
        </section>
      ) : null}
      {isRecipeValid ? (
        <section className={cx(theme.reviews, '_pt--40 wrapper ')}>
          <Reviews
            recipeId={recipe.recipeId}
            provider={RatingAndReviewsProvider.kritique}
            linkTo={recipe.fields.slug}
          />
        </section>
      ) : null}

      <section className={theme.tagList}>
        <Tags
          initialCount={initialTagsCount}
          list={tagList}
          content={findPageComponentContent(components, 'Tags')}
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
      <section
        className={cx(
          theme.recipePageBottomCarousel,
          '_pt--40 _pb--40 wrapper'
        )}
      >
        <RecipeListing
          content={findPageComponentContent(
            components,
            'RecipeListing',
            'RelatedRecipes'
          )}
          icons={recipeListingIcons}
          list={relatedRecipes}
          ratingProvider={RatingAndReviewsProvider.inline}
          viewType={RecipeListViewType.Carousel}
          className="recipe-list--carousel"
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
        >
          {relatedRecipes
            ? relatedRecipes.map(recipe => (
                <CardLinkWrapper
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
      </section>
    </Layout>
  );
};

export default RecipePage;

export const query = graphql`
  query($tagIds: [Int]) {
    recipeTags: allTag(filter: { tagId: { in: $tagIds } }) {
      nodes {
        ...TagFields
        disclaimer
      }
    }
  }
`;

interface RecipePageProps {
  data: {
    recipeTags: {
      nodes: Internal.Tag[];
    };
  };
  pageContext: {
    page: AppContent.Page;
    recipe: Internal.Recipe;
    tagIds: number[];
    relatedRecipes: Internal.Recipe[];
  };
  location: WindowLocation;
}
