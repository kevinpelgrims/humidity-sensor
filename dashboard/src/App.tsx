import './App.css'
import SensorDataCards from "@/components/SensorDataCards.tsx";
import WeatherDataCards from "@/components/WeatherDataCards.tsx";
import {ChartData, SensorData, WeatherData} from "@/models";
import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore, limit, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";
import {mergeData} from "@/utils/chartDataUtils.ts";
import SensorWeatherChart from "@/components/SensorWeatherChart.tsx";

function App() {
  const firebaseConfig = {
    projectId: import.meta.env.VITE_PROJECT_ID,
    appId: import.meta.env.VITE_APP_ID,
    apiKey: import.meta.env.VITE_API_KEY,
  }

  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);

  // TODO: We don't need to know about Firestore here, so let's refactor this at some point

  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [sensorWeatherData, setSensorWeatherData] = useState<ChartData[] | null>(null);

  const fetchSensorData = async (maximumRecords: number): Promise<SensorData[]> => {
    const sensorReadingsCollection = collection(firestore, "sensor_readings");
    const sensorReadingsQuery = query(sensorReadingsCollection, orderBy("timestamp", "desc"), limit(maximumRecords));
    const sensorReadingsSnapshot = await getDocs(sensorReadingsQuery);

    return sensorReadingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return new SensorData(data.timestamp.toDate(), data.temperature, data.humidity);
    });
  };

  const fetchWeatherData = async (maximumRecords: number): Promise<WeatherData[]> => {
    const weatherRecordsCollection = collection(firestore, "weather_records");
    const weatherRecordsQuery = query(weatherRecordsCollection, orderBy("time", "desc"), limit(maximumRecords));
    const weatherRecordsSnapshot = await getDocs(weatherRecordsQuery);

    return weatherRecordsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return new WeatherData(
        data.precipitation,
        data.precipitationSeverity,
        data.rain,
        data.showers,
        data.temperature,
        data.time.toDate(),
        data.weatherCode,
        data.weatherDescription,
        data.windSpeed
      );
    });
  };

  const updateSensorData = async (): Promise<void> => {
    const sensorDataArray = await fetchSensorData(1);
    if (sensorDataArray.length > 0) {
      setSensorData(sensorDataArray[0]);
    }
  };

  const updateWeatherData = async (): Promise<void> => {
    const weatherDataArray = await fetchWeatherData(1);
    if (weatherDataArray.length > 0) {
      setWeatherData(weatherDataArray[0]);
    }
  };

  const updateChartData = async (): Promise<void> => {
    const dataPoints = 35;
    const sensorDataArray = await fetchSensorData(dataPoints);
    const weatherDataArray = await fetchWeatherData(dataPoints);

    const chartData = mergeData(sensorDataArray, weatherDataArray);
    setSensorWeatherData(chartData);
  };

  useEffect(() => {
    updateSensorData();
    updateWeatherData();
    updateChartData();
  }, []);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Humidity Dashboard</h1>
      <SensorDataCards sensorData={sensorData}/>
      <WeatherDataCards weatherData={weatherData}/>
      <SensorWeatherChart data={sensorWeatherData}/>
    </div>
  );
}

export default App
