import adafruit_bme280
import adafruit_veml6075
import board
import digitalio
import busio
import time
import requests

i2c = busio.I2C(board.SCL, board.SDA)

bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)
veml6075 = adafruit_veml6075.VEML6075(i2c, integration_time=100)

bme280.sea_level_pressure = 1013.25

while True:
    print("\nTemperature: %0.1f C" % bme280.temperature)
    print("Humidity: %0.1f %%" % bme280.relative_humidity)
    print("Pressure: %0.1f hPa" % bme280.pressure)
    print("UV Index:", round(veml6075.uv_index, 1))

    requests.post("http://192.168.9.101:3002/SaveData",
                  data={'temperature': round(bme280.temperature, 1), 'humidity': round(bme280.humidity, 1), 'pressure': round(bme280.pressure, 1), 'uv': round(veml6075.uv_index, 1), 'rain': 0, 'wind': 0})
    time.sleep(5 * 60)
