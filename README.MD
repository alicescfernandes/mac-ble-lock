# Lock your Macbook with a BLE enabled device
This uses the measured RSSI between two BLE devices to check if there is a good connection or not. If there is a bad connection, then the device is either distant or there are objects blocking the signal. This is not an exact science, so a median is used to get an aproximate value of the current RSSI. A better way would be using Kalman filters though

## Requirements
- A Macbook with bluethooth version >= 4.0
- A device with bluetooth >= 4.0, this can be smartwatches, smartphones or any other device. 
  Please note that this will connect to the device, leaving the bluetooth of that device inacessible to other devices. Use a device just for this
  

## How does this work?
A BLE beacon will advertise itself on an interval basis, or set number of times. For instance, Filo Tag advertises itself once every one or two seconds, other beacons will have diferent interval times. When they do, the beacon transmits the UUID and the TX Power on which RSSI is calculated. RSSI is a value in db that tells how good of a connection the beacon has relative to the laptop. Good connection means the beacon is nearby, bad connection means the beacon is not nearby. This code reads that RSSI and locks the device if the RSSI is lower than a threshold. 

__Please note that it's the beacons that decide when they advertise, and the program only reacts to the advertisments. If a beacon only does every second or slower, then the program will take that amount of time to react to the RSSI__

## Hardware
This program was tested with:
- Xiaomi Mi 9T Pro (must be advertising on BLE)
- Fitbit versa
- Filo Tag (https://www.filotrack.com/)
- This should work with other bluetooth tracking devices on the market, as long as they have bluetooth >= 4.0

Other interesting hardware are programable beacons that allow you to set custom advertising intervals
- FeasyBeacon
- RadBeacon

### How to enable BLE mode on smartphones
- Android (https://source.android.com/devices/bluetooth/ble#location-scanning)

## Software
If you want to test the code without a hardware BLE beacon, it's possible to have a peripheral running on Android and iOS devices.
Note: Android rotates the address of the BLE, so use the name to connect to it
#### Android
- https://play.google.com/store/apps/details?id=com.siliconlabs.bledemo
- https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp

#### iOS
- https://itunes.apple.com/us/app/silicon-labs-blue-gecko-wstk/id1030932759?mt=8
- https://itunes.apple.com/us/app/nrf-connect/id1054362403?ls=1&mt=8

## Other indoor tracking technologies
- NFC technology
- Real-time locating systems such as Decawave DWM1000
- A Zigbee mesh to track location (https://www.ijrte.org/wp-content/uploads/papers/v7i6/F2870037619.pdf)

## How to run

### Calibrate
First you have to calibrate the values. Stand close to the mac with the tag for 1 to 2 minutes, then step away a couple meters and stay in that position for a 1 to 2 minutes. This wil give you the threshold that the mac will use to lock the device

### Use
After 