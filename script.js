const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
    sortOption: 'market_cap',
    showFavoritesOnly: false
};

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function fetchCryptoData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayCryptoData(data);
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayCryptoData(cryptos) {
    const container = document.getElementById('crypto-container');
    container.innerHTML = '';

    let filteredCryptos = cryptos;

    if (userPreferences.showFavoritesOnly) {
        filteredCryptos = cryptos.filter(crypto => favorites.includes(crypto.id));
    }

    filteredCryptos.sort((a, b) => {
        if (userPreferences.sortOption === 'price') return b.current_price - a.current_price;
        if (userPreferences.sortOption === 'name') return a.name.localeCompare(b.name);
        return b.market_cap - a.market_cap; // Default: Market Cap
    });

    filteredCryptos.forEach(crypto => {
        const cryptoElement = document.createElement('div');
        cryptoElement.className = 'crypto-item';
        cryptoElement.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Current Price: $${crypto.current_price.toLocaleString()}</p>
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button onclick="toggleFavorite('${crypto.id}')">
                ${favorites.includes(crypto.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        `;
        container.appendChild(cryptoElement);
    });
}

// Handle preferences changes
document.getElementById('sort-options').addEventListener('change', (event) => {
    userPreferences.sortOption = event.target.value;
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    fetchCryptoData();
});

document.getElementById('show-favorites-only').addEventListener('change', (event) => {
    userPreferences.showFavoritesOnly = event.target.checked;
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    fetchCryptoData();
});

// Favorite toggle function
function toggleFavorite(cryptoId) {
    const index = favorites.indexOf(cryptoId);
    if (index === -1) {
        favorites.push(cryptoId);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    fetchCryptoData();
}

// Load initial preferences
document.getElementById('sort-options').value = userPreferences.sortOption;
document.getElementById('show-favorites-only').checked = userPreferences.showFavoritesOnly;

fetchCryptoData();
