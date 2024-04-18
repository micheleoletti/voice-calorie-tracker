import { CSVProduct, Product } from "./models";

export const mapRowToProduct = (row: CSVProduct): Product => ({
    code: row.code,
    name: row.product_name,
    kcal: Number(row["energy-kcal_100g"]),
    fat: Number(row.fat_100g),
    carbohydrates: Number(row.carbohydrates_100g),
    sugars: Number(row.sugars_100g),
    proteins: Number(row.proteins_100g),
    imageUrl: row.image_url,
  });
  