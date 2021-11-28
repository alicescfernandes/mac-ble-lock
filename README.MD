# Lock your Macbook with a BLE enabled device
This uses the measured RSSI between two BLE devices to check if there is a good connection or not. If there is a bad connection, then the device is either distant or there are objects blocking the signal. This is not an exact science, so a median is used to get an aproximate value of the current RSSI. A better way would be using Kalman filters though

## Requirements
- A Macbook with bluethooth version >= 4.0
- A device with bluetooth >= 4.0, this can be smartwatches, smartphones or any other device. 
  Please note that this will connect to the device, leaving the bluetooth of that device inacessible to other devices. Use a device just for this
  
# How to enable BLE mode on smartphones
- Android (https://source.android.com/devices/bluetooth/ble#location-scanning)

## Hardware
This program was tested with:
- Xiaomi Mi 9T Pro
- Fitbit versa
- Filo Tag (https://www.filotrack.com/)
- This should work with other bluetooth tracking devices on the market, as long as they have bluetooth >= 4.0


## Other indoor tracking technologies
- NFC technology
- Real-time locating systems such as Decawave DWM1000
- A Zigbee mesh to track location (https://www.ijrte.org/wp-content/uploads/papers/v7i6/F2870037619.pdf)

## How to run

