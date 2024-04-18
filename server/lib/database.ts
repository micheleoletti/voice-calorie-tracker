import { Database } from 'duckdb-async';
import { mapRowToProduct } from './mappers';
import { Result, Product, CSVProduct } from './models';

const defaultSelectedColumns: (keyof CSVProduct)[] = [
  "code",
  "product_name",
  "energy-kcal_100g",
  "fat_100g",
  "carbohydrates_100g",
  "sugars_100g",
  "proteins_100g",
];
const defaultSelectClause = defaultSelectedColumns.join(", ");
const whereDefaultColumnsAreNotNull = defaultSelectedColumns
  .map((field) => `${field} IS NOT NULL`)
  .join(" AND ");

export const getDb = async () =>
  await Database.create("/app/data/products.db");

export const dbInit = async (): Promise<boolean> => {
  try {
    const db = await getDb();

    await db.run(
      "UPDATE products SET product_name = LOWER(product_name), brand = LOWER(brand);"
    );

    return true;
  } catch {
    return false;
  }
};

export const getProductByCode = async (
  db: Database,
  code: string
): Promise<Result<Product>> => {
  const res = await db.all(
    `SELECT ${defaultSelectClause} FROM products WHERE code = '${code}' ORDER BY LENGTH(product_name) ASC`
  );

  if (res.length === 0)
    return {
      isSuccess: false,
      error: `Failed to retrieve product with code ${code}: ${code}`,
    };

  return {
    isSuccess: true,
    // TODO: could not figure out how to type duckdb queries
    value: mapRowToProduct(res[0] as CSVProduct),
  };
};

// export const getProductByName = async (name: string, brand?: string) => {
//   const db = await getDb();
// };
