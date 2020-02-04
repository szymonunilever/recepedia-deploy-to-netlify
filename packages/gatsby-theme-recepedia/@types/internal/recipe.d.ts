declare namespace Internal {
  interface Recipe extends RMSData.Recipe {
    inFavorite?: boolean;
    averageRating?: number;
    brand?: string;
    brandTheme?: string;
    localImage: Internal.LocalImage;
    fields: {
      slug: string;
    };
    recipeId: number;
    videos?: Internal.Video[];
  }
}
