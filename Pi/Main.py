import adafruit_bme280
import adafruit_veml6075
import board
import digitalio
import busio
import time
import requests
from Secret import secret
import RPi.GPIO as io
import time

water_sensor = 18
io.setmode(io.BCM)
io.setup(water_sensor, io.IN)

i2c = busio.I2C(board.SCL, board.SDA)

bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)
veml6075 = adafruit_veml6075.VEML6075(i2c, integration_time=100)

bme280.sea_level_pressure = 1013.25

while True:
    totalTemp, totalHumidity, totalPressure, totalUV_Index, totalRain = 0
    for i in range(0, 5):
        totalTemp += bme280.temperature
        totalHumidity += bme280.relative_humidity
        totalPressure += bme280.pressure
        totalUV_Index += veml6075.uv_index
        totalRain += 1 - io.input(water_sensor)
        time.sleep(60)

    avgTemp = round(totalTemp / 5, 1)
    avgHumidity = round(totalHumidity / 5, 1)
    avgPressure = round(totalPressure / 5, 1)
    avgUV_Index = round(totalUV_Index / 5, 1)

    requests.post("http://192.168.9.101:3002/SaveData",
                  data={'secret': secret(), 'temperature': avgTemp, 'humidity': avgHumidity, 'pressure': avgPressure, 'uv': avgUV_Index, 'rain': totalRain, 'wind': 0})
