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
    const nearestTime = findNearestHumidityPoint(mergedMap, timestamp);

    if (nearestTime !== null) {
      const existingItem = mergedMap.get(nearestTime)!;
      existingItem.precipitation = weather.precipitation;
    } else {
      // If no suitable humidity point is found, add a new data point
      mergedMap.set(timestamp, {
        timestamp: weather.timestamp,
        humidity: null,
        precipitation: weather.precipitation,
      });
    }
  });

  return Array.from(mergedMap.values()).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

const findNearestHumidityPoint = (map: Map<number, ChartData>, timestamp: number): number | null => {
  let nearestTime: number | null = null;
  let minimumDifference = Infinity;

  for (const [time, data] of map.entries()) {
    if (data.precipitation === null) {
      const difference = Math.abs(time - timestamp);
      if (difference < minimumDifference) {
        minimumDifference = difference;
        nearestTime = time;
      }
    }
  }

  return nearestTime;
};
