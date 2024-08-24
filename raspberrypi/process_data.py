import json
import time
from dataclasses import dataclass
from datetime import datetime

import schedule
import serial


@dataclass
class SensorData:
    temperature: float
    humidity: float

    @classmethod
    def from_json(cls, json_data):
        return cls(
            temperature=json_data['temperature'],
            humidity=json_data['humidity']
        )

    def __str__(self):
        return f"Temperature: {self.temperature}°C, Humidity: {self.humidity}%"


def read_serial_data(serial_port: str) -> SensorData:
    # Configure the serial connection
    # We open and close it every 15 minutes so that we don't block any other processes from accessing the serial port.
    serial_connection = serial.Serial(f'/dev/{serial_port}', 9600, timeout=1)
    # Set backoff to 5 seconds, because that's the frequency at which the Arduino is emitting data
    read_backoff_in_seconds = 5

    try:
        # Read data from the serial port (with retries)
        for _ in range(3):
            if serial_connection.in_waiting > 0:
                data = serial_connection.readline().decode('utf-8').strip()
                json_data = json.loads(data)
                sensor_data = SensorData.from_json(json_data)

                print(f"{datetime.now()} Received data: {sensor_data}")

                return sensor_data
            else:
                print(f"{datetime.now()} No data available yet. Will retry in {read_backoff_in_seconds} seconds...")
                time.sleep(read_backoff_in_seconds)

        print("Error: No data received after 3 attempts")

    except json.JSONDecodeError:
        print("Error: Invalid JSON data received")
    except serial.SerialException:
        print("Error: Unable to read from serial port")
    finally:
        serial_connection.close()


def main(serial_port='ttyACM0'):
    # Read the data every 15 minutes
    schedule.every(15).minutes.do(read_serial_data, serial_port)

    print(f"Starting serial data reader on port /dev/{serial_port}. Press Ctrl+C to exit.")

    try:
        read_serial_data(serial_port)
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nExiting program.")


if __name__ == "__main__":
    main()
