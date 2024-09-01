# Dude, Where's My Card? - Triple Triad Card Finder

This is a Flask-based web application designed to help users find information about Triple Triad cards from Final Fantasy VIII. Users can select a card from a dropdown menu to view details about how to obtain the card.

![Screenshot of webapp](https://i.imgur.com/pTcTBFs.png)

## Features

- **Card Selection**: Choose a Triple Triad card from a dropdown menu.
- **Card Details**: View information on how to obtain the selected card.
- **Dynamic Content**: Data is loaded dynamically based on the selected card.
- **Dark Themed UI**: A modern-ish, dark-themed interface.

## Acknowledgments

- **AmandaLepre**: She was running Final Fantasy VIII and couldn't find a Mesmerize card, and asked in chat where she could find one.  Went searching and found that there wasn't 1 central tool for all the info about the cards in 1 place.  And the rest is history.
- **AbsoluteSteve**: I used his *very* detailed [walkthrough of FF8](https://gamefaqs.gamespot.com/ps/197343-final-fantasy-viii/faqs/51741) to compile the card names, levels, and card mod details.  Search {TTC-3} twice.  What an asbolute Chad.

## Running Locally

### Linux

```
git clone https://github.com/cleverNamesAreHard/DudeWheresMyCard.git
cd DudeWheresMyCard
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
export FLASK_ENV=development  # Optional: Enables debug mode.
flask run
```

### Windows

```
git clone https://github.com/cleverNamesAreHard/DudeWheresMyCard.git
cd DudeWheresMyCard
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
set FLASK_APP=app.py
set FLASK_ENV=development # Optional: Enables debug mode.
flask run
```

## Data

You can find the data I used to create the database tables (cards, players, and image map) in the `data/` folder.

- Cards
  - Card Name
  - Card Level
  - Can it be obtained by Card command?
  - Can it be obtained from a specific Player?
  - Does it drop from a monster?
  - What does it Mod into with Card Mod?
- Players
  - Card Level
  - Player Name
  - Game Section (Balamb Garden, Trabia Garden, Deling City, etc.)
  - Specific Location (2nd Floor Classroom, Eastern Station, Harbor (come from above), etc.)
- Image Map: This'll largely be useless to most folks.  This helps me map the semi-inconsistent card names and filenames for the images.
  - Card_Name
  - Image_Name
  - Image_URL
- Card images can be found in `app/static/img`.

The `create_database.py` file will create the local database and tables, and load the data from the `data/` folder into the tables.  You can use `peek.py` to look at the top 10 lines of each table in the database.
