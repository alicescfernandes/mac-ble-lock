const noble = require('@abandonware/noble');
const { exec } = require('child_process');
const { Console } = require('console');
const STACK_SIZE = 3;
const device_data = {};

function lock_device() {
	exec('python3 mac.py lock');
}

let lastTrackTime = Date.now();
let totalRetryAttempts = 2;
let currentRetryAttempts = totalRetryAttempts;
let scanTimeout = 4_000;

function onRSSIUpdate(uuid, threshold = -70) {
	if (currentRetryAttempts != totalRetryAttempts) {
		currentRetryAttempts = totalRetryAttempts;
	}
	let rssi = device_data[uuid].current_rssi;
	let median_rssi = get_median(device_data[uuid].rssi_list);

	if (Math.abs(rssi) > Math.abs(threshold)) {
		console.log('Device lock due to rssi threshold, ', rssi);
		lock_device();
	}

	console.log({
		date: Date(),
		rssi,
		median_rssi,
		uuid,
	});
}

function get_median(arr) {
	const array_length = arr.length;
	median = Math.floor(array_length / 2);
	if (array_length % 2 == 0) {
		const next_value = median + 1 > array_length ? median + 1 : median - 1;
		median = (arr[median] + arr[next_value]) / 2;
	} else {
		median = arr[median];
	}
	return median;
}
function validateDevice(peripheral, uuid = false, localName = false) {
	if (uuid != false) {
		return peripheral.uuid == uuid;
	}

	if (localName != false) {
		return peripheral.advertisement.localName == localName;
		process.exit(0);
	}
}
async function run(uuid = false, localName = false, awayRssi) {
	await noble.startScanningAsync([], true); // any service UUID, allow duplicates, listens to all advertismenet ids
	// Listens to advertisement events
	noble.removeAllListeners();

	noble.on('discover', (peripheral) => {
		if (validateDevice(peripheral, uuid, localName)) {
			lastTrackTime = Date.now();
			let isSameEvent = false;

			device_data[peripheral.uuid] = device_data[peripheral.uuid] || {
				last_rssi: 0,
				current_rssi: 0,
				rssi_list: [],
				last_events: [],
			};
			if (device_data[peripheral.uuid].last_events.length >= STACK_SIZE) {
				device_data[peripheral.uuid].last_events.shift();
			}
			device_data[peripheral.uuid].last_events.push({ date: Date.now(), rssi: peripheral.rssi });

			//Detect if is same event
			if (device_data[peripheral.uuid].last_events.length > 1) {
				const last_event = device_data[peripheral.uuid].last_events.length - 1;
				const previous_event = device_data[peripheral.uuid].last_events.length - 2;
				isSameEvent =
					device_data[peripheral.uuid].last_events[last_event].date - device_data[peripheral.uuid].last_events[previous_event].date < 10;
			}

			if (isSameEvent == false) {
				device_data[peripheral.uuid].last_rssi = device_data[peripheral.uuid].current_rssi;
				device_data[peripheral.uuid].current_rssi = peripheral.rssi;
				if (device_data[peripheral.uuid].rssi_list.length >= STACK_SIZE) {
					device_data[peripheral.uuid].rssi_list.shift();
				}

				device_data[peripheral.uuid].rssi_list.push(peripheral.rssi);
				onRSSIUpdate(peripheral.uuid, awayRssi);
			}

			lastTrackTime = Date.now();
		}
	});

	//Handle devices out of reach
	setInterval(() => {
		if (Date.now() - lastTrackTime > scanTimeout) {
			console.log('Device timed out. Retry connection');
			if (!currentRetryAttempts) {
				console.log('Lock device due to timeout. Retry connection');
				lock_device();
				currentRetryAttempts = totalRetryAttempts;
			} else {
				currentRetryAttempts--;
				lastTrackTime = Date.now();
			}
		}
	}, 2_000);
}

function scan_devices() {
	console.log('Scanning during 10 seconds');
	noble.startScanningAsync([], false); // any service UUID, allow duplicates, listens to all advertismenet ids

	// Listens to advertisement events
	noble.on('discover', (peripheral) => {
		console.log(peripheral.advertisement.localName, peripheral.uuid, peripheral.rssi);
	});

	setTimeout(() => {
		console.log('Stop scanning for devices');
		noble.stopScanningAsync();
		process.exit(0);
	}, 10_000);
}

function calibrate(uuid) {
	const start = Date.now();
	console.log('Stand close to the device');
	noble.startScanningAsync([], true); // any service UUID, allow duplicates, listens to all advertismenet ids
	const near_rssi = [];
	const away_rssi = [];
	let mode = 'near';
	// Listens to advertisement events
	noble.on('discover', (peripheral) => {
		if (peripheral.uuid == uuid) {
			if (mode == 'near') {
				near_rssi.push(peripheral.rssi);
			} else if (mode == 'away') {
				away_rssi.push(peripheral.rssi);
			}
		}
	});

	calibrateInterval = setInterval(() => {
		if (Date.now() - start > 30_000 && mode != 'away') {
			console.log('Stand away of the device');
			mode = 'away';
		}

		if (Date.now() - start > 60_000) {
			clearInterval(calibrateInterval);
			console.log('Calibration Done');
			noble.stopScanningAsync();
			console.log('Device UUID: ', uuid);
			console.log('Near RSSI: ', get_median(near_rssi));
			console.log('Away RSSI: ', get_median(away_rssi));
			process.exit(0);
		}
	}, 1_000);
}

function debug(uuid) {
	console.log('Stand close to the device');
	noble.on('stateChange', (state) => {
		if (state === 'poweredOn') {
			noble.startScanning([], true); // any service UUID, allow duplicates, listens to all advertismenet ids
		}
	});
	if (noble.state === 'poweredOn') {
		noble.startScanning([], true); // any service UUID, allow duplicates, listens to all advertismenet ids
	}

	// Listens to advertisement events
	noble.on('discover', (peripheral) => {
		if (peripheral.uuid == uuid) {
			console.log(peripheral.rssi);
		}
	});
}

module.exports = {
	scan_devices,
	calibrate,
	run,
	debug,
};
