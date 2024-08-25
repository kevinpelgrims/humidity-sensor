import json
import logging
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path

import firebase_admin
import schedule
import serial
from firebase_admin import credentials, firestore


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Logger(metaclass=Singleton):
    def __init__(self, log_directory: str = "logs", log_file_name: str | None = None):
        if log_file_name is None:
            log_file_name = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

        self.logger = logging.getLogger()

        self.logger.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s')
        logger_file_handler = logging.FileHandler(f"{log_directory}/{log_file_name}.log")
        logger_file_handler.setLevel(logging.DEBUG)
        logger_file_handler.setFormatter(logger_formatter)

        self.logger.addHandler(logger_file_handler)

    def debug(self, message):
        self.logger.debug(message)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)

    def critical(self, message):
        self.logger.critical(message)


@dataclass
class SensorData:
    timestamp: datetime
    temperature: float
    humidity: float

    @classmethod
    def from_json(cls, json_data):
        return cls(
            timestamp=datetime.now(),
            temperature=json_data['temperature'],
            humidity=json_data['humidity']
        )

    def __str__(self):
        return f"Timestamp: {self.timestamp}, Temperature: {self.temperature}°C, Humidity: {self.humidity}%"


def initialize_firebase_database(config_path: str):
    firebase_credentials = credentials.Certificate(config_path)
    firebase_admin.initialize_app(firebase_credentials)
    return firestore.client()


def save_to_firestore(database, sensor_data: SensorData):
    doc_reference = database.collection('sensor_readings').document()
    doc_reference.set(asdict(sensor_data))
    Logger().info(f"Data saved to Firestore: {doc_reference.id} - {sensor_data}")


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
                return SensorData.from_json(json_data)
            else:
                Logger().info(f"No data available yet. Will retry in {read_backoff_in_seconds} seconds...")
                time.sleep(read_backoff_in_seconds)

        Logger().error("Error: No data received after 3 attempts")

    except json.JSONDecodeError:
        Logger().error("Error: Invalid JSON data received")
    except serial.SerialException:
        Logger().error("Error: Unable to read from serial port")
    finally:
        serial_connection.close()


def run_scheduled_task(serial_port: str, database):
    sensor_data = read_serial_data(serial_port)

    if sensor_data:
        save_to_firestore(database, sensor_data)
    else:
        Logger().info("Task failed. Rescheduling to run again in 1 minute.")
        schedule.every(1).minutes.do(retry_scheduled_task, serial_port, database).tag("retry")


def retry_scheduled_task(serial_port: str, database):
    sensor_data = read_serial_data(serial_port)

    if sensor_data:
        Logger().info("Retry successful. Resuming normal schedule.")
        schedule.clear("retry")

        save_to_firestore(database, sensor_data)
    else:
        Logger.info("Retry failed. Will try again in 1 minute.")


def init_logger() -> Logger:
    log_directory = Path("logs")
    log_directory.mkdir(parents=True, exist_ok=True)

    return Logger(log_directory=log_directory.absolute().as_posix())


def main(serial_port: str, firebase_config: str):
    init_logger()

    database = initialize_firebase_database(firebase_config)

    # Read the data every 15 minutes
    schedule.every(15).minutes.do(run_scheduled_task, serial_port, database)

    print(f"Starting serial data reader on port /dev/{serial_port}. Press Ctrl+C to exit.")

    try:
        # Run the scheduled task immediately, so we don't need to wait 15 minutes for the first execution
        schedule.run_all()
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nExiting program.")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_data.py <serial_port> <firebase_config_path>")
        print("Example: python process_data.py ttyACM0 path/to/firebase_config.json")
        sys.exit(1)

    serial_port_parameter = sys.argv[1]
    firebase_config_parameter = sys.argv[2]

    main(serial_port=serial_port_parameter, firebase_config=firebase_config_parameter)
