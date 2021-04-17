import RPi.GPIO as io

water_sensor = 18
io.setmode(io.BCM)
io.setup(water_sensor, io.IN)

print(io.input(water_sensor))
