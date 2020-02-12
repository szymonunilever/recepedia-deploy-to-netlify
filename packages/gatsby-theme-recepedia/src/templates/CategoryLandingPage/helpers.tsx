import React, { ReactElement } from 'react';
import { IMAGE_SIZES } from '../../constants';
import { favoriteButtonDefaults } from '../../themeDefaultComponentProps';
import {
  getUserProfileByKey,
  updateFavorites,
} from '../../utils/browserStorage';
import { ProfileKey } from '../../utils/browserStorage/models';
import useFavorite from '../../utils/useFavorite';
import Button from 'gatsby-awd-components/src/components/Button';
import { RecipeCardWrapper } from 'gatsby-awd-components/src/components/Card';
import {
  CardLinkWrapper,
  CardLinkWrapperProps,
} from 'gatsby-awd-components/src/components/CardLinkWrapper';
import { RatingAndReviewsProvider } from 'gatsby-awd-components/src';
import { Card } from 'gatsby-awd-components/src/components/Card';

export function createCardsFromList(
  list: Internal.Category[]
): ReactElement<CardLinkWrapperProps>[] {
  return list.map(category => (
    <CardLinkWrapper
      key={category.fields.slug}
      cardKey={category.fields.slug}
      slug={category.fields.slug}
      title={category.title}
    >
      <Card
        cardKey={category.fields.slug}
        content={category}
        idPropertyName={'title'}
        imageSizes={IMAGE_SIZES.PAGE_LISTINGS.TILES}
      />
    </CardLinkWrapper>
  ));
}

export const createRecipeCardsFromList = (
  list: Internal.Recipe[],
  searchPath: string,
  brandLogoLink: string
): ReactElement<CardLinkWrapperProps>[] => {
  const { updateFavoriteState, favorites } = useFavorite(
    () => getUserProfileByKey(ProfileKey.favorites) as number[],
    updateFavorites
  );
  return list.map(recipe => (
    <CardLinkWrapper
      key={recipe.fields.slug}
      cardKey={recipe.fields.slug}
      slug={recipe.fields.slug}
      title={recipe.title}
    >
      <RecipeCardWrapper
        cardKey={recipe.fields.slug}
        ratingProvider={RatingAndReviewsProvider.inline}
      >
        <Card
          brandLink={brandLogoLink}
          cardKey={recipe.fields.slug}
          content={recipe}
          idPropertyName={'recipeId'}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          brand={recipe.brand}
          brandTheme={recipe.brandTheme}
          imgTitle={recipe.imgTitle}
        >
          <Button
            {...favoriteButtonDefaults}
            isSelected={favorites.indexOf(recipe.recipeId) !== -1}
            onClick={updateFavoriteState}
          />
        </Card>
      </RecipeCardWrapper>
    </CardLinkWrapper>
  ));
};
