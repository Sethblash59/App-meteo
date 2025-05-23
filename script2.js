// ======== À TOI DE JOUER : Mets ta clé OpenWeather ici =============
const API_KEY = "e3fc671b898c28cb04fb1f0a09300a76"; // Remplace par TA clé OpenWeather

// ==== TA FONCTION MÉTÉO (on ne change rien ici) ====
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

// ===== INITIALISATION DE GOOGLE PLACES AUTOCOMPLETE =====

// (À faire quand la page est prête, par exemple dans un <script> à la fin du body)
window.onload = function() {
  // Remplace ici par l'id de ton input de recherche !
  const input = document.getElementById('research_bar');
  const searchButton = document.getElementById('research_button');

  // Google Places Autocomplete sur ton input
  let autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['(cities)'] // On peut aussi mettre ['geocode'] pour tous types de lieux
    // Pas de restriction pays = recherche mondiale
  });

  // Quand tu valides une ville dans l'autocomplete (clic ou touche entrée)
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    if (!place.geometry) return; // Si aucun résultat choisi, on fait rien

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    // Appelle la météo directement
    getWeatherByCoords(lat, lon);
  });

  // (optionnel) Ajout du bouton de recherche pour lancer la météo manuellement
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
        alert('Choisis une ville dans la liste !');
        return;
      }
      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();
      getWeatherByCoords(lat, lon);
    });
  }
}
