import duckdb

db_name = 'products.db' 

print('Creating database...')
con = duckdb.connect(db_name)
print(f'Database "{db_name}" created.')

print('Populating database...')
try:
    result = con.execute("CREATE TABLE products AS SELECT * FROM read_csv_auto('en.openfoodfacts.org.products.converted.csv', quote='', sample_size=3000, delim='\t');")
except Exception as e:
    print(f"Error creating table: {e}")
print('Database populated.')

print('Data cleaning...')
con.execute("UPDATE products SET product_name = LOWER(product_name), brands = LOWER(brands);")
con.execute("ALTER TABLE products RENAME COLUMN 'energy-kcal_100g' TO 'energy_kcal_100g';")
