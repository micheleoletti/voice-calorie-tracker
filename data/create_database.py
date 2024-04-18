import duckdb

db_name = 'products.db' 

print('Creating database...')
con = duckdb.connect(db_name)
print(f'Database "{db_name}" created.')

print('Populating database...')
con.execute("CREATE TABLE products AS SELECT * FROM read_csv_auto('en.openfoodfacts.org.products.converted.csv', quote='', sample_size=3000000, delim='\t');")
print('Database populated.')

print('Data cleaning...')
con.execute("UPDATE products SET product_name = LOWER(product_name), brand = LOWER(brand);")

