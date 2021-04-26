import RPi.GPIO as io
import time

a_phase = 20
b_phase = 21
io.setmode(io.BCM)
io.setup(a_phase, io.IN)
io.setup(b_phase, io.IN)

prev_A = 0
prev_B = 0
position = 0


def A():
    global prev_A
    global position
    if prev_A == prev_B:
        position += 1

    prev_A = io.input(a_phase)


def B():
    global prev_B
    global position
    if prev_B == prev_A:
        position -= 1

    prev_B = io.input(b_phase)


io.add_event_detect(a_phase, io.BOTH, callback=A)
io.add_event_detect(b_phase, io.BOTH, callback=B)

while True:
    print("Position:", round(position * 0.3, 0))
