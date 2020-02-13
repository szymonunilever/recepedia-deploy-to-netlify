declare namespace AppContent.Category {
  interface Content {
    name: string;
    id?: string | number;
    image: AppContent.ImageContent;
    title: string;
    titlePlural: string;
    titleFooter: string;
    seasonalPromo?: RMSData.Tag[];
    description: string;
    tags?: RMSData.Tag[];
    primaryTag?: RMSData.Tag;
    categories?: Content[];
    recipeDetails?: RecipeDetails;
    inNavigation?: boolean;
    inFooter?: boolean;
    footerOrder?: number;
    showOnHomepage: number;
    categoryOrder: number;
  }
  interface RecipeDetails {
    serves?: string | null;
    cookTime?: string | null;
    totalTime?: string | null;
    preparationTime?: string | null;
    [key: string]: string | null | undefined;
  }
}
