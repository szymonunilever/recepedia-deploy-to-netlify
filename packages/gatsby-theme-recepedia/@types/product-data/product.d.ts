declare namespace ProductData {
  export interface NutritionFactItem {
    [key: string]: string;
  }

  export interface Product {
    id: number | string;
    brand: string;
    category: string;
    productName: string;
    longPageDescription: string;
    ingredients: string;
    allergy: string;
    nutritionFacts: string;
    productTags: string[];
    images: string[];
  }
}
