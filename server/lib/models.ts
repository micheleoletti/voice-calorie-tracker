export interface CSVProduct {
  code: string;
  product_name: string;
  energy_kcal_100g: string;
  fat_100g: string;
  carbohydrates_100g: string;
  sugars_100g: string;
  proteins_100g: string;
  image_url: string;
}

export interface ProductNutritionalData {
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

export interface InferencedProduct {
  name: string;
  quantity: number;
  unit: string;
  quantityGrams: number;
  brand?: string;
}

export interface InferencedMeal {
  products: InferencedProduct[];
}

export interface Product extends InferencedProduct, ProductNutritionalData {}

export interface MealAnalysis extends MealStats {
  products: Product[];
}

export interface MealStats {
  totalKcal: number;
  totalFat: number;
  totalCarbohydrates: number;
  totalSugars: number;
  totalProteins: number;
}

export type Result<T> = { isSuccess: boolean; value?: T; error?: string };
