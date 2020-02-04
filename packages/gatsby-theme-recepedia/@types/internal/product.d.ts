declare namespace Internal {
  interface Product extends ProductData.Product {
    averageRating?: number;
    fields: {
      slug: string;
    };
  }
}
