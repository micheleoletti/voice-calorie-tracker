import { Database } from "duckdb-async";
import { mapRowToProduct } from "./mappers";
import { Result, Product, CSVProduct, ProductNutritionalData } from "./models";

const defaultSelectedColumns: (keyof CSVProduct)[] = [
  "code",
  "product_name",
  "energy_kcal_100g",
  "fat_100g",
  "carbohydrates_100g",
  "sugars_100g",
  "proteins_100g",
  "image_url",
];
const defaultSelectClause = defaultSelectedColumns.join(", ");
const whereDefaultColumnsAreNotNull = defaultSelectedColumns
  .map((field) => `${field} IS NOT NULL`)
  .join(" AND ");

export const getDb = async () => await Database.create("data/products.db");

export const dbInit = async (db: Database): Promise<boolean> => {
  try {
    const db = await getDb();

    const allColumns = await db.all("PRAGMA table_info('products')");
    console.log(
      "All columns in the 'products' table:",
      allColumns.map((column) => column.name).join(", ")
    );

    await db.run(
      'ALTER TABLE products RENAME COLUMN "energy-kcal_100g" TO energy_kcal_100g;'
    );
    await db.run(
      "UPDATE products SET product_name = LOWER(product_name), brands = LOWER(brands);"
    );

    return true;
  } catch (error) {
    console.error("An error occurred during database initialization:", error);
    return false;
  }
};

export const getProductByCode = async (db: Database, code: string) => {
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

export const getProductByName = async (
  db: Database,
  name: string,
  brand?: string
) => {
  const whereClause = [`product_name LIKE '%${name.toLowerCase()}%'`];
  if (brand) {
    whereClause.push(`brands LIKE '%${brand.toLowerCase()}%'`);
  } else {
    // nova group is 1 for all products that have minimal processing, therefore are fresh organic unbranded products
    whereClause.push(`nova_group = 1`);
  }

  const where =
    whereClause.join(" AND ") + " AND " + whereDefaultColumnsAreNotNull;

  const res = await db.all(
    `SELECT ${defaultSelectClause} FROM products WHERE ${where} ORDER BY LENGTH(product_name) ASC, completeness DESC`
  );

  if (res.length === 0)
    return {
      isSuccess: false,
      error: `Failed to retrieve products with name ${name} and brand ${brand}`,
    };

  return {
    isSuccess: true,
    value: mapRowToProduct(res[0] as CSVProduct),
  };
};
