import cx from "classnames";
import React, { FunctionComponent, useContext } from "react";
import { RatingAndReviewsEntityType, RatingAndReviewsProvider } from "../../models";
import { getImageAlt } from "../../utils";
import getComponentDataAttrs from "../../utils/getComponentDataAttrs";
import AdaptiveImage from "../AdaptiveImage";
import { ButtonProps } from "../Button";
import Rating from "../Rating";
import { TagName, Text } from "../Text";
import { RecipeCardProps } from "./models";
import theme from "./RecipeCard.module.scss";
import { AppContext } from "../../context/appContext";
import BrandLogo from "../BrandLogo";

export const RecipeCard: FunctionComponent<RecipeCardProps> = ({
  recipeId,
  averageRating = 0,
  content,
  children,
  slug,
  brand = '',
  localImage,
  className = '',
  ratingProvider,
  imageSizes,
}) => {
   const itemTitle = content.title ? (
    <Text
      tag={TagName[ `div` ]}
      text={content.title}
      className={cx(theme.recipeCard__title, 'recipe-card__title')}
    />
  ) : null;
  const searchLink = useContext(AppContext).brandLogoLink;
  const isExternalItemLink = useContext(AppContext).isExternalItemLink;
  const modifiedChildren = children && React.Children.map(children, child =>{
    return React.isValidElement<ButtonProps>(child) && React.cloneElement<ButtonProps>(
    child,
    {
      onClick : (val: boolean) => {
        child
        && child.props.onClick
        && child.props.onClick.apply(
          child.props.onClick,
          [ val, recipeId ],
        );
      }
    })
  });
  const wrapClasses = cx(theme.recipeCard, brand, 'recipe-card', className);
  const RatingWidget =
    ratingProvider !== RatingAndReviewsProvider.none ? (
      <Rating
        className={cx(theme.recipeRatingStars, 'recipe-rating--stars')}
        id={recipeId}
        provider={ratingProvider}
        averageRating={averageRating}
        linkTo={slug}
        entityType={RatingAndReviewsEntityType.recipe}
      />
    ) : null;

  const Image = localImage && (
    <AdaptiveImage
      className={cx(theme.recipeCard__image, 'recipe-card__image')}
      localImage={localImage}
      alt={content.title ? getImageAlt(content.title, slug) : 'Recipe image'}
      sizes={imageSizes}
    />
  );
  return (
    // @ts-ignore
    <div className={wrapClasses}
      {...getComponentDataAttrs('recipeCard', content)}
    >
      <div className="recipe-card__buttons">
        {modifiedChildren}
      </div>
      {Image}
      <div className={cx(theme.recipeCard__info, 'recipe-card__info')}>
        <div className={cx(theme.recipeCard__infoText, 'recipe-card__info-text')}>
          {itemTitle}
          {RatingWidget}
        </div>
        <BrandLogo
          className={cx(theme.recipeCard__infoBrand, 'recipe-card__info-brand')}
          brand={brand}
          linkTo={`${searchLink}?searchQuery=${brand}`}
          isExternal={isExternalItemLink}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
