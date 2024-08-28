import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CloudRain, CloudSun, Thermometer, Wind} from "lucide-react";

function WeatherDataCards() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Weather Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <CloudSun className="h-4 w-4 mr-1" />
              Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mainly clear</div>
            <p className="text-xs">2024-08-25 20:00:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <CloudRain className="h-4 w-4 mr-1" />
              Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 mm</div>
            <p className="text-xs">Moderate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Thermometer className="h-4 w-4 mr-1" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19.9°C</div>
            <p className="text-xs">2024-08-25 20:00:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Wind className="h-4 w-4 mr-1" />
              Wind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.8 km/h</div>
            <p className="text-xs">Wind speed</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default WeatherDataCards
