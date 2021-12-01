const noble = require('@abandonware/noble');
const { exec } = require('child_process');

const device_data = {};

function lock_device() {
	exec('python3 mac.py lock');
}

noble.startScanningAsync(['1800', '180a', '1802'], true); // any service UUID, allow duplicates
noble.on('discover', (peripheral) => {
	if (peripheral.uuid == '9f9aedf7d29b41e7b291765ec3e53c77') {
		console.log(peripheral.advertisement);
		console.log(peripheral.rssi);
	}
});
