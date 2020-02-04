import { ReactElement } from 'react';
import { RatingAndReviewsProvider, UnileverLibraryComponent} from '../../models';
import { ButtonProps } from '../Button';

export interface RecipeCardProps
  extends UnileverLibraryComponent<Partial<AppContent.RecipeListing.Content>> {
  id: string;
  recipeId: number;
  brand?: string;
  brandTheme?: string;
  averageRating?: number;
  slug: string;
  localImage?: Internal.LocalImage;
  ratingProvider: RatingAndReviewsProvider;
  imageSizes: string;
  children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
}


