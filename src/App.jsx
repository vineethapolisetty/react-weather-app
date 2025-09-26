// src/App.jsx
import React, { useState } from 'react'
import './App.css'
import { getWeatherInfo } from './weatherCodes'
import { cToF } from './utils'

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [unit, setUnit] = useState('C') // 'C' or 'F'

  async function handleSearch(e) {
    e?.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setError('Please enter a city name.')
      setResult(null)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // 1) Geocode
      const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
      geoUrl.searchParams.set('name', trimmed)
      geoUrl.searchParams.set('count', '1')
      geoUrl.searchParams.set('language', 'en')
      geoUrl.searchParams.set('format', 'json')

      const geoRes = await fetch(geoUrl.toString())
      if (!geoRes.ok) throw new Error('Failed to search city')
      const geoJson = await geoRes.json()
      const first = geoJson?.results?.[0]
      if (!first) {
        setError('City not found. Try another search.')
        return
      }

      const latitude = first.latitude
      const longitude = first.longitude
      const resolvedName = `${first.name}${first.country ? ', ' + first.country : ''}`

      // 2) Fetch current weather
      const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
      weatherUrl.searchParams.set('latitude', String(latitude))
      weatherUrl.searchParams.set('longitude', String(longitude))
      weatherUrl.searchParams.set('current_weather', 'true')

      const weatherRes = await fetch(weatherUrl.toString())
      if (!weatherRes.ok) throw new Error('Failed to fetch weather')
      const weatherJson = await weatherRes.json()
      const current = weatherJson?.current_weather
      const temp = current?.temperature
      const wind = current?.windspeed
      const code = current?.weathercode

      if (typeof temp !== 'number') {
        setError('Weather data unavailable for this location.')
        return
      }

      const info = getWeatherInfo(typeof code === 'number' ? code : -1)
      setResult({
        name: resolvedName,
        latitude,
        longitude,
        temperature: Math.round(temp * 10) / 10,
        windspeed: wind,
        weathercode: code,
        description: info?.label || 'Unknown',
        icon: info?.icon || null,
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function toggleUnit() {
    setUnit((u) => (u === 'C' ? 'F' : 'C'))
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="brand">
          <h1>Weather</h1>
          
          <p className="tag">Check weather in you city</p>
           

        </div>

        <form className="search" onSubmit={handleSearch} aria-label="Search weather">
          <label className="visually-hidden" htmlFor="city">City name</label>
          <input
            id="city"
            type="text"
            placeholder="Enter city (e.g. Mumbai, London...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="City name"
          />

          <div className="search-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>

            <button
              type="button"
              className="btn-ghost unit-toggle"
              onClick={toggleUnit}
              aria-pressed={unit === 'F'}
              title={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}>
              {unit}
            </button>
          </div>
        </form>
      </header>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <section className="card skeleton" aria-hidden>
          <div className="header">
            <div className="title">
              <div className="skeleton-line w-60" />
              <div className="skeleton-line w-30" />
            </div>
            <div className="skeleton-circle" />
          </div>

          <div className="metrics">
            <div className="metric">
              <div className="skeleton-line w-40" />
              <div className="skeleton-line w-30" />
            </div>
            <div className="metric">
              <div className="skeleton-line w-40" />
              <div className="skeleton-line w-30" />
            </div>
          </div>
        </section>
      )}

      {result && (
        <section className="card" aria-live="polite">
          <div className="header">
            <div className="title">
              <h2>{result.name}</h2>
              <div className="desc">{result.description}</div>
              <div className="coords">{result.latitude.toFixed(2)}, {result.longitude.toFixed(2)}</div>
            </div>

            <div className="visuals">
              {result.icon ? (
                <img className="icon" src={result.icon} alt={result.description} />
              ) : (
                <div className="icon placeholder" aria-hidden />
              )}

              <div className="temp-big" aria-hidden>
                {unit === 'C'
                  ? `${result.temperature}°C`
                  : (cToF(result.temperature) !== null ? `${cToF(result.temperature)}°F` : '--')}
              </div>
            </div>
          </div>

          <div className="metrics">
            <div className="metric">
              <span className="label">Temperature</span>
              <span className="value">{unit === 'C' ? `${result.temperature}°C` : (cToF(result.temperature) !== null ? `${cToF(result.temperature)}°F` : '--')}</span>
            </div>

            {typeof result.windspeed === 'number' && (
              <div className="metric">
                <span className="label">Wind</span>
                <span className="value">{result.windspeed} km/h</span>
              </div>
            )}

            <div className="metric">
              <span className="label">Weather code</span>
              <span className="value">{result.weathercode}</span>
            </div>

            <div className="metric">
              <span className="label">Updated</span>
              <span className="value">Now</span>
            </div>
          </div>
        </section>
      )}

      {!error && !result && !loading && (
        <p className="hint">Try: London, Paris, New York, Tokyo</p>
      )}

      <footer className="footer">
        <small>Data provided by Open-Meteo • Built with React</small>
      </footer>
    </main>
  )
}
