import RPi.GPIO as io
import time

a_phase = 20
b_phase = 21
io.setmode(io.BCM)
io.setup(a_phase, io.IN)
io.setup(b_phase, io.IN)

state_A = 0
state_B = 0

position = 0


def A():
    if state_A == state_B:
        position += 1
    state_A = io.input(a_phase)


def B():
    if state_A == state_B:
        position -= 1
    state_B = io.input(b_phase)


while True:
    if state_A != io.input(a_phase):
        A()
    if state_B != io.input(b_phase):
        B()

    print("Position:", position)
    print("Angle:", position * 0.3)
    time.sleep_ms(20)
