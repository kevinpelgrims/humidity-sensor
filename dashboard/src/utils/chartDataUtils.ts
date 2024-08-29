import {ChartData, SensorData, WeatherData} from "@/models";

export function mergeData(sensorData: SensorData[], weatherData: WeatherData[]): ChartData[] {
  const mergedMap = new Map<number, ChartData>();

  sensorData.forEach(sensor => {
    mergedMap.set(sensor.timestamp.getTime(), {
      timestamp: sensor.timestamp,
      humidity: sensor.humidity,
      precipitation: null,
    });
  });

  weatherData.forEach(weather => {
    const timestamp = weather.timestamp.getTime();
    if (mergedMap.has(timestamp)) {
      const existingItem = mergedMap.get(timestamp)!;
      existingItem.precipitation = weather.precipitation;
    } else {
      mergedMap.set(timestamp, {
        timestamp: weather.timestamp,
        humidity: null,
        precipitation: weather.precipitation,
      });
    }
  });

  return Array.from(mergedMap.values()).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
