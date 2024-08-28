import './App.css'
import SensorData from "@/components/SensorData.tsx";
import WeatherData from "@/components/WeatherData.tsx";
import {initializeApp} from "firebase/app";

function App() {
  const firebaseConfig = {
    projectId: import.meta.env.VITE_PROJECT_ID,
    appId: import.meta.env.VITE_APP_ID,
    apiKey: import.meta.env.VITE_API_KEY,
  }

  const firebaseApp = initializeApp(firebaseConfig);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Humidity Dashboard</h1>
      <SensorData />
      <WeatherData />
    </div>
  )
}

export default App
