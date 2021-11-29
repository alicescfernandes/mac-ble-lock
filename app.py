import asyncio
import ble
import mac
import numpy as np

stack = np.array([])
stack_size = 5
threshold = -65

address="D7CD04BA-C7DF-4669-B682-693024779AB6"


def on_tick(rssi):
    global stack
    global stack_size
    global threshold
    print(rssi, not mac.is_screen_locked())
    if(not mac.is_screen_locked()):
        if(len(stack) >= stack_size ):
            stack = stack[1:stack_size ]
        stack = np.append(stack,rssi)
        median_value = np.median(stack)
        print(median_value)
        if(abs(median_value) >= abs(threshold) ):
            print(median_value)
            stack = np.array([])
            print("mac.lock_screen()")




def on_tick2(rssi):
    print(rssi)

def on_scan_device(device_uuids):
    return address in device_uuids

def on_found_device():
    ble.use_device(address, on_tick, on_error)

def on_error(err):
    err =  str(err)
    if(err == 'Bluetooth device is turned off'):
        print(err)

    if(err == 'disconnected' or err.find("was not found")):
        ble.scan_devices_loop(on_scan_device, on_error,on_found_device)
    
ble.scan_devices_loop(on_scan_device, on_error,on_found_device)
