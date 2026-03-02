const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    const trimmedName = countryName.trim();

    if (!trimmedName) {
        errorMessage.textContent = "Please enter a country name.";
        return;
    }

    const encodedName = encodeURIComponent(trimmedName);

    try {
        // Reset UI
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderSection.innerHTML = "";

        // Show spinner & disable button
        spinner.classList.remove('hidden');
        searchBtn.disabled = true;

        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodedName}`);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Handle bordering countries
        if (country.borders && country.borders.length > 0) {
            for (const code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;

                borderSection.appendChild(borderCard);
            }
        } else {
            borderSection.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        spinner.classList.add('hidden');
        searchBtn.disabled = false;
    }
}

// Click event
searchBtn.addEventListener('click', () => {
    searchCountry(input.value);
});

// Enter key support
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(input.value);
    }
});
