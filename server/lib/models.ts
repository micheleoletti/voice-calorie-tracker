export interface CSVProduct {
    code: string;
    product_name: string;
    "energy-kcal_100g": string;
    fat_100g: string;
    carbohydrates_100g: string;
    sugars_100g: string;
    proteins_100g: string;
    image_url: string;
}

export interface Product {
    code: string;
    name: string;
    brand?: string;
    kcal: number;
    fat: number;
    carbohydrates: number;
    sugars: number;
    proteins: number;
    imageUrl: string;
  }
  
  
  export type Result<T> = { isSuccess: boolean; value?: T; error?: string };
  