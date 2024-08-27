from flask import Blueprint, render_template, jsonify
import sqlite3
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)

main = Blueprint('main', __name__)

def get_db_connection():
    try:
        conn = sqlite3.connect('triple_triad.db')
        conn.row_factory = sqlite3.Row
        logging.debug("Database connection established successfully.")
        return conn
    except sqlite3.Error as e:
        logging.error(f"Database connection failed: {e}")
        return None

@main.route('/')
def index():
    logging.debug("Rendering index.html")
    return render_template('index.html')

@main.route('/api/cards')
def get_cards():
    conn = get_db_connection()
    if conn is None:
        logging.error("Failed to connect to the database.")
        return jsonify({"error": "Database connection failed"}), 500

    try:
        logging.debug("Fetching cards from the database...")

        query = """
        SELECT cards.name, cards.level, cards.card_mod_item, images.image_name
        FROM cards
        LEFT JOIN images ON cards.name = images.card_name
        """

        cards = conn.execute(query).fetchall()
        logging.debug(f"Number of cards fetched: {len(cards)}")

        cards_data = []
        for card in cards:
            card_data = dict(card)
            card_data['image'] = f"static/img/{card_data['image_name']}" if card_data['image_name'] else 'default.jpg'
            cards_data.append(card_data)

        logging.debug("All cards processed successfully.")
        return jsonify(cards_data)

    except sqlite3.Error as e:
        logging.error(f"Error fetching cards from the database: {e}")
        return jsonify({"error": "Failed to fetch cards"}), 500
    finally:
        if conn:
            conn.close()
            logging.debug("Database connection closed.")

@main.route('/img/<path:path>')
def send_img(path):
    logging.debug(f"Serving image: {path}")
    return send_from_directory('static/img', path)
