import smbus
import time

bus = smbus.SMBus(1)
address = 0x76

def readValue():
	number = bus.read_byte_data(address, 1)
	return number

while True:
	print(readValue())
	time.sleep(0.5)