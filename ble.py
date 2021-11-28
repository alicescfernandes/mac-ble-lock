import asyncio
from bleak import BleakScanner, BleakClient
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
        devices = await BleakScanner.discover(detection_callback=detection_callback)
        #for d in devices:
        #    device_uuids.append(d.address)
        #    device_names.append(d.name)

    asyncio.run(main())
    print(device_names)
    return [device_uuids,device_names]
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

def use_device(uuid, onCall, onError,  interval_ms = 250):
    time_start = current_milli_time()
    async def main():
        async with BleakClient(uuid) as client:
            while True:

                time_current = current_milli_time()
                delta = time_current - time_start

                if(delta > loop_duration):
                    onCall()

    asyncio.run(main(address))

