import React from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import SEO from 'src/components/Seo';
import { ReactComponent as RecipeClock } from 'src/svgs/inline/recipe-clock.svg';
import { ReactComponent as RecipeDifficulty } from 'src/svgs/inline/recipe-difficulty.svg';
import { ReactComponent as RecipePeople } from 'src/svgs/inline/recipe-people.svg';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import {
  dietaryEqual,
  favoriteButtonDefaults,
  dietaryAttributesIcons,
} from '../../themeDefaultComponentProps';
import theme from './RecipePage.module.scss';
import cx from 'classnames';
import { findPageComponentContent } from 'src/utils';
import { ReactComponent as FavoriteIcon } from '../../svgs/inline/favorite.svg';
import { ReactComponent as PrintIcon } from '../../svgs/inline/print.svg';
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
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { ReactComponent as InfoIcon } from '../../svgs/inline/info.svg';
import { IMAGE_SIZES } from 'src/constants';
import { ReactComponent as OpenModelButtonIcon } from '../../svgs/inline/social-sharing.svg';
import { ReactComponent as WhatsappIcon } from '../../svgs/inline/whatsapp.svg';
import { ReactComponent as PlayIcon } from '../../svgs/inline/youtube-play.svg';
import { getPagePath } from '../../utils/getPagePath';
import isBrowser from '../../utils/isBrowser';
// Component Styles
import '../../scss/pages/_recipePage.scss';
import themeKnorr from './RecipePageKnorr.module.scss';
import themeHellmanns from './RecipePageHellmanns.module.scss';
import themeMaizena from './RecipePageMaizena.module.scss';
import SocialSharing, {
  SocialIcons,
  SocialSharingViewType,
} from 'gatsby-awd-components/src/components/SocialSharing';
import RecipeHero from 'gatsby-awd-components/src/components/RecipeHero';
import Button from 'gatsby-awd-components/src/components/Button';
import RecipeCopy, {
  RecipeCopyViewType,
} from 'gatsby-awd-components/src/components/RecipeCopy';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { RecipeMicrodata } from 'gatsby-awd-components/src/components/RecipeMicrodata';
import Rating from 'gatsby-awd-components/src/components/Rating';
import RecipeListing, {
  RecipeListViewType,
} from 'gatsby-awd-components/src/components/RecipeListing';
import { RecipeCard } from 'gatsby-awd-components/src/components/RecipeCard';
import RecipeAttributes, {
  RecipeAttributesKeys,
} from 'gatsby-awd-components/src/components/RecipeAttributes';
import Tags from 'gatsby-awd-components/src/components/Tags';
import RecipeNutrients, {
  RecipeNutrientsViewType,
} from 'gatsby-awd-components/src/components/RecipeNutrients';
import { VideoPlayer } from 'gatsby-awd-components/src/components/VideoPlayer';
import { CardLinkWrapper } from 'gatsby-awd-components/src/components/CardLinkWrapper';
import {
  RatingAndReviewsEntityType,
  RatingAndReviewsProvider,
} from 'gatsby-awd-components/src';
import BrandLogo from 'gatsby-awd-components/src/components/BrandLogo';
import { Reviews } from 'gatsby-awd-components/src/components/Reviews';
import Tabs, { Tab } from 'gatsby-awd-components/src/components/Tabs';
import { Hero } from 'gatsby-awd-components/src/components/Hero';
import RecipeCookingMethod from 'gatsby-awd-components/src/components/RecipeCookingMethod';
import RecipeDietaryAttributes from 'gatsby-awd-components/src/components/RecipeDietaryAttributes';

const infoIcon = <InfoIcon />;
const socialIcons: SocialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsappIcon,
};
const isRecipeValidForReview = (recipe: Internal.Recipe, tagIds: number[]) =>
  Boolean(recipe.description) && !isEmpty(tagIds);
const RecipePage: React.FunctionComponent<RecipePageProps> = ({
  pageContext,
  location,
  data: {
    recipeTags,
    dietaryCategories: { nodes: dietaryCats },
  },
}) => {
  const dietaryLinks: { [key: string]: string } = {};
  dietaryCats.map(category => {
    dietaryLinks[category.primaryTag.id] = category.fields.slug;
  });
  const {
    page: { components, seo, type },
    recipe,
    relatedRecipes,
  } = pageContext;
  const brandLogoLink = getPagePath('Search');
  const LinkToBrandProducts = getPagePath('BrandProductsPage', recipe.brand);
  const getBrandThemeContent = (brandTheme: string | undefined) => {
    switch (brandTheme) {
      case 'knorr':
        return {
          theme: themeKnorr,
        };
      case 'hellmanns':
        return {
          theme: themeHellmanns,
        };
      case 'maizena':
        return {
          theme: themeMaizena,
        };
      default:
        return false;
    }
  };
  // @ts-ignore
  const brandThemeContent = getBrandThemeContent(recipe.brandTheme);
  const brandTheme = brandThemeContent && brandThemeContent.theme;
  const classWrapper = cx(
    theme.recipePage,
    brandTheme && brandTheme.recipePage,
    'recipe-page header--bg'
  );

  const tags = recipeTags.nodes;
  const isRecipeValid = isRecipeValidForReview(recipe, pageContext.tagIds);
  /*We use this way because we don't need to show inactive dietary attributes.
   * If we need to show it we should do few requests to get All dietary attributes includes freeFormTags
   * for use custom dietary attributes and use it for attributes property in RecipeDietaryAttributes component.
   * And add showInactiveAttributes flag for this component.*/
  const recipeRMSTags = flatMap(recipe.tagGroups, tagGroup => tagGroup.tags);
  const existingImagesIds = [
    ...Object.keys(dietaryAttributesIcons).map(i => parseInt(i)),
    ...Object.values(dietaryEqual).map(i => i),
  ];
  const showDietaryTags = intersection(existingImagesIds, pageContext.tagIds);
  const mappedRecipeTags = tags.map(tag =>
    dietaryEqual[`${tag.tagId}`]
      ? { ...tag, tagId: parseInt(dietaryEqual[`${tag.tagId}`]) }
      : tag
  );
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  const initialTagsCount = useMedia(undefined, [9, 5]);
  const tagList = getTagsFromRecipes([recipe], tags);
  const handlePrintClick = () => {
    isBrowser() && window.print();
  };
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
        <div>
          <Button
            Icon={PrintIcon}
            onClick={handlePrintClick}
            className="action-button action-button--print"
            attributes={{ 'aria-label': 'print recipe' }}
          />
        </div>
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

  const videoIds = recipe.videos && recipe.videos.map(video => video.id);

  const preview =
    videoIds && videoIds.length
      ? {
          playIcon: PlayIcon,
          previewImage: recipe.localImage,
        }
      : undefined; // recipe image as YouTube video preview is a temporary solution

  const recipeVideos =
    videoIds &&
    videoIds.map(videoId => (
      <div className={theme.recipeVideo} key={videoId}>
        <VideoPlayer content={{ videoId, preview }} />
      </div>
    ));

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
              <BrandLogo
                brandTheme={recipe.brandTheme}
                linkTo={LinkToBrandProducts}
                className={cx(
                  theme.recipeTopBlockLogo,
                  'recipe-top-block-logo'
                )}
              />
              <RecipeCopy
                viewType={RecipeCopyViewType.Title}
                recipe={recipe}
                content={{}}
                className="recipe-copy__title"
              />
              {isRecipeValid ? (
                <Rating
                  id={recipe.recipeId}
                  entityType={RatingAndReviewsEntityType.recipe}
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
                  RecipeAttributesKeys.readyTime,
                  RecipeAttributesKeys.difficulties,
                ]}
                icons={{
                  cookTime: RecipeClock,
                  readyTime: RecipeClock,
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
          <div className={theme.recipeCookingMethod}>
            <RecipeCookingMethod
              methodList={recipe.methods}
              content={findPageComponentContent(
                components,
                'RecipeCookingMethod'
              )}
            />
            {recipeVideos}
          </div>
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
              {recipeVideos}
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
            categoryLinksMap={dietaryLinks}
            activeAttributes={recipeRMSTags}
            infoIcon={infoIcon}
            attributes={mappedRecipeTags}
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
            id={recipe.recipeId}
            entityType={RatingAndReviewsEntityType.recipe}
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
          brandLogoLink={brandLogoLink}
        >
          {relatedRecipes
            ? relatedRecipes.map(recipe => (
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
    dietaryCategories: allCategory(filter: { primaryTag: { id: { gt: 0 } } }) {
      nodes {
        fields {
          slug
        }
        primaryTag {
          id
        }
      }
    }
    site {
      siteMetadata {
        lang
      }
    }
  }
`;

interface RecipePageProps {
  data: {
    recipeTags: {
      nodes: Internal.Tag[];
    };
    dietaryCategories: {
      nodes: {
        fields: {
          slug: string;
        };
        primaryTag: RMSData.Tag;
      }[];
    };
    site: {
      siteMetadata: {
        lang: string;
      };
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
