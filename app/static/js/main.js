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
    cardDisplay.innerHTML = '';

    const selectedCard = cards.find(card => card.name === cardName);
    if (selectedCard) {
        cardDisplay.innerHTML = `
            <div class="card">
                <img src="/${selectedCard.image}" alt="${selectedCard.name}">
                <h3>${selectedCard.name}</h3>
                <p>Level: ${selectedCard.level}</p>
                <p>Mod: ${selectedCard.card_mod_item || 'N/A'}</p>
            </div>
        `;
        cardDisplay.style.display = 'block';
    }
}
