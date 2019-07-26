import { UnileverLibraryComponent } from '../globalModels';

export interface RecipeHeroProps
  extends UnileverLibraryComponent<Internal.Recipe> {
  className?: string;
  imagePlaceholder: Internal.LocalImage;
}
