import adafruit_bme280
import adafruit_veml7700
import adafruit_veml6075
import board
import digitalio
import busio
import time

i2c = busio.I2C(board.SCL, board.SDA)

bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)
veml = adafruit_veml6075.VEML6075(i2c, address=10, integration_time=100)
veml7700 = adafruit_veml7700.VEML7700(i2c, address=10)

bme280.sea_level_pressure = 1013.25

while True:
    print("\nTemperature: %0.1f C" % bme280.temperature)
    print("Humidity: %0.1f %%" % bme280.relative_humidity)
    print("Pressure: %0.1f hPa" % bme280.pressure)
    print("UV Index:", round(veml.uv_index, 1))
    print("Ambient light:", veml7700.lux, " Lux")
    time.sleep(2)
