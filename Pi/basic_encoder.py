import RPi.GPIO as io
import time

a_phase = 20
b_phase = 21
io.setmode(io.BCM)
io.setup(a_phase, io.IN)
io.setup(b_phase, io.IN)

while True:
    a_val = 1
    ticks = 0
    for i in range(0, 100):
        if a_val != io.input(a_phase):
            ticks += 1
        a_val = io.input(a_phase)
        time.sleep(0.01)
    print(ticks, "ticks per second")
