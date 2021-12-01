const noble = require('@abandonware/noble');

noble.on('stateChange', async (state) => {
	if (state === 'poweredOn') {
		console.log(1);
		noble.startScanning(['180f'], false);
	}
});

noble.on('discover', async (peripheral) => {
	console.log('a');
	if (peripheral.advertisement.localName == 'FILO-TAG') {
		await noble.stopScanningAsync();
		await peripheral.connectAsync();
		const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['180f'], ['2a19']);
		const batteryLevel = (await characteristics[0].readAsync())[0];

		console.log(`${peripheral.address} (${peripheral.advertisement.localName}): ${batteryLevel}%`);

		await peripheral.disconnectAsync();
		process.exit(0);
	}
});
