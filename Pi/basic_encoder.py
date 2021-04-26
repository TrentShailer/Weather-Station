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


while True:
    position = 0
    for i in range(0, 10000):
        if prev_A != io.input(a_phase):
            A()
        if prev_B != io.input(b_phase):
            B()

        time.sleep(0.1 / 1000)

    print("Position Change:", round(position * 0.3, 0), "per second")
