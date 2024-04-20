if [ -f "products.db" ]; then
    echo "DuckDB database exists already, skipping."
    return
fi

# download data
wget -q --show-progress --progress=bar:force:noscroll https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz

# decompress data
echo "Decompressing data..."
gunzip -v en.openfoodfacts.org.products.csv.gz

# cleaup data for duckdb
# https://wiki.openfoodfacts.org/Reusing_Open_Food_Facts_Data#Import_CSV_to_DuckDB
echo "Cleaning data for DuckDB..."
iconv -f utf-8 -t utf-8 -c en.openfoodfacts.org.products.csv -o en.openfoodfacts.org.products.converted.csv
sed -i '1s/"energy-kcal_100g"/"energy_kcal_100g"/' en.openfoodfacts.org.products.converted.csv

rm -f en.openfoodfacts.org.products.csv

echo "Creating DuckDB database..."
python -u create_database.py

# echo "Removing temporary files..."
rm -f en.openfoodfacts.org.products*

if [ ! -f "products.db" ]; then
    echo "DuckDB database creation failed."
    exit 1
else
    echo "DuckDB database creation completed."
fi