import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {getHumidityThreshold} from "./humidity_helper.js";
import {getPrecipitationSeverity, getWeatherDescription, WeatherApiResponse, WeatherRecord} from "./weather_helper.js";

initializeApp();
const database = getFirestore();

export const fetchWeatherConditions = onDocumentCreated(
  "sensor_readings/{docId}",
  async () => {
    try {
      const latitude = 55.68;
      const longitude = 12.49;

      // eslint-disable-next-line max-len
      const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,rain,showers,weather_code,wind_speed_10m`;

      const response = await fetch(weatherApiUrl);
      const weatherData: WeatherApiResponse = await response.json();

      const weatherRecord: WeatherRecord = {
        time: Timestamp.fromDate(new Date(weatherData.current.time)),
        temperature: weatherData.current.temperature_2m,
        precipitation: weatherData.current.precipitation,
        precipitationSeverity: getPrecipitationSeverity(weatherData.current.precipitation),
        rain: weatherData.current.rain,
        showers: weatherData.current.showers,
        windSpeed: weatherData.current.wind_speed_10m,
        weatherCode: weatherData.current.weather_code,
        weatherDescription: getWeatherDescription(weatherData.current.weather_code),
      };

      await database.collection("weather_records").add(weatherRecord);
    } catch (error) {
      logger.error(error);
    }
  }
);

export const sendHumidityAlert = onDocumentCreated(
  "sensor_readings/{docId}",
  async (event) => {
    const sensorData = event.data?.data();

    if (!sensorData) {
      logger.log("Could not retrieve sensor data to prepare humidity alert.");
    }

    const humidity = sensorData?.humidity;
    const humidityThresholdRemoteConfig = await getHumidityThreshold();
    const humidityThreshold = humidityThresholdRemoteConfig || 70.0;

    if (humidityThresholdRemoteConfig === null) {
      logger.warn("Could not find humidity threshold. Using default value.");
    }

    if (humidity > humidityThreshold) {
      logger.log("Oh no! Humidity threshold passed!");
    }
  }
);
