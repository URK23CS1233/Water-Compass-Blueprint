/**
 * AI Water Table Forecast Engine
 * Predicts water level trends using rainfall, soil moisture, and temperature data
 */

export type EnvironmentalData = {
  rainfall: number; // mm
  soilMoisture: number; // percentage
  temperature: number; // celsius
  evapotranspiration?: number; // mm
};

export type WaterLevelPrediction = {
  date: string;
  predictedLevel: number; // feet below ground
  confidence: number; // 0-100
  trend: "rising" | "stable" | "falling";
  factors: {
    rainfall: number;
    evaporation: number;
    soilAbsorption: number;
  };
};

/**
 * Simple ML-inspired prediction model
 * In production, replace with actual ML model (TensorFlow.js, API call, etc.)
 */
export function generateWaterLevelForecast(
  currentLevel: number,
  historicalData: EnvironmentalData[],
  daysAhead: number = 30
): WaterLevelPrediction[] {
  const predictions: WaterLevelPrediction[] = [];
  let level = currentLevel;

  // Calculate baseline trends from historical data
  const avgRainfall =
    historicalData.reduce((sum, d) => sum + d.rainfall, 0) / historicalData.length;
  const avgTemp =
    historicalData.reduce((sum, d) => sum + d.temperature, 0) / historicalData.length;
  const avgSoil =
    historicalData.reduce((sum, d) => sum + d.soilMoisture, 0) / historicalData.length;

  for (let day = 1; day <= daysAhead; day++) {
    const today = new Date();
    today.setDate(today.getDate() + day);

    // Mock environmental variations (in production, use weather API)
    const rainfall = avgRainfall + Math.sin(day / 7) * 20 + (Math.random() - 0.5) * 10;
    const temp = avgTemp + Math.cos(day / 15) * 5 + (Math.random() - 0.5) * 3;
    const soil = avgSoil + (rainfall * 0.3 - temp * 0.2);

    // Calculate water level change factors
    const rainfallImpact = rainfall * 0.05; // Recharge from rain
    const evaporationLoss = (temp - 20) * 0.03; // Higher temp = more evaporation
    const soilAbsorption = (100 - soil) * 0.02; // Dry soil absorbs more

    // Net change in water level (negative = rising water, positive = falling)
    const netChange = evaporationLoss + soilAbsorption - rainfallImpact;
    level += netChange;

    // Determine trend
    let trend: "rising" | "stable" | "falling";
    if (netChange < -0.5) trend = "rising";
    else if (netChange > 0.5) trend = "falling";
    else trend = "stable";

    // Confidence decreases with time
    const confidence = Math.max(50, 95 - day * 1.5);

    predictions.push({
      date: today.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      predictedLevel: Math.max(10, Math.min(150, level)), // Keep in realistic range
      confidence: Math.round(confidence),
      trend,
      factors: {
        rainfall: Math.round(rainfall * 10) / 10,
        evaporation: Math.round(evaporationLoss * 10) / 10,
        soilAbsorption: Math.round(soilAbsorption * 10) / 10,
      },
    });
  }

  return predictions;
}

/**
 * Calculate risk level based on predicted water levels
 */
export function calculateRiskLevel(predictions: WaterLevelPrediction[]): {
  level: "low" | "moderate" | "high" | "critical";
  message: string;
} {
  const avgLevel =
    predictions.reduce((sum, p) => sum + p.predictedLevel, 0) / predictions.length;
  const trend = predictions[predictions.length - 1].trend;

  if (avgLevel > 120 || trend === "falling") {
    return {
      level: "critical",
      message: "Water table falling rapidly. Immediate conservation needed.",
    };
  } else if (avgLevel > 100) {
    return {
      level: "high",
      message: "Water levels declining. Implement recharge measures soon.",
    };
  } else if (avgLevel > 80) {
    return {
      level: "moderate",
      message: "Water levels stable but monitor closely.",
    };
  } else {
    return {
      level: "low",
      message: "Water table healthy. Continue sustainable practices.",
    };
  }
}

/**
 * Generate mock historical environmental data
 * In production, fetch from weather API or local sensors
 */
export function generateMockHistoricalData(days: number = 30): EnvironmentalData[] {
  const data: EnvironmentalData[] = [];
  for (let i = 0; i < days; i++) {
    data.push({
      rainfall: 5 + Math.random() * 25, // 5-30mm
      soilMoisture: 40 + Math.random() * 30, // 40-70%
      temperature: 25 + Math.random() * 10, // 25-35°C
    });
  }
  return data;
}
