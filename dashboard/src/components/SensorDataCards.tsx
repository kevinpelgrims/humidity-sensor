import {SensorData} from "@/models";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Droplets, Thermometer} from "lucide-react";

interface SensorDataCardsProps {
  sensorData?: SensorData | null
}

function SensorDataCards({sensorData}: SensorDataCardsProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Sensor Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Thermometer className="h-4 w-4 mr-1"/>
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData?.temperature.toFixed(1)}°C</div>
            <p className="text-xs">{sensorData?.timestamp.toISOString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Droplets className="h-4 w-4 mr-1"/>
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData?.humidity.toFixed(1)}%</div>
            <p className="text-xs">{sensorData?.timestamp.toISOString()}</p>
          {/* Instead add "within range" or "out of range", or "danger zone" or something like that */}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default SensorDataCards
