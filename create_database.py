import sqlite3
import pandas as pd
import os

# File paths for the TSV files inside the "data" folder
cards_file = os.path.join('data', 'cards.tsv')
players_file = os.path.join('data', 'players.tsv')
image_map_file = os.path.join('data', 'image_map.tsv')

# Database file path
db_file = 'triple_triad.db'

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect(db_file)
cursor = conn.cursor()

# Create tables based on the correct structure
cursor.execute('''
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    level INTEGER,
    obtain_by_card_command TEXT,
    obtain_by_triple_triad TEXT,
    drop_from_monster TEXT,
    card_mod_item TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_level INTEGER,
    player_name TEXT,
    game_section TEXT,
    location_info TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_name TEXT,
    image_name TEXT,
    image_url TEXT,
    FOREIGN KEY (card_name) REFERENCES cards (name)
)
''')

# Load TSV data into DataFrames
cards_df = pd.read_csv(cards_file, delimiter='\t')
players_df = pd.read_csv(players_file, delimiter='\t')
image_map_df = pd.read_csv(image_map_file, delimiter='\t')

# Update image URLs to point to your site
image_map_df['Image_URL'] = 'img/' + image_map_df['Image_Name']

# Insert data into the cards table
cards_df.rename(columns={
    'Card Name': 'name',
    'Card Level': 'level',
    'Obtain by Card Command': 'obtain_by_card_command',
    'Obtain by Triple Triad': 'obtain_by_triple_triad',
    'Drop From Monster': 'drop_from_monster',
    'Card Mod Item': 'card_mod_item'
}, inplace=True)
cards_df.to_sql('cards', conn, if_exists='replace', index=False)

# Insert data into the players table
players_df.rename(columns={
    'Card Level': 'card_level',
    'Player Name': 'player_name',
    'Game Section': 'game_section',
    'Location/Additional Info': 'location_info'
}, inplace=True)
players_df.to_sql('players', conn, if_exists='replace', index=False)

# Insert data into the images table
image_map_df.rename(columns={
    'Card_Name': 'card_name',
    'Image_Name': 'image_name',
    'Image_URL': 'image_url'
}, inplace=True)
image_map_df.to_sql('images', conn, if_exists='replace', index=False)

# Commit and close the connection
conn.commit()
conn.close()

print(f"Database '{db_file}' created and data loaded successfully.")
