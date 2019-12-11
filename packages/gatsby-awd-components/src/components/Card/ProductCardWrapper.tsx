import cx from 'classnames';
import React, { FunctionComponent } from 'react';
import { RatingAndReviewsProvider } from '../../models';
import { Rating } from '../Rating';
import { Card } from './Card';
import { ProductCardWrapperProps } from './models';
import theme from './ProductCardWrapper.module.scss';

export const ProductCardWrapper: FunctionComponent<ProductCardWrapperProps> = ({
 children,
 ratingProvider,
 mainImageIndex= 0,
})=>{
  const {averageRating, fields:{slug}, images} = children.props.content;
  const title = children.props.content.title || children.props.content.name;
  const mainImage = images && images[mainImageIndex];
  const localImage = children.props.content.localImage || mainImage;

  // this should be widget for rating for product
  const ratingWidget =
    ratingProvider !== RatingAndReviewsProvider.none ? (
      <></>
    ): undefined;

  return <Card
    {...children.props}
    content={{...children.props.content, title, localImage}}
    ratingWidget={ratingWidget}
    className={theme.productCard}
  />;
};

export default ProductCardWrapper;
