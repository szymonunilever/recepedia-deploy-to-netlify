import { RatingProvider } from '../Rating';
import { titleLevel, UnileverLibraryComponent } from '../common/globalModels';
import { RecipeFilterOptions } from './partials';
import { CarouselConfig } from '../common/Carousel/models';
import { RecipeCardFavoriteCallback } from './partials/models';

export enum RecipeListViewType {
  Trivial,
  Base,
  Advanced,
  Carousel,
}

export interface OnFavoriteChange {
  (favorites: string[]): void;
}

export interface RecipeListingProps
  extends UnileverLibraryComponent<AppContent.RecipeListing.Content> {
  titleLevel?: titleLevel;
  initialCount?: number;
  recipePerLoad?: number;
  withFavorite?: boolean;
  FavoriteIcon?: JSX.Element;
  OpenIcon?: JSX.Element;
  RemoveTagIcon?: JSX.Element;
  FilterIcon?: JSX.Element;
  favorites?: string[];
  list: Internal.Recipe[];
  viewType?: RecipeListViewType;
  onFavoriteChange?: OnFavoriteChange;
  ratingProvider?: RatingProvider;
  tags?: RecipeFilterOptions;
  carouselConfig?: CarouselConfig;
}

export interface RecipeListingCarouselProps
  extends UnileverLibraryComponent<AppContent.RecipeListing.Content> {
  withFavorite?: boolean;
  titleLevel?: titleLevel;
  onFavoriteChange: RecipeCardFavoriteCallback;
  list: Internal.Recipe[];
  config: CarouselConfig;
  ratingProvider?: RatingProvider;
}