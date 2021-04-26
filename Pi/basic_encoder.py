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
    if prev_A == io.input(a_phase):
        position += 1

    prev_A = io.input(a_phase)


def B():
    global prev_B
    if prev_B == io.input(b_phase):
        position += 1

    prev_B = io.input(b_phase)


while True:
    if prev_A != io.input(a_phase):
        A()
    if prev_B != io.input(b_phase):
        B()

    print(position * 0.3)
    time.sleep(0.001)
