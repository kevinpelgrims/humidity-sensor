from datetime import datetime

import serial
import json
import time


def read_serial_data(serial_connection):
    try:
        if serial_connection.in_waiting == 0:
            print(f"{datetime.now()} No data available")
            return

        # Read data from the serial port
        data = serial_connection.readline().decode('utf-8').strip()

        # Parse the JSON data
        json_data = json.loads(data)

        # Print the data to console
        print(f"{datetime.now()} Received data: {json_data}")

    except json.JSONDecodeError:
        print("Error: Invalid JSON data received")
    except serial.SerialException:
        print("Error: Unable to read from serial port")


def main(serial_port='ttyACM0'):
    print("Starting serial data reader. Press Ctrl+C to exit.")

    # Configure the serial connection
    serial_connection = serial.Serial(f'/dev/{serial_port}', 9600, timeout=1)
    serial_connection.flush()

    try:
        while True:
            read_serial_data(serial_connection)
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nExiting program.")
    finally:
        serial_connection.close()


if __name__ == "__main__":
    main()
