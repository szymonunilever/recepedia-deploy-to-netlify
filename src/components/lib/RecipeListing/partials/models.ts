import { FixedObject, FluidObject } from 'gatsby-image';
import { RatingProvider, RecipeRating } from '../../Rating/models';

export interface LocalImage {
  id: string;
  childImageSharp: {
    fluid?: FluidObject;
    fixed?: FixedObject;
  };
}
export interface RecipeItem {
  id: string;
  shortTitle: string;
  localImage: LocalImage;
  fields: {
    slug: string;
  };
  recipeId: string;
  inFavorite?: boolean;
  rating?: RecipeRating;
}

export interface RecipeCardFavoriteCallback {
  (selected: { id: string; val: boolean }): void;
}
export interface RecipeCardProps {
  id: string;
  enableSelectFavorite?: boolean;
  imgObject?: FluidObject;
  title: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  slug: string;
  inFavorite?: boolean;
  onFavoriteChange?: RecipeCardFavoriteCallback;
  className?: string;
}

export interface RecipeListingTrivialProps {
  list: RecipeItem[];
  withFavorite: boolean;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  onFavoriteChange?: RecipeCardFavoriteCallback;
  ratingProvider?: RatingProvider;
}
