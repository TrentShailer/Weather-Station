import time
import board
import busio
import adafruit_veml6075

i2c = busio.I2C(board.SCL, board.SDA)

veml = adafruit_veml6075.VEML6075(i2c, integration_time=400)

while True:
    print("UV Index:", abs(round(veml.uv_index, 1)))
    time.sleep(2)
