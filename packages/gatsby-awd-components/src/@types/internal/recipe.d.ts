declare namespace Internal {
  interface Recipe extends RMSData.Recipe {
    inFavorite?: boolean;
    averageRating?: number;
    localImage: Internal.LocalImage;
    fields: {
      slug: string;
    };
    recipeId: number;
    imgTitle?: string;
  }
}
