document.addEventListener("DOMContentLoaded", function () {
    fetchCards();
});

function fetchCards() {
    fetch('/api/cards')
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
        })
        .catch(error => {
            console.error('Error fetching cards:', error);
        });
}

function populateDropdown(cards) {
    const dropdown = document.getElementById('card-dropdown');

    cards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.name;
        option.textContent = card.name;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', function () {
        const selectedCard = this.value;
        if (selectedCard) {
            displayCardDetails(selectedCard, cards);
        } else {
            document.getElementById('card-display').style.display = 'none';
        }
    });
}

function displayCardDetails(cardName, cards) {
    const cardDisplay = document.getElementById('card-display');
    const cardLocationsSection = document.getElementById('card-locations');
    cardDisplay.innerHTML = '';
    cardLocationsSection.innerHTML = '';
    cardLocationsSection.style.display = 'none'; // Hide the section initially

    const selectedCard = cards.find(card => card.name === cardName);
    if (selectedCard) {
        let cardHTML = `
            <div class="card-container">
                <!-- Left Tiles -->
                <div class="tile-container">
        `;

        // Add tiles for each card detail
        if (selectedCard.card_mod_item) {
            cardHTML += `
                <div class="tile">
                    <h4>Card Mod</h4>
                    <p>${selectedCard.card_mod_item}</p>
                </div>`;
        }
        if (selectedCard.drop_from_monster) {
            cardHTML += `
                <div class="tile">
                    <h4>Drop from Monster</h4>
                    <p>${selectedCard.drop_from_monster}</p>
                </div>`;
        }

        cardHTML += `
                </div>
                <!-- Card Image, Name, and Level -->
                <div class="card-content">
                    <img src="/static/img/${selectedCard.image_name}" alt="${selectedCard.name}">
                    <h3>${selectedCard.name}</h3>
                    <p class="card-level">Level: ${selectedCard.level}</p>
                </div>
                <!-- Right Tiles -->
                <div class="tile-container">
        `;

        if (selectedCard.obtain_by_card_command) {
            cardHTML += `
                <div class="tile">
                    <h4>Obtain by Card Command</h4>
                    <p>${selectedCard.obtain_by_card_command}</p>
                </div>`;
        }
        if (selectedCard.obtain_by_triple_triad) {
            cardHTML += `
                <div class="tile">
                    <h4>Obtain by Triple Triad</h4>
                    <p>${selectedCard.obtain_by_triple_triad}</p>
                </div>`;
        }

        cardHTML += `
                </div>
            </div>`; // Close card-container div

        cardDisplay.innerHTML = cardHTML;
        cardDisplay.style.display = 'flex'; // Display the card details section

        // Fetch and display card locations
        fetchCardLocations(selectedCard.level);
    }
}

function fetchCardLocations(level) {
    fetch(`/api/card_locations/${level}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayCardLocations(data);
            }
        })
        .catch(error => {
            console.error('Error fetching card locations:', error);
        });
}

function displayCardLocations(locations) {
    const cardLocationsSection = document.getElementById('card-locations');
    cardLocationsSection.innerHTML = ''; // Clear any existing content

    if (locations.length > 0) {
        // Add the title
        const locationsTitle = document.createElement('h3');
        locationsTitle.textContent = 'Open World Card Locations';
        cardLocationsSection.appendChild(locationsTitle);

        const locationsTable = document.createElement('table');
        let tableHTML = `
            <thead>
                <tr>
                    <th>Player Name</th>
                    <th>Game Section</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
        `;

        locations.forEach(location => {
            tableHTML += `
                <tr>
                    <td>${location.player_name}</td>
                    <td>${location.game_section}</td>
                    <td>${location.location_info}</td>
                </tr>`;
        });

        tableHTML += '</tbody>';
        locationsTable.innerHTML = tableHTML;

        // Append the table to the section
        cardLocationsSection.appendChild(locationsTable);

        // Finally, show the locations section
        cardLocationsSection.style.display = 'block';
    } else {
        // Hide the section if there are no locations
        cardLocationsSection.style.display = 'none';
    }
}
