import RPi.GPIO as io
import time

a_phase = 20
b_phase = 21
io.setmode(io.BCM)
io.setup(a_phase, io.IN)
io.setup(b_phase, io.IN)

while True:
    print(io.input(a_phase), "", io.input(b_phase))
    time.sleep(0.250)
