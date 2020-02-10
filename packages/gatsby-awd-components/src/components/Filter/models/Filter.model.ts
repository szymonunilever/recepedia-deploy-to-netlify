import { Icon, UnileverLibraryComponent } from '../../../models';

export enum SortingOptions {
  newest,
  preparationTime,
  readyTime,
  averageRating,
  title,
}

export const RecipeSortingOptionsFieldsMappings = {
  [ SortingOptions.newest ] : [ { creationTime : { order : 'desc' } } ],
  [ SortingOptions.preparationTime ] : 'recipeDetails.preperationTime',
  [ SortingOptions.readyTime ] : 'recipeDetails.readyTime',
  [ SortingOptions.averageRating ] : [ { averageRating : { order : 'desc' } } ],
  [ SortingOptions.title ] : 'title.keyword',
};

export interface FilterOptions {
  tagGroups: Internal.TagGroup[];
  displayCategories?: string[];
}

export interface FilterProps
  extends UnileverLibraryComponent<Partial<AppContent.RecipeListing.Content>> {
  allFilters: FilterOptions;
  onChangeSorting?: (sort: SortingOptions) => void;
  onChangeFilter: (filter: Internal.Tag[]) => void;
  results: number;
  currentFilters?: Internal.Tag[];
  filterTitle?: string;
  sortSelectPlaceholder?: string;
  searchQuery?: string;
}

export interface FilterSettingsProps
  extends UnileverLibraryComponent<Partial<AppContent.RecipeListing.Content>> {
  allFilters: FilterOptions;
  onFilterChange: (filter: Internal.Tag[]) => void;
  selectedTags: Internal.Tag[];
  icons: FilterIcons;
}

export interface FilterIcons {
  closed?: Icon;
  close: Icon;
  open?: Icon;
  filter?: Icon;
  removeTag?: Icon;
}
