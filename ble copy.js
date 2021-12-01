const noble = require('@abandonware/noble');
const { exec } = require('child_process');
const STACK_SIZE = 3;
const device_data = {};

function lock_device() {
	exec('python3 mac.py lock');
}

let lastTrackTime = Date.now();

function onRSSIUpdate(uuid) {
	let rssi = device_data[uuid].current_rssi;
	let median_rssi = get_median(device_data[uuid].rssi_list);

	if (Math.abs(rssi) > 70) {
		lock_device();
	}

	console.log({
		date: Date(),
		rssi,
		median_rssi,
		uuid,
	});
}

setInterval(() => {
	if (Date.now() - lastTrackTime > 4_000) {
		console.log('lock device');
		lock_device();
	}
}, 2_000);

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
noble.startScanningAsync(['1800', '180a', '1802'], true); // any service UUID, allow duplicates, listens to all advertismenet ids

// Listens to advertisement events
noble.on('discover', (peripheral) => {
	if (peripheral.uuid == '9f9aedf7d29b41e7b291765ec3e53c77') {
		lastTrackTime = Date.now();
		device_data[peripheral.uuid] = device_data[peripheral.uuid] || {
			last_rssi: 0,
			current_rssi: 0,
			rssi_list: [],
		};
		device_data[peripheral.uuid].last_rssi = device_data[peripheral.uuid].current_rssi;
		device_data[peripheral.uuid].current_rssi = peripheral.rssi;
		if (device_data[peripheral.uuid].rssi_list.length >= STACK_SIZE) {
			device_data[peripheral.uuid].rssi_list.pop();
		}

		device_data[peripheral.uuid].rssi_list.push(peripheral.rssi);

		onRSSIUpdate(peripheral.uuid);
	}
});
