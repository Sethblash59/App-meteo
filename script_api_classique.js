// --- SÉLECTION DES ÉLÉMENTS ET VARIABLES GLOBALES ---
const research = document.getElementById("research_bar");
const suggestionsDiv = document.getElementById("suggestions");
const searchButton = document.getElementById("research_button");

let lastSelectedCoords = null;
let currentSuggestions = [];
let searchRequestId = 0;

const API_KEY = "e3fc671b898c28cb04fb1f0a09300a76"; // Clé OpenWeather

// --- INITIALISATION DE LA CARTE LEAFLET ---
let map = L.map('map').setView([20, 0], 2); // Monde par défaut
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker = null;
function showOnMap(lat, lon, label = "") {
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon]).addTo(map)
    .bindPopup(label).openPopup();
  map.setView([lat, lon], 10); // Zoom sur la ville
  map.invalidateSize();
}

// --- FONCTION MÉTÉO ---
async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur API météo");
    const data = await response.json();

    document.getElementById("city").textContent = data.name || "Ville inconnue";
    document.getElementById("temp").textContent = data.main ? `${data.main.temp} °C` : "Température inconnue";
    document.getElementById("condition").textContent = data.weather && data.weather[0] ? data.weather[0].description : "Condition inconnue";
    document.getElementById("humidity").textContent = data.main ? `Humidité : ${data.main.humidity} %` : "Humidité inconnue";
    document.getElementById("wind").textContent = data.wind ? `Vent : ${data.wind.speed} m/s` : "Vent inconnu";
    document.getElementById("pressure").textContent = data.main ? `Pression : ${data.main.pressure} hPa` : "Pression inconnue";

    showOnMap(lat, lon, data.name ? `${data.name} (${lat.toFixed(2)}, ${lon.toFixed(2)})` : "");
  } catch (error) {
    document.getElementById("city").textContent = "Erreur météo";
    document.getElementById("temp").textContent = "-";
    document.getElementById("condition").textContent = "-";
    document.getElementById("humidity").textContent = "-";
    document.getElementById("wind").textContent = "-";
    document.getElementById("pressure").textContent = "-";
    console.error("Erreur lors de la récupération de la météo :", error);
  }
}

// --- AUTOCOMPLÉTION MONDIALE AVEC NOMINATIM ---
research.addEventListener("input", async function () {
  let searchTerm = research.value.trim();
  searchRequestId++;
  const currentId = searchRequestId;

  // Filtrage basique pour éviter les fetchs inutiles
  if (!searchTerm || searchTerm.length < 3) {
    suggestionsDiv.innerHTML = "";
    lastSelectedCoords = null;
    currentSuggestions = [];
    return;
  }

  try {
    // Nominatim OpenStreetMap (API mondiale)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&addressdetails=1&limit=5`);
    if (searchRequestId !== currentId) {
      if (!research.value.trim()) suggestionsDiv.innerHTML = "";
      return;
    }

    const results = await response.json();
    suggestionsDiv.innerHTML = "";
    currentSuggestions = results;

    if (results.length === 0) {
      suggestionsDiv.innerHTML = "<div>Aucune ville trouvée.</div>";
      return;
    }

    results.forEach(result => {
      // Construction de l’affichage : Ville, région, pays (pour éviter la confusion)
      const displayText = [
        result.display_name.split(",")[0],                        // Nom de la ville
        result.address.state || result.address.region || "",      // Région/état si dispo
        result.address.country || ""                              // Pays
      ].filter(Boolean).join(", ");

      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      const suggestionElt = document.createElement("div");
      suggestionElt.textContent = displayText;
      suggestionElt.addEventListener("click", function () {
        research.value = displayText;
        suggestionsDiv.innerHTML = "";
        lastSelectedCoords = [lon, lat];
        getWeatherByCoords(lat, lon); // OpenWeather prend (lat, lon)
      });
      suggestionsDiv.appendChild(suggestionElt);
    });
  } catch (error) {
    suggestionsDiv.innerHTML = "<div>Erreur lors de la recherche (API lente ou indisponible).</div>";
    currentSuggestions = [];
  }
});

research.addEventListener("blur", function () {
  setTimeout(() => {
    suggestionsDiv.innerHTML = "";
  }, 100);
});

searchButton.addEventListener("click", function () {
  if (lastSelectedCoords) {
    getWeatherByCoords(lastSelectedCoords[1], lastSelectedCoords[0]);
  } else {
    console.log("Veuillez choisir une ville dans la liste.");
  }
});

research.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (currentSuggestions.length > 0) {
      const result = currentSuggestions[0];
      if (!result) return;
      const displayText = [
        result.display_name.split(",")[0],
        result.address.state || result.address.region || "",
        result.address.country || ""
      ].filter(Boolean).join(", ");
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      research.value = displayText;
      suggestionsDiv.innerHTML = "";
      lastSelectedCoords = [lon, lat];
      getWeatherByCoords(lat, lon);
      event.preventDefault();
    }
  }
});
