import { ReactElement } from 'react';
import { RatingAndReviewsProvider } from '../../models';
import { ButtonProps } from '../Button';
import { RatingProps } from '../Rating';

export interface CardProps {
  cardKey: string;
  content: CardContentProps;
  idPropertyName: string;
  ratingWidget?: ReactElement<RatingProps>;
  imageSizes: string;
  className?: string;
  brand?: string;
  brandTheme?: string;
  brandLink?: string;
  children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
  showDescription?: boolean;
  maxDescriptionLength?: number;
}

export interface CardContentProps {
  fields: {
    slug: string;
  };
  name?: string;
  title?: string;
  localImage?: Internal.LocalImage;
  images?: Internal.LocalImage[];
  averageRating?: number;
  [key: string]: any;
}

interface CardWrapper {
  cardKey: string;
  children: ReactElement<CardProps>;
  ratingProvider: RatingAndReviewsProvider;
}

export interface RecipeCardWrapperProps extends CardWrapper{}

export interface ProductCardWrapperProps extends CardWrapper{
  mainImageIndex?: number;
}
