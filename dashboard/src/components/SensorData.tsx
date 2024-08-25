import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Droplets, Thermometer} from "lucide-react";

function SensorData() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Sensor Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Thermometer className="h-4 w-4 mr-1" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.2°C</div>
            <p className="text-xs">2024-08-25 20:00:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-center">
              <Droplets className="h-4 w-4 mr-1" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">66.6%</div>
            <p className="text-xs">2024-08-25 20:00:00</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default SensorData
