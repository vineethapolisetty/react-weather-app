# Weather App (React + Vite)

Simple weather search using Open‑Meteo APIs.

## Features
- Search a city name
- Displays current temperature (°C) and wind speed
- Clear loading and error handling

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the printed local URL in your browser.
4. I utilized the http://localhost:5173/

*** This project is a React app scaffolded with Vite: ***

React components in src/App.jsx
App bootstrapped in src/main.jsx via react-dom/client
package.json lists react and react-dom dependencies
You’re running it with Vite (npm run dev).

## How it works
- Uses `https://geocoding-api.open-meteo.com/v1/search` to resolve city to coordinates
- Uses `https://api.open-meteo.com/v1/forecast?current_weather=true` to fetch current weather

No API key required.
