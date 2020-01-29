import React, { ReactElement } from 'react';
import { IMAGE_SIZES } from '../../constants';
import { ReactComponent as HellmannsLogo } from '../../svgs/inline/logo-hellmanns.svg';
import { ReactComponent as KnorrLogo } from '../../svgs/inline/logo-knorr.svg';
import { ReactComponent as MaizenaLogo } from '../../svgs/inline/logo-maizena.svg';
import { favoriteButtonDefaults } from '../../themeDefaultComponentProps';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import {
  getUserProfileByKey,
  updateFavorites,
} from '../../utils/browserStorage';
import { ProfileKey } from '../../utils/browserStorage/models';
import useFavorite from '../../utils/useFavorite';
import Button, {
  ButtonViewType,
} from 'gatsby-awd-components/src/components/Button';
import { RecipeCardWrapper } from 'gatsby-awd-components/src/components/Card';
import {
  CardLinkWrapper,
  CardLinkWrapperProps,
} from 'gatsby-awd-components/src/components/CardLinkWrapper';
import { Icon, RatingAndReviewsProvider } from 'gatsby-awd-components/src';
import { Card } from 'gatsby-awd-components/src/components/Card';

const brandLogos: { [key: string]: Icon } = {
  Hellmans: <HellmannsLogo />,
  Knorr: <KnorrLogo />,
  Maizena: <MaizenaLogo />,
};

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
  searchPath: string
): ReactElement<CardLinkWrapperProps>[] => {
  const createBrandButton = (brand: string) => (
    <Button
      content={{ label: '' }}
      onClick={() => {
        navigate(`${searchPath}?searchQuery=${brand}`);
      }}
      viewType={ButtonViewType.icon}
      Icon={brandLogos[brand]}
    />
  );
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
          cardKey={recipe.fields.slug}
          content={recipe}
          idPropertyName={'recipeId'}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          // @ts-ignore
          brand={recipe.brand ? createBrandButton(recipe.brand) : null}
          //brand={createBrandButton('Knorr')}
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
