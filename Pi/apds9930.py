import board
import busio
import time
import APDS9930

i2c = busio.I2C(board.SCL, board.SDA)

apds = APDS9930.APDS9930(i2c)

while True:
    time.sleep_ms(500)
    print(apds.getALS())
