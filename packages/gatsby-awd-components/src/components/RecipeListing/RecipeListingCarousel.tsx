import React, { ReactElement, useCallback } from 'react';
import { RatingAndReviewsProvider } from '../../models';
import reloadKritiqueWidget from '../../utils/useKritiqueReload';
import Carousel from '../Carousel/Carousel';
import { RecipeListingCarouselProps } from './models';
import { RecipeCardProps } from './partials/models';

const RecipeListingCarousel = ({
  titleLevel = 1,
  list,
  config,
  ratingProvider = RatingAndReviewsProvider.none,
  imageSizes,
  children,
}: RecipeListingCarouselProps) => {
  const getCurrentItem =  useCallback(
    (item: Internal.Recipe) => {
        const actual =  Array.isArray(children) ? children.find(child => child.props.recipeId===item.recipeId): children as ReactElement<RecipeCardProps>;
        return React.isValidElement<RecipeCardProps>(actual) ? React.cloneElement<RecipeCardProps>(
          actual,
          { imageSizes, ratingProvider }
        ): actual;
    },
    [
      titleLevel,
      ratingProvider,
      imageSizes,
      children
    ]
  );

  const handleVisibleElementsChanged = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (visibleElements: number) => {
      if (ratingProvider === RatingAndReviewsProvider.kritique) {
        reloadKritiqueWidget();
      }
    },
    [ratingProvider]
  );

  return (
    <Carousel
      list={list}
      createElementFunction={getCurrentItem}
      config={config}
      onVisibleElementsChanged={handleVisibleElementsChanged}
    />
  );
};

export default RecipeListingCarousel;
