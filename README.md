# humidity-sensor

## TODO

* Why?
* What?
* How?
  * Arduino with DHT-22 sensor

## Sources

### Reading DHT-22 sensor data with an Arduino

* [DHT-22 sensor setup](https://www.instructables.com/How-to-use-DHT-22-sensor-Arduino-Tutorial/)
* [Arduino sensor libraries](https://www.arduino.cc/reference/en/libraries/category/sensors/)
* [AM2302-Sensor library (the only one with decent documentation)](https://github.com/hasenradball/AM2302-Sensor)

### Sending email alerts with Firebase Functions

* [Trigger Email extension usage](https://invertase.io/blog/send-email-extension)

The email addresses for sending alerts are retrieved from Firestore in a collection named `notification_recipients` in
a document named `email` with an array of email addresses named `recipients`:

```json
{
  "email": {
    "recipients": [
      "test-1@email.com",
      "test-2@email.com"
    ]
  }
}
```
