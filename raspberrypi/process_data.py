import json
import time
from datetime import datetime

import schedule
import serial


def read_serial_data(serial_port):
    # Configure the serial connection
    # We open and close it every 15 minutes so that we don't block any other processes from accessing the serial port.
    serial_connection = serial.Serial(f'/dev/{serial_port}', 9600, timeout=1)
    # Set backoff to 5 seconds, because that's the frequency at which the Arduino is emitting data
    read_backoff_in_seconds = 5

    try:
        # Read data from the serial port (with retries)
        for _ in range(3):
            if serial_connection.in_waiting > 0:
                # Read data from the serial port
                data = serial_connection.readline().decode('utf-8').strip()

                # Parse the JSON data
                json_data = json.loads(data)

                # Print the data to console
                print(f"{datetime.now()} Received data: {json_data}")

                serial_connection.close()

                return
            else:
                print(f"{datetime.now()} No data available yet. Will retry in {read_backoff_in_seconds} seconds...")
                time.sleep(read_backoff_in_seconds)

        print("Error: No data received after 3 attempts")

    except json.JSONDecodeError:
        print("Error: Invalid JSON data received")
    except serial.SerialException:
        print("Error: Unable to read from serial port")


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
