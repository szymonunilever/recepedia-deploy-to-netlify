import {
  titleLevel,
  UnileverLibraryComponent,
} from '../../models/globalModels';

export enum RecipeCopyViewType {
  Title,
  Description,
  Ingredients,
}
export interface RecipeCopyProps
  extends UnileverLibraryComponent<AppContent.RecipeCopyContent> {
  recipe: RMSData.Recipe;
  titleLevel?: titleLevel;
  viewType: RecipeCopyViewType;
}
