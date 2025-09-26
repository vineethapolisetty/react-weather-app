// src/weatherCodes.js (example)
import clear from './assets/weather/clear.svg'
import cloudy from './assets/weather/cloudy.svg'
import rain from './assets/weather/rain.svg'
import snow from './assets/weather/snow.svg'
import fog from './assets/weather/fog.svg'
import partly from './assets/weather/partly.svg'
import thunder from './assets/weather/thunder.svg'

export function getWeatherInfo(code) {
  // map Open-Meteo weather codes to label & icon
  const map = {
    0: { label: 'Clear sky', icon: clear },
    1: { label: 'Mainly clear', icon: partly },
    2: { label: 'Partly cloudy', icon: cloudy },
    3: { label: 'Overcast', icon: cloudy },
    45: { label: 'Fog', icon: fog },
    48: { label: 'Depositing rime fog', icon: fog },
    51: { label: 'Light drizzle', icon: rain },
    61: { label: 'Rain', icon: rain },
    71: { label: 'Snow', icon: snow },
    95: { label: 'Thunderstorm', icon: thunder },
  }
  return map[code] || { label: 'Unknown', icon: clear }
}
