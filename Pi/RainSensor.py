import RPi.GPIO as io
import time

water_sensor = 18
io.setmode(io.BCM)
io.setup(water_sensor, io.IN)

while True:
    print(io.input(water_sensor))
    time.sleep(0.5)
