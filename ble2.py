import asyncio
from bleak import BleakScanner, BleakClient
import time
import numpy as np
from ctypes import CDLL
import sys
import Quartz

stack = np.array([])
stack_size = 5
threshold = -65
loginPF = CDLL('/System/Library/PrivateFrameworks/login.framework/Versions/Current/login')
loop_duration = 250 # in millis

address="1468CCA5-5ECA-4E55-AD5E-EA75B6BEFB4F"
def current_milli_time():
    return round(time.time() * 1000)


time_start = current_milli_time()

def is_screen_locked():
    d=Quartz.CGSessionCopyCurrentDictionary()
    return 'CGSSessionScreenIsLocked' in d.keys()

async def main_1(address):
    global time_start
    global stack
    global loop_duration
    async with BleakClient(address) as client:

        rssi = await client.get_rssi()
        while True:

            time_current = current_milli_time()
            delta = time_current - time_start

            if(delta > loop_duration):
                time_start = current_milli_time()
                if(not is_screen_locked()):
                    rssi = await client.get_rssi()

                    if(len(stack) >= stack_size ):
                        stack = stack[1:stack_size ]
                    stack = np.append(stack,rssi)
                    median_value = np.median(stack)
                    print(median_value)
                    if(abs(median_value) >= abs(threshold) ):
                        print(median_value)
                        stack = np.array([])
                        result = loginPF.SACLockScreenImmediate()

asyncio.run(main_1())


# Mi Phone -> 77F46236-E696-43F9-84B7-BC194A042D28
