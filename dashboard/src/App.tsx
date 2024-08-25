import './App.css'
import SensorData from "@/components/SensorData.tsx";
import WeatherData from "@/components/WeatherData.tsx";

function App() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Humidity Dashboard</h1>
      <SensorData />
      <WeatherData />
    </div>
  )
}

export default App
