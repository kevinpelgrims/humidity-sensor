// This requires the AM2302-Sensor library
// https://github.com/hasenradball/AM2302-Sensor
#include <AM2302-Sensor.h>

// Initialize on pin 2
AM2302::AM2302_Sensor am2302{2};

float humidity;
float temperature;

void setup()
{
  Serial.begin(9600);
	am2302.begin();
}

void loop()
{
  auto status = am2302.read();
  humidity = am2302.get_Humidity();
  temperature = am2302.get_Temperature();

  // Example output: {"status":"OK","humidity":50.90,"temperature":22.00}

  Serial.print("{");

  Serial.print("\"status\":");
  Serial.print("\"");
  Serial.print(AM2302::AM2302_Sensor::get_sensorState(status));
  Serial.print("\"");
  Serial.print(",");

  Serial.print("\"humidity\":");
  Serial.print(humidity);
  Serial.print(",");

  Serial.print("\"temperature\":");
  Serial.print(temperature);

  Serial.println("}");

  delay(5000);
}
