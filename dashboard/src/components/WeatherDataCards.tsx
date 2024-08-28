import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CloudRain, CloudSun, Thermometer, Wind} from "lucide-react";
import {WeatherData} from "@/models";

interface WeatherDataCardsProps {
  weatherData?: WeatherData | null
}

function WeatherDataCards({weatherData}: WeatherDataCardsProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Weather Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <CloudSun className="h-4 w-4 mr-1"/>
              Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.weatherDescription}</div>
            <p className="text-xs">{weatherData?.timestamp.toISOString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <CloudRain className="h-4 w-4 mr-1"/>
              Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.precipitation} mm</div>
            <p className="text-xs">{weatherData?.precipitationSeverity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Thermometer className="h-4 w-4 mr-1"/>
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.temperature.toFixed(1)}°C</div>
            <p className="text-xs">{weatherData?.timestamp.toISOString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Wind className="h-4 w-4 mr-1"/>
              Wind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.windSpeed.toFixed(1)} km/h</div>
            <p className="text-xs">Wind speed</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default WeatherDataCards
