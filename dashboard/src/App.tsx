import './App.css'
import SensorDataCards from "@/components/SensorDataCards.tsx";
import WeatherDataCards from "@/components/WeatherDataCards.tsx";
import {SensorData} from "@/models";
import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore, limit, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";

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

  const fetchSensorData = async () => {
    const sensorReadingsCollection = collection(firestore, "sensor_readings");
    const sensorReadingsQuery = query(sensorReadingsCollection, orderBy("timestamp", "desc"), limit(1));
    const sensorReadingsSnapshot = await getDocs(sensorReadingsQuery);
    sensorReadingsSnapshot.forEach((doc) => {
      const data = doc.data();
      const sensorData = new SensorData(data.timestamp.toDate(), data.temperature, data.humidity);

      console.log(sensorData);

      setSensorData(sensorData);
    })
  };
  useEffect(() => {
    fetchSensorData();
  }, [])

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Humidity Dashboard</h1>
      <SensorDataCards sensorData={sensorData} />
      <WeatherDataCards />
    </div>
  )
}

export default App
