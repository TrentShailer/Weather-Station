from machine import Pin, I2C
import time
import APDS9930

i2c = I2C(sda=Pin(5), scl=Pin(4))

apds = APDS9930.APDS9930(i2c)

while True:
    time.sleep_ms(500)
    print(apds.getALS())
