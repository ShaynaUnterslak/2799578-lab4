const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("country-input");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {

  spinner.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  countryInfo.classList.add("hidden");
  borderingCountries.classList.add("hidden");

  try {

    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (!response.ok) {
      throw new Error("Country not found");
    }

    const data = await response.json();
    const country = data[0];

    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <img src="${country.flags.svg}" alt="flag">
    `;

    countryInfo.classList.remove("hidden");

    // Bordering countries
    borderingCountries.innerHTML = "";

    if (country.borders) {

      for (let code of country.borders) {

        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const borderData = await borderResponse.json();
        const border = borderData[0];

        borderingCountries.innerHTML += `
          <section>
            <p>${border.name.common}</p>
            <img src="${border.flags.svg}" alt="flag">
          </section>
        `;
      }

      borderingCountries.classList.remove("hidden");

    } else {
      borderingCountries.innerHTML = "<p>No bordering countries</p>";
      borderingCountries.classList.remove("hidden");
    }

  } catch (error) {

    errorMessage.textContent = "Error: " + error.message;
    errorMessage.classList.remove("hidden");

  } finally {
    spinner.classList.add("hidden");
  }
}

searchBtn.addEventListener("click", () => {
  const country = input.value.trim();
  if (country !== "") {
    searchCountry(country);
  }
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
