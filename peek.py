import sqlite3
import pandas as pd

# Database file path
db_file = 'triple_triad.db'

# Connect to SQLite database
conn = sqlite3.connect(db_file)

# Function to pretty-print the first 10 rows of a table
def pretty_print_table(table_name):
    print(f"\nTable: {table_name}")
    query = f"SELECT * FROM {table_name} LIMIT 10"
    df = pd.read_sql_query(query, conn)
    print(df.to_string(index=False))

# List of tables to peek into
tables = ['cards', 'players', 'images']

# Peek into each table and pretty-print the first 10 rows
for table in tables:
    pretty_print_table(table)

# Close the connection
conn.close()
