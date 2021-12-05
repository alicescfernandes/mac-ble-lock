const noble = require('@abandonware/noble');

noble.on('stateChange', async (state) => {
	if (state === 'poweredOn') {
		console.log(1);
		noble.startScanning([], false);
	}
});

noble.on('discover', async (peripheral) => {
	if (peripheral.advertisement.localName == 'Mi 9T Pro') {
		await noble.stopScanningAsync();
		await peripheral.connectAsync();
		const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['1805'], ['2a2b']);
		const batteryLevel = await characteristics[0].readAsync();
		const buf = await characteristics[0].readAsync();
		const arrayBuffer = buf.buffer;

		//Get the year
		var [year] = new Uint16Array(arrayBuffer.slice(0, 2));
		var [month, day, hour, minute, second] = new Uint8Array(arrayBuffer.slice(2));
		console.log(new Date(year, month - 1, day, hour, minute, second)); // 31

		await peripheral.disconnectAsync();
		process.exit(0);
	}
});
