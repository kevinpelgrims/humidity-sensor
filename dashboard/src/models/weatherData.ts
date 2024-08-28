export class WeatherData {
  precipitation: number;
  precipitationSeverity: string;
  rain: number;
  showers: number;
  temperature: number;
  timestamp: Date;
  weatherCode: string;
  weatherDescription: string;
  windSpeed: number;

  constructor(precipitation: number, precipitationSeverity: string, rain: number, showers: number, temperature: number, time: Date, weatherCode: string, weatherDescription: string, windSpeed: number) {
    this.precipitation = precipitation;
    this.precipitationSeverity = precipitationSeverity;
    this.rain = rain;
    this.showers = showers;
    this.temperature = temperature;
    this.timestamp = time;
    this.weatherCode = weatherCode;
    this.weatherDescription = weatherDescription;
    this.windSpeed = windSpeed;
  }
}
