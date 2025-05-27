# Caelum

## Description

Caelum est une application météo moderne et responsive. L’idée de base était de proposer une appli qui utilise l’API du gouvernement français pour l’autocomplétion des villes et OpenWeather pour afficher les informations météo.

## Objectif

Créer un site météo efficace et pratique, avec une autocomplétion performante et des infos météo à l’échelle mondiale.

## Méthodologie prévue

- **Maquettage** : Réalisation de wireframes puis d’une maquette sur Figma.
- **Développement** : D’abord tout l’aspect technique (fonctions, appels API, logique), puis la partie esthétique (UI/UX).

## Parcours du projet

- **Début** : Utilisation de l’API du gouvernement français pour l’autocomplétion des villes.
- **Changement 1** : Pour élargir la portée à l’international, recherches sur plusieurs API d’autocomplétion mondiale. Passage par Nominatim (permet d’obtenir les coordonnées d’une ville pour les transmettre à OpenWeather et récupérer la météo).
- **Ajout de fonctionnalités** : Intégration d’une carte interactive avec Leaflet.
- **Changement 2** : Découverte que Google propose ses propres API (météo, autocomplétion, cartographie). Choix de se tourner vers cette solution pour obtenir un code plus propre, plus rapide et moins coûteux en ressources.

## Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript
- **APIs** :
  - OpenWeather
  - Nominatim
  - Leaflet
  - (optionnellement) Google Maps/Places/Weather API
- **Outils de conception** : Figma, Wireframe
