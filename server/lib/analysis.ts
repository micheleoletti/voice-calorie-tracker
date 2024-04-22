import { Database } from "duckdb-async";
import { getProductByName } from "./database";
import { InferencedMeal, MealAnalysis, MealStats, Product } from "./models";

export const getMealAnalysis = async (
  db: Database,
  meal: InferencedMeal
): Promise<MealAnalysis> => {
  const results: Product[] = [];

  for (const product of meal.products) {
    const dbResult = await getProductByName(db, product.name, product.brand);

    if (dbResult.isSuccess && dbResult.value) {
      results.push({ ...product, ...dbResult.value });
    } else {
      console.log(`No data found for product ${product.name}`);
    }
  }

  return {
    products: results,
    ...calculateMealStats(results),
  };
};

export const calculateMealStats = (products: Product[]): MealStats => {
  let totalKcal = 0;
  let totalFat = 0;
  let totalCarbohydrates = 0;
  let totalSugars = 0;
  let totalProteins = 0;

  for (const product of products) {
    const consumed = product.quantityGrams / 100;

    totalKcal += product.kcal * consumed;
    totalFat += product.fat * consumed;
    totalCarbohydrates += product.carbohydrates * consumed;
    totalSugars += product.sugars * consumed;
    totalProteins += product.proteins * consumed;
  }

  return {
    totalKcal: Math.ceil(totalKcal),
    totalFat: Math.ceil(totalFat),
    totalCarbohydrates: Math.ceil(totalCarbohydrates),
    totalSugars: Math.ceil(totalSugars),
    totalProteins: Math.ceil(totalProteins),
  };
};
