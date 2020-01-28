import cx from 'classnames';
import React, { FunctionComponent } from 'react';
import { getImageAlt } from '../../utils';
import AdaptiveImage from '../AdaptiveImage';
import { ButtonProps } from '../Button';
import { TagName, Text } from '../Text';
import { CardProps } from './models';
import theme from './Card.module.scss';
import BrandLogo from '../BrandLogo';
import clipString from '../../utils/clipString';

export const Card: FunctionComponent<CardProps> = ({
  content,
  idPropertyName,
  children,
  className = '',
  imageSizes,
  ratingWidget,
  brand,
  brandName,
  brandLink,
  showDescription = false,
  maxDescriptionLength = 0,
}) => {
  const {
    title,
    description,
    fields: { slug },
    localImage,
  } = content;
  const itemTitle = title && (
    <Text
      tag={TagName[`div`]}
      text={title}
      className={cx(theme.card__title, 'card__title')}
    />
  );
  const descriptionText = description && showDescription && (
    <Text
      tag={TagName[`div`]}
      text={
        maxDescriptionLength
          ? clipString(description, maxDescriptionLength)
          : description
      }
      className={cx(theme.card__description, 'card__description')}
    />
  );
  const modifiedChildren =
    children &&
    React.Children.map(children, child => {
      return (
        React.isValidElement<ButtonProps>(child) &&
        React.cloneElement<ButtonProps>(child, {
          onClick: (val: boolean) => {
            child &&
              child.props.onClick &&
              child.props.onClick.apply(child.props.onClick, [
                val,
                content[idPropertyName],
              ]);
          },
        })
      );
    });
  const wrapClasses = cx(theme.card, 'card', className);
  const Image = localImage && (
    <AdaptiveImage
      className={cx(theme.card__image, 'card__image')}
      localImage={localImage}
      alt={title ? getImageAlt(title, slug) : 'image'}
      sizes={imageSizes}
    />
  );

  return (
    <div className={wrapClasses} data-componentname="card">
      <div className="card__buttons">{modifiedChildren}</div>
      {Image}
      <div className={cx(theme.card__info, 'card__info')}>
        <div className={cx(theme.card__infoText, 'card__info-text')}>
          {itemTitle}
          {brand}
          {ratingWidget}
          {descriptionText}
        </div>
        <BrandLogo brand={brandName} linkTo={`${brandLink}?searchQuery=${brandName}`} />
      </div>
    </div>
  );
};

export default Card;
