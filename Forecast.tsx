import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  CloudRain,
  Thermometer,
  Droplets,
  Info,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  generateWaterLevelForecast,
  calculateRiskLevel,
} from "../utils/forecastEngine";
import {
  getCurrentWeather,
  getCurrentWeatherOpenWeather,
  getCurrentWeatherOpenMeteo,
  getWeatherForecast,
  getOpenMeteoWeatherData,
  convertWeatherToEnvironmental,
  getLocationCoordinates,
  type WeatherData,
} from "../utils/weatherService";

const initialParams = {
  currentLevel: 75,
  rainfall: 15,
  soilMoisture: 55,
  temperature: 30,
};

export default function Forecast() {
  const [params, setParams] = useState(initialParams);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [location, setLocation] = useState("coimbatore");
  const [apiSource, setApiSource] = useState<
    "auto" | "openweather" | "openmeteo"
  >("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch weather data
  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const coords = getLocationCoordinates(location);

      let weather: WeatherData;
      if (apiSource === "openweather") {
        weather = await getCurrentWeatherOpenWeather(coords.lat, coords.lon);
      } else if (apiSource === "openmeteo") {
        weather = await getCurrentWeatherOpenMeteo(coords.lat, coords.lon);
      } else {
        // Auto - use fallback logic
        weather = await getCurrentWeather(coords.lat, coords.lon);
      }

      const forecast = await getWeatherForecast(coords.lat, coords.lon);

      setCurrentWeather(weather);

      // Update parameters with real weather data
      setParams((prev) => ({
        ...prev,
        temperature: Math.round(weather.temperature),
        rainfall: Math.round(weather.rainfall * 10) / 10, // Round to 1 decimal
        soilMoisture: Math.round(weather.humidity * 0.8), // Estimate soil moisture from humidity
      }));

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather data on component mount and location change
  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const predictions = useMemo(() => {
    // Use real weather forecast for more accurate predictions
    const environmentalData = currentWeather
      ? [
          {
            rainfall: currentWeather.rainfall,
            soilMoisture: Math.round(currentWeather.humidity * 0.8),
            temperature: currentWeather.temperature,
            evapotranspiration:
              currentWeather.temperature > 25
                ? (currentWeather.temperature - 25) * 2
                : 0,
          },
        ]
      : [];

    // Generate historical data based on current conditions
    const historicalData = [];
    for (let i = 0; i < 30; i++) {
      historicalData.push({
        rainfall: params.rainfall + (Math.random() - 0.5) * 10,
        soilMoisture: params.soilMoisture + (Math.random() - 0.5) * 20,
        temperature: params.temperature + (Math.random() - 0.5) * 5,
      });
    }

    return generateWaterLevelForecast(params.currentLevel, historicalData, 30);
  }, [params, currentWeather]);

  const riskAssessment = useMemo(
    () => calculateRiskLevel(predictions),
    [predictions]
  );

  // Calculate Water Health Score (0-100)
  const waterHealthScore = useMemo(() => {
    const avgLevel =
      predictions.reduce((sum, p) => sum + p.predictedLevel, 0) /
      predictions.length;
    const trend = predictions[predictions.length - 1].trend;

    let baseScore = Math.max(0, Math.min(100, 100 - (avgLevel - 50) * 1.5));

    // Adjust based on trend
    if (trend === "rising") baseScore += 10;
    else if (trend === "falling") baseScore -= 15;

    // Add some randomness for demo
    const finalScore = Math.max(
      40,
      Math.min(90, baseScore + (Math.random() - 0.5) * 10)
    );
    return Math.round(finalScore);
  }, [predictions]);

  // Water Health Score label
  const getHealthLabel = (score: number) => {
    if (score > 70) return { label: "Sustainable 💧", color: "text-green-600" };
    if (score >= 40) return { label: "Moderate ⚖️", color: "text-yellow-600" };
    return { label: "Critical ⚠️", color: "text-red-600" };
  };

  const healthStatus = getHealthLabel(waterHealthScore);

  // Radial chart data
  const radialData = [
    {
      name: "Health Score",
      value: waterHealthScore,
      fill:
        waterHealthScore > 70
          ? "#10b981"
          : waterHealthScore >= 40
          ? "#f59e0b"
          : "#ef4444",
    },
  ];

  const chartData = predictions.map((p) => ({
    date: p.date,
    level: p.predictedLevel,
    confidence: p.confidence,
  }));

  const handleUpdateParams = () => {
    setParams({ ...params });
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "rising")
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (trend === "falling")
      return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-yellow-600" />;
  };

  const getRiskColor = (level: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-300",
      moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[level as keyof typeof colors] || colors.moderate;
  };

  const latestPrediction = predictions[predictions.length - 1];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url(/images/water-spring-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay for better content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/45 via-sky-50/50 to-cyan-50/45"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <header className="mb-8 backdrop-blur-sm bg-white/25 p-6 rounded-xl border border-black shadow-lg">
            <h1 className="text-3xl font-bold text-slate-900 [text-shadow:_1px_1px_2px_rgb(255_255_255_/_50%)]">
              30-Day Water Table Forecast
            </h1>
            <p className="text-slate-700 mt-2 [text-shadow:_1px_1px_1px_rgb(255_255_255_/_40%)]">
              Real-time AI predictions using OpenWeatherMap data and
              environmental parameters
            </p>
          </header>

          {/* Current Weather & Location Selector */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-black">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  <span>Current Weather Data</span>
                </div>
                <Button
                  onClick={fetchWeatherData}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {isLoading ? "Updating..." : "Refresh"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="coimbatore">Coimbatore</option>
                    <option value="chennai">Chennai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="pune">Pune</option>
                    <option value="kolkata">Kolkata</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <CloudRain className="h-4 w-4" />
                    <span>API Source</span>
                  </label>
                  <select
                    value={apiSource}
                    onChange={(e) =>
                      setApiSource(
                        e.target.value as "auto" | "openweather" | "openmeteo"
                      )
                    }
                    className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="auto">Auto (Fallback)</option>
                    <option value="openweather">OpenWeatherMap</option>
                    <option value="openmeteo">Open-Meteo</option>
                  </select>
                </div>

                {currentWeather && (
                  <>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        Temperature
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-semibold">
                          {Math.round(currentWeather.temperature)}°C
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Humidity</div>
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-semibold">
                          {currentWeather.humidity}%
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Rainfall</div>
                      <div className="flex items-center justify-center gap-1">
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                        <span className="text-lg font-semibold">
                          {currentWeather.rainfall}mm
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        Conditions
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <img
                          src={`https://openweathermap.org/img/wn/${currentWeather.icon}.png`}
                          alt={currentWeather.description}
                          className="w-8 h-8"
                        />
                        <span className="text-sm font-medium capitalize">
                          {currentWeather.description}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center">
                Last updated: {lastUpdated.toLocaleString()} •
                {currentWeather?.source && (
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {currentWeather.source}
                  </span>
                )}
                {!currentWeather?.source &&
                  " Data from OpenWeatherMap & Open-Meteo"}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`mb-6 border-2 ${getRiskColor(riskAssessment.level)}`}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg capitalize">
                    {riskAssessment.level} Risk Level
                  </h3>
                  <p className="text-sm mt-1">{riskAssessment.message}</p>
                </div>
                {getTrendIcon(latestPrediction.trend)}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CloudRain className="h-5 w-5 text-cyan-600" />
                <span>Environmental Parameters</span>
              </CardTitle>
              <CardDescription>
                Adjust parameters to see updated predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <Droplets className="h-4 w-4" />
                    <span>Current Level (ft)</span>
                  </label>
                  <Input
                    type="number"
                    value={params.currentLevel}
                    onChange={(e) =>
                      setParams({ ...params, currentLevel: +e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <CloudRain className="h-4 w-4" />
                    <span>Avg Rainfall (mm)</span>
                  </label>
                  <Input
                    type="number"
                    value={params.rainfall}
                    onChange={(e) =>
                      setParams({ ...params, rainfall: +e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <Droplets className="h-4 w-4" />
                    <span>Soil Moisture (%)</span>
                  </label>
                  <Input
                    type="number"
                    value={params.soilMoisture}
                    onChange={(e) =>
                      setParams({ ...params, soilMoisture: +e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <Thermometer className="h-4 w-4" />
                    <span>Temperature (°C)</span>
                  </label>
                  <Input
                    type="number"
                    value={params.temperature}
                    onChange={(e) =>
                      setParams({ ...params, temperature: +e.target.value })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleUpdateParams} className="mt-4">
                Update Forecast
              </Button>
            </CardContent>
          </Card>

          {/* Main Forecast Cards - Two Cards Side by Side */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Card 1: Water Level Trend */}
            <Card className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle>
                  Predicted Groundwater Levels (Next 30 Days)
                </CardTitle>
                <CardDescription>
                  AI-powered forecast with trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="waterGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#06b6d4"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#0891b2"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        stroke="#64748b"
                      />
                      <YAxis
                        label={{
                          value: "Depth (m)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                        stroke="#64748b"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="level"
                        stroke="url(#waterGradient)"
                        strokeWidth={3}
                        dot={{ fill: "#0891b2", r: 4 }}
                        name="Water Level (m)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Water Health Score */}
            <Card className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Water Health Score
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      Score based on water level trends, sustainability metrics,
                      and risk factors
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      data={radialData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        fill={radialData[0].fill}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Score Display */}
                <div className="text-center mt-4">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    {waterHealthScore}
                  </div>
                  <div
                    className={`text-lg font-semibold ${healthStatus.color} mb-2`}
                  >
                    {healthStatus.label}
                  </div>
                  <p className="text-sm text-slate-600 max-w-xs">
                    {waterHealthScore > 70
                      ? "Water resources are in excellent condition with sustainable management practices."
                      : waterHealthScore >= 40
                      ? "Water resources require monitoring and conservative usage practices."
                      : "Immediate water conservation measures and recharge initiatives needed."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Section */}
          <Card className="mb-6 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                AI Insights (Multi-Source Weather Data)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentWeather
                  ? `Based on current conditions in ${
                      currentWeather.location
                    } (${Math.round(currentWeather.temperature)}°C, ${
                      currentWeather.humidity
                    }% humidity, ${
                      currentWeather.description
                    }), groundwater levels are expected to ${
                      latestPrediction.trend === "rising"
                        ? "improve over the next 15 days due to favorable conditions"
                        : latestPrediction.trend === "falling"
                        ? "decline gradually due to low rainfall and high evaporation"
                        : "remain stable with minor fluctuations"
                    }. Current rainfall data shows ${
                      currentWeather.rainfall
                    }mm, indicating ${
                      currentWeather.rainfall > 2
                        ? "good recharge potential"
                        : "limited natural recharge"
                    }.`
                  : "Loading real-time weather data from multiple APIs (OpenWeatherMap & Open-Meteo) to provide accurate groundwater predictions..."}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Last updated: {lastUpdated.toLocaleString()} • Data source:{" "}
                  {currentWeather?.source || "Multi-API"} • Confidence:{" "}
                  {latestPrediction?.confidence || 85}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle>30-Day Trend</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-4">
                  {getTrendIcon(latestPrediction.trend)}
                  <span className="text-2xl font-bold capitalize">
                    {latestPrediction.trend}
                  </span>
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Predicted level in 30 days:{" "}
                  <strong>
                    {Math.round(latestPrediction.predictedLevel)} ft
                  </strong>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Confidence: {latestPrediction.confidence}%
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle>Contributing Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Rainfall Impact:</span>
                  <span className="font-medium text-green-600">
                    +{latestPrediction.factors.rainfall.toFixed(1)} ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Evaporation:</span>
                  <span className="font-medium text-red-600">
                    -{latestPrediction.factors.evaporation.toFixed(1)} ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Soil Absorption:</span>
                  <span className="font-medium text-amber-600">
                    -{latestPrediction.factors.soilAbsorption.toFixed(1)} ft
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">
                {riskAssessment.level === "critical" ||
                riskAssessment.level === "high" ? (
                  <ul className="space-y-1 list-disc ml-4">
                    <li>Start rainwater harvesting immediately</li>
                    <li>Build recharge pits in low-lying areas</li>
                    <li>Reduce water extraction by 30%</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 list-disc ml-4">
                    <li>Continue monitoring water levels</li>
                    <li>Maintain existing recharge systems</li>
                    <li>Plan for monsoon water storage</li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
