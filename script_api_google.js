const API_KEY = "04f722fecc6b2e7b70f7e7a611aeaaa4"; // Remplace par TA clé OpenWeather

// ==== MÉTÉO ====
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

// ===== GOOGLE MAPS & AUTOCOMPLETE + GEOLOC =====
let map = null;
let marker = null;
let autocomplete = null;

function setMarker(lat, lon, label = "") {
  if (marker) marker.setMap(null);
  marker = new google.maps.Marker({
    position: {lat, lng: lon},
    map: map,
    title: label || "Sélection"
  });
}

function initMap() {
  // Map par défaut sur Paris (sera déplacée par la géoloc ensuite)
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.8584, lng: 2.2945},
    zoom: 8,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
    gestureHandling: "greedy",
  });

  // ========= GÉOLOCALISATION À L'OUVERTURE =========
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setCenter({lat, lng: lon});
        map.setZoom(8);
        setMarker(lat, lon, "Ma position");
        getWeatherByCoords(lat, lon);
      },
      function() {
        // Refusé ou impossible → fallback Paris
        setMarker(48.8584, 2.2945, "Paris");
        getWeatherByCoords(48.8584, 2.2945);
      }
    );
  } else {
    // Pas de géoloc
    setMarker(48.8584, 2.2945, "Paris");
    getWeatherByCoords(48.8584, 2.2945);
  }

  // ========= AUTOCOMPLETE GOOGLE PLACES =========
  const input = document.getElementById('research_bar');
  const searchButton = document.getElementById('research_button');

  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['(cities)']
  });

  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    map.setCenter({lat, lng: lon});
    map.setZoom(13);
    setMarker(lat, lon, place.name || input.value);
    getWeatherByCoords(lat, lon);
  });

  // ========= RECHERCHE PAR BOUTON =========
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
        alert('Choisis une ville dans la liste !');
        return;
      }
      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();
      map.setCenter({lat, lng: lon});
      map.setZoom(13);
      setMarker(lat, lon, place.name || input.value);
      getWeatherByCoords(lat, lon);
    });
  }

  // ========= CLIQUE SUR LA CARTE =========
  map.addListener('click', function(event) {
    const lat = event.latLng.lat();
    const lon = event.latLng.lng();
    setMarker(lat, lon, "");
    map.setCenter({lat, lng: lon});
    map.setZoom(13);
    getWeatherByCoords(lat, lon);
  });
}

// ========= MODE JOUR NUIT ===========
const themeSwitch = document.getElementById("theme_switch");
themeSwitch.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});
