# testing ASDS9300 module

from apds9930 import APDS9930
import machine
import time

i2c = machine.I2C(scl=machine.Pin(4), sda=machine.Pin(5))

sensor = APDS9930(i2c)  # pass the i2c object into the sensor object

sensor.ALS_Enable()
sensor.getALS()  # ambient light reading
