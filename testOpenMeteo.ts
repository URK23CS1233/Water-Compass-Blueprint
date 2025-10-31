/**
 * Test Open-Meteo API Integration
 * Simple test to verify the Open-Meteo API is working correctly
 */

import { getOpenMeteoWeatherData, getCurrentWeatherOpenMeteo } from '../utils/weatherService';

export async function testOpenMeteoAPI() {
  console.log('Testing Open-Meteo API...');
  
  try {
    // Test coordinates for Berlin (from the provided API URL)
    const berlinLat = 52.52;
    const berlinLon = 13.41;
    
    // Test 1: Get current weather for Berlin
    console.log('1. Testing current weather for Berlin...');
    const currentWeather = await getCurrentWeatherOpenMeteo(berlinLat, berlinLon);
    console.log('Current Weather:', currentWeather);
    
    // Test 2: Get comprehensive weather data
    console.log('2. Testing comprehensive weather data...');
    const comprehensiveData = await getOpenMeteoWeatherData(berlinLat, berlinLon);
    console.log('Comprehensive Data:', comprehensiveData);
    
    // Test 3: Test for Indian cities (Coimbatore)
    console.log('3. Testing for Coimbatore, India...');
    const coimbatoreWeather = await getCurrentWeatherOpenMeteo(11.0168, 76.9558);
    console.log('Coimbatore Weather:', coimbatoreWeather);
    
    console.log('✅ All Open-Meteo API tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Open-Meteo API test failed:', error);
    return false;
  }
}

// Example usage in browser console:
// testOpenMeteoAPI().then(result => console.log('Test result:', result));