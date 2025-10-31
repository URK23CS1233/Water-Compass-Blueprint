/**
 * Multi-Source Weather API Integration
 * Fetches real weather data from OpenWeatherMap and Open-Meteo APIs
 */

const OPENWEATHER_API_KEY = 'f1fe6b35cd951ea60c8376ddd3994512';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  rainfall: number; // mm (last 1h or 3h)
  pressure: number; // hPa
  windSpeed: number; // m/s
  description: string;
  icon: string;
  location: string;
  source?: string; // API source identifier
}

export interface ForecastData {
  dt: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  pressure: number;
  description: string;
  icon: string;
  source?: string; // API source identifier
}

// Open-Meteo specific interfaces
export interface OpenMeteoCurrentData {
  temperature: number;
  humidity: number;
  precipitation: number;
  pressure: number;
  windSpeed: number;
  weatherCode: number;
}

export interface OpenMeteoForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  surface_pressure: number[];
  wind_speed_10m: number[];
  weather_code: number[];
}

/**
 * Convert Open-Meteo weather code to description
 */
function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    71: 'slight snow',
    73: 'moderate snow',
    75: 'heavy snow',
    80: 'slight rain showers',
    81: 'moderate rain showers',
    82: 'violent rain showers',
    95: 'thunderstorm',
    96: 'thunderstorm with hail',
    99: 'thunderstorm with heavy hail'
  };
  return descriptions[code] || 'unknown';
}

/**
 * Convert Open-Meteo weather code to icon
 */
function getWeatherIcon(code: number): string {
  const icons: { [key: number]: string } = {
    0: '01d', // clear sky
    1: '02d', // mainly clear
    2: '03d', // partly cloudy
    3: '04d', // overcast
    45: '50d', // fog
    48: '50d', // depositing rime fog
    51: '09d', // light drizzle
    53: '09d', // moderate drizzle
    55: '09d', // dense drizzle
    61: '10d', // slight rain
    63: '10d', // moderate rain
    65: '10d', // heavy rain
    71: '13d', // slight snow
    73: '13d', // moderate snow
    75: '13d', // heavy snow
    80: '09d', // slight rain showers
    81: '09d', // moderate rain showers
    82: '09d', // violent rain showers
    95: '11d', // thunderstorm
    96: '11d', // thunderstorm with hail
    99: '11d'  // thunderstorm with heavy hail
  };
  return icons[code] || '01d';
}

/**
 * Get current weather data from OpenWeatherMap
 */
export async function getCurrentWeatherOpenWeather(lat: number = 11.0168, lon: number = 76.9558): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      location: data.name,
      source: 'OpenWeatherMap'
    };
  } catch (error) {
    console.error('Error fetching OpenWeatherMap current weather:', error);
    throw error;
  }
}

/**
 * Get current weather data from Open-Meteo API
 */
export async function getCurrentWeatherOpenMeteo(lat: number = 11.0168, lon: number = 76.9558): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }
    
    const data = await response.json();
    const current = data.current;
    
    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainfall: current.precipitation || 0,
      pressure: current.surface_pressure,
      windSpeed: current.wind_speed_10m,
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      source: 'Open-Meteo'
    };
  } catch (error) {
    console.error('Error fetching Open-Meteo current weather:', error);
    throw error;
  }
}

/**
 * Get current weather data with fallback (tries OpenWeatherMap first, then Open-Meteo)
 */
export async function getCurrentWeather(lat: number = 11.0168, lon: number = 76.9558): Promise<WeatherData> {
  try {
    // Try OpenWeatherMap first
    return await getCurrentWeatherOpenWeather(lat, lon);
  } catch (error) {
    console.warn('OpenWeatherMap failed, trying Open-Meteo:', error);
    try {
      // Fallback to Open-Meteo
      return await getCurrentWeatherOpenMeteo(lat, lon);
    } catch (fallbackError) {
      console.error('Both weather APIs failed:', fallbackError);
      // Return fallback data
      return {
        temperature: 28,
        humidity: 65,
        rainfall: 2.5,
        pressure: 1013,
        windSpeed: 3.2,
        description: 'scattered clouds',
        icon: '03d',
        location: 'Coimbatore',
        source: 'Fallback'
      };
    }
  }
}

/**
 * Get 5-day weather forecast from OpenWeatherMap
 */
export async function getWeatherForecastOpenWeather(lat: number = 11.0168, lon: number = 76.9558): Promise<ForecastData[]> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.list.map((item: any) => ({
      dt: item.dt,
      temperature: item.main.temp,
      humidity: item.main.humidity,
      rainfall: item.rain?.['3h'] || 0,
      pressure: item.main.pressure,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      source: 'OpenWeatherMap'
    }));
  } catch (error) {
    console.error('Error fetching OpenWeatherMap forecast:', error);
    throw error;
  }
}

/**
 * Get weather forecast from Open-Meteo API
 */
export async function getWeatherForecastOpenMeteo(lat: number = 11.0168, lon: number = 76.9558): Promise<ForecastData[]> {
  try {
    const response = await fetch(
      `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code&timezone=auto&forecast_days=5`
    );
    
    if (!response.ok) {
      throw new Error(`Open-Meteo Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    const hourly = data.hourly;
    
    // Convert hourly data to 3-hour intervals to match OpenWeatherMap format
    const forecast: ForecastData[] = [];
    for (let i = 0; i < hourly.time.length; i += 3) {
      forecast.push({
        dt: new Date(hourly.time[i]).getTime() / 1000,
        temperature: hourly.temperature_2m[i],
        humidity: hourly.relative_humidity_2m[i],
        rainfall: hourly.precipitation[i] || 0,
        pressure: hourly.surface_pressure[i],
        description: getWeatherDescription(hourly.weather_code[i]),
        icon: getWeatherIcon(hourly.weather_code[i]),
        source: 'Open-Meteo'
      });
    }
    
    return forecast.slice(0, 40); // Limit to 40 entries (5 days * 8 per day)
  } catch (error) {
    console.error('Error fetching Open-Meteo forecast:', error);
    throw error;
  }
}

/**
 * Get weather forecast with fallback (tries OpenWeatherMap first, then Open-Meteo)
 */
export async function getWeatherForecast(lat: number = 11.0168, lon: number = 76.9558): Promise<ForecastData[]> {
  try {
    // Try OpenWeatherMap first
    return await getWeatherForecastOpenWeather(lat, lon);
  } catch (error) {
    console.warn('OpenWeatherMap forecast failed, trying Open-Meteo:', error);
    try {
      // Fallback to Open-Meteo
      return await getWeatherForecastOpenMeteo(lat, lon);
    } catch (fallbackError) {
      console.error('Both forecast APIs failed:', fallbackError);
      // Return fallback forecast data
      return generateFallbackForecast();
    }
  }
}

/**
 * Get comprehensive weather data from Open-Meteo API
 * Includes current conditions and detailed hourly forecast
 */
export async function getOpenMeteoWeatherData(lat: number = 11.0168, lon: number = 76.9558) {
  try {
    const response = await fetch(
      `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`
    );
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation || 0,
        pressure: data.current.surface_pressure,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        description: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code)
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        humidity: data.hourly.relative_humidity_2m,
        precipitation: data.hourly.precipitation,
        pressure: data.hourly.surface_pressure,
        windSpeed: data.hourly.wind_speed_10m,
        weatherCode: data.hourly.weather_code
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        precipitationSum: data.daily.precipitation_sum
      },
      location: { lat, lon },
      source: 'Open-Meteo',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Open-Meteo comprehensive data:', error);
    throw error;
  }
}
function generateFallbackForecast(): ForecastData[] {
  const forecast: ForecastData[] = [];
  const baseTime = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < 40; i++) { // 5 days * 8 (every 3 hours)
    forecast.push({
      dt: baseTime + (i * 3 * 60 * 60), // Every 3 hours
      temperature: 25 + Math.sin(i * 0.5) * 5 + Math.random() * 3,
      humidity: 60 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
      rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0,
      pressure: 1010 + Math.sin(i * 0.2) * 10,
      description: ['clear sky', 'few clouds', 'scattered clouds', 'light rain'][Math.floor(Math.random() * 4)],
      icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)]
    });
  }
  
  return forecast;
}

/**
 * Convert weather forecast to environmental data for water level prediction
 */
export function convertWeatherToEnvironmental(forecast: ForecastData[]): Array<{
  rainfall: number;
  soilMoisture: number;
  temperature: number;
  date: string;
}> {
  return forecast.slice(0, 30).map((weather) => {
    const date = new Date(weather.dt * 1000);
    
    // Calculate soil moisture based on humidity and recent rainfall
    const soilMoisture = Math.min(100, weather.humidity * 0.8 + weather.rainfall * 2);
    
    return {
      rainfall: weather.rainfall,
      soilMoisture: Math.round(soilMoisture),
      temperature: Math.round(weather.temperature),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
}

/**
 * Get location coordinates (you can extend this with a geocoding API)
 */
export const getLocationCoordinates = (city: string): { lat: number; lon: number } => {
  const locations: { [key: string]: { lat: number; lon: number } } = {
    'coimbatore': { lat: 11.0168, lon: 76.9558 },
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'bangalore': { lat: 12.9716, lon: 77.5946 },
    'mumbai': { lat: 19.0760, lon: 72.8777 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'hyderabad': { lat: 17.3850, lon: 78.4867 },
    'pune': { lat: 18.5204, lon: 73.8567 },
    'kolkata': { lat: 22.5726, lon: 88.3639 }
  };
  
  return locations[city.toLowerCase()] || locations['coimbatore'];
};