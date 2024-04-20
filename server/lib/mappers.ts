import { CSVProduct, Product, ProductNutritionalData } from "./models";

export const mapRowToProduct = (row: CSVProduct): ProductNutritionalData => {
  return {
    code: row.code,
    name: row.product_name,
    kcal: Math.trunc(Number(row.energy_kcal_100g) * 100) / 100,
    fat: Math.trunc(Number(row.fat_100g) * 100) / 100,
    carbohydrates: Math.trunc(Number(row.carbohydrates_100g) * 100) / 100,
    sugars: Math.trunc(Number(row.sugars_100g) * 100) / 100,
    proteins: Math.trunc(Number(row.proteins_100g) * 100) / 100,
    imageUrl: row.image_url,
  };
};
