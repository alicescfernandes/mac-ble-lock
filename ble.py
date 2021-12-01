import asyncio
from bleak import BleakScanner, BleakClient, BleakError
import time
import numpy as np


def current_milli_time():
    return round(time.time() * 1000)

# TODO: Unique device names
def scan_devices():
    device_uuids = []
    device_names = []

    def detection_callback(d, advertisement_data):
        # print(device.address, "RSSI:", device.rssi, advertisement_data)
        device_uuids.append(d.address) if d.address not in device_uuids else ''
        #device_names.append(d.name) if d.address not in device_names else ''


    async def main():
        devices = await BleakScanner.discover(timeout=30, detection_callback=detection_callback)
        print(devices)
    asyncio.run(main())
    return [device_uuids,device_names]

def scan_devices_loop(onTick, onTickError,onExit, interval_ms = 10_000):
    print("Scanning for devices, please wait...")
    device_uuids = []
    device_names = []
    time_start = current_milli_time()
    exitLoop = False
    
    def detection_callback(d, advertisement_data):
        # print(device.address, "RSSI:", device.rssi, advertisement_data)
        device_uuids.append(d.address) if d.address not in device_uuids else ''
        #device_names.append(d.name) if d.address not in device_names else ''

    async def main():
        devices = await BleakScanner.discover(timeout=5, detection_callback=detection_callback)
        print(devices)
    while exitLoop == False:
        time_current = current_milli_time()
        delta = time_current - time_start
        if(delta > interval_ms):
            try:
                asyncio.run(main())
                exitLoop = onTick(device_uuids)
                if(exitLoop is True):
                    return onExit()
                device_uuids = []
            except BleakError as err:
                onTickError(err)        
    asyncio.run(main())

# TODO: numpy.setdiff1d
def scan_new_devices():
    print("Turn off the bluetooth of your device")
    time.sleep(30)
    [device_uuids_first,_] = scan_devices()
    print(  device_uuids_first)

    print("Turn on the bluetooth of your device. Disconnect all other the devices from you device")
    time.sleep(30)
    print("Scanning")
    [device_uuids_second,names] = scan_devices()
    print( device_uuids_second)

def use_device(uuid, onTick, onTickError,  interval_ms = 250):
    time_start = current_milli_time()
    async def main():
        async with BleakClient(uuid) as client:
            while True:
                time_current = current_milli_time()
                delta = time_current - time_start

                if(delta > interval_ms):
                    rssi = await client.get_rssi()
                    onTick(rssi)
    try:
        asyncio.run(main())
    except BleakError as err:
        onTickError(err)        


