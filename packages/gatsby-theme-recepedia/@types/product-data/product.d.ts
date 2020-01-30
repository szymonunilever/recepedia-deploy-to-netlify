declare namespace ProductData {
  export interface NutritionFactItem {
    [key: string]: string;
  }

  export interface Product {
    id: number | string;
    productId: number | string;
    brand: string;
    productCategory: string;
    productName: string;
    longPageDescription: string;
    shortPageDescription: string;
    ingredients: string;
    allergy: string;
    nutritionFacts: string;
    productTags: string[];
    images: Internal.LocalImage[];
  }
}
