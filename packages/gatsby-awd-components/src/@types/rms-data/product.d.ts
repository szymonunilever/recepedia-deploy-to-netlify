declare namespace RMSData {
  export interface Product {
    allergy: string[];
    brand: string;
    brandTheme: string;
    id: string | number;
    ingredients: RMSData.IngredientGroup[];
    longPageDescription: string;
    shortPageDescription: string;
    productId: string | number;
    productName: string;
    productTags: Internal.Tag[]
  }
}
