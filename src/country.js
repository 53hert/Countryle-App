// Function to fetch JSON data
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to randomize the selection of a country object
export const getRandomCountry = (data) => {
  const countryKeys = Object.keys(data);
  const randomIndex = Math.floor(Math.random() * countryKeys.length);
  const randomCountryCode = countryKeys[randomIndex];
  const randomCountryObject = data[randomCountryCode];
  return randomCountryObject;
};

// Main function to use the above functions
export async function main() {
  try {
      // Replace this URL with the raw link to the JSON file
      const jsonFileUrl = 'https://raw.githubusercontent.com/lipis/flag-icons/main/country.json';

      const countryData = await fetchData(jsonFileUrl);
      const randomCountry = getRandomCountry(countryData);

      return randomCountry; // Return the randomCountry object

  } catch (error) {
      console.error('Error fetching or processing data:', error);
      return null; // Return null in case of error
  }
}
