export class SensorData {
  timestamp: Date;
  temperature: number;
  humidity: number;

  constructor(timestamp: Date, temperature: number, humidity: number) {
    this.timestamp = timestamp;
    this.temperature = temperature;
    this.humidity = humidity;
  }
}
