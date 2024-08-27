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
            <div class="card">
                <img src="/${selectedCard.image}" alt="${selectedCard.name}">
                <h3>${selectedCard.name}</h3>
                <p>Level: ${selectedCard.level}</p>
        `;

        if (selectedCard.card_mod_item) {
            cardHTML += `<p>Mod: ${selectedCard.card_mod_item}</p>`;
        }
        if (selectedCard.obtain_by_card_command) {
            cardHTML += `<p>Obtain by Card Command: ${selectedCard.obtain_by_card_command}</p>`;
        }
        if (selectedCard.obtain_by_triple_triad) {
            cardHTML += `<p>Obtain by Triple Triad: ${selectedCard.obtain_by_triple_triad}</p>`;
        }
        if (selectedCard.drop_from_monster) {
            cardHTML += `<p>Drop from Monster: ${selectedCard.drop_from_monster}</p>`;
        }

        cardHTML += `</div>`;
        cardDisplay.innerHTML = cardHTML;
        cardDisplay.style.display = 'block';

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
    cardLocationsSection.innerHTML = `
        <h3>Card Sections</h3>
        <table>
            <thead>
                <tr>
                    <th>Player Name</th>
                    <th>Game Section</th>
                    <th>Specific Location</th>
                </tr>
            </thead>
            <tbody>
                ${locations.map(location => `
                    <tr>
                        <td>${location.player_name}</td>
                        <td>${location.game_section}</td>
                        <td>${location.location_info}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    cardLocationsSection.style.display = 'block'; // Show the section if there are locations
}
