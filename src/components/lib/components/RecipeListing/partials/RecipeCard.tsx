import cx from 'classnames';
import { Link } from 'gatsby';
import React from 'react';
import { TagName, Text } from '../../Text';
import { Button, ButtonViewType } from '../../Button';
import { RecipeCardProps } from './models';
import theme from './RecipeCard.module.scss';
import Rating from '../../Rating';
import AdaptiveImage from '../../AdaptiveImage';
import { RatingAndReviewsProvider } from 'src/components/lib/models/ratings&reviews';

const RecipeCard = ({
  id,
  recipeId,
  content: { title },
  localImage,
  Icon,
  enableSelectFavorite = false,
  slug,
  className = '',
  inFavorite = false,
  onFavoriteChange,
  ratingProvider,
}: RecipeCardProps) => {
  const itemTitle = title ? (
    <Text
      // @ts-ignore
      tag={TagName[`div`]}
      text={title}
      className="recipe-card__title"
    />
  ) : null;
  const onFavoriteToggle = (val: boolean) => {
    if (typeof onFavoriteChange !== 'undefined') {
      onFavoriteChange({ id, val });
    }
  };
  const wrapClasses = cx(theme['recipe-card'], 'recipe-card', className);
  const RatingWidget =
    ratingProvider !== RatingAndReviewsProvider.none ? (
      <>
        <Rating
          className={'recipe-rating--stars'}
          recipeId={recipeId}
          provider={ratingProvider}
          linkTo={slug}
        />
      </>
    ) : null;

  const Image = localImage && (
    <AdaptiveImage
      className="recipe-card__image"
      localImage={localImage}
      alt={title || 'Recipe image'}
    />
  );
  const view = enableSelectFavorite ? (
    <Link to={slug} data-componentname="recipeCard" className={wrapClasses}>
      <Button
        className="recipe-card__favorite"
        Icon={Icon}
        isSelected={inFavorite}
        onClick={onFavoriteToggle}
        isToggle={true}
        viewType={ButtonViewType.icon}
        attributes={{ 'aria-label': 'favourite toggle' }}
      />
      {Image}
      {itemTitle}
      {RatingWidget}
    </Link>
  ) : (
    <Link to={slug} data-componentname="recipeCard" className={wrapClasses}>
      {Image}
      <div className="recipe-card__info">
        {itemTitle}
        {RatingWidget}
      </div>
    </Link>
  );

  return view;
};

export default RecipeCard;
