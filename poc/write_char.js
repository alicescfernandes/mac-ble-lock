const noble = require('@abandonware/noble');

noble.on('stateChange', async (state) => {
	if (state === 'poweredOn') {
		noble.startScanning([], false);
	}
});

noble.on('discover', async (peripheral) => {
	console.log(peripheral.advertisement.localName);
	if (peripheral.advertisement.localName == 'FILO-TAG') {
		await noble.stopScanningAsync();
		await peripheral.connectAsync();
		console.log('connected');
		const { services, characteristics } = await peripheral.discoverAllServicesAndCharacteristicsAsync([]);

		let characteristic = characteristics.find((c) => c.uuid == '5a7b2e1157d94b0b83b8855402e69494');
		console.log('send', Buffer.from('F9P2', 'utf-8'));

		characteristic0 = characteristics.find((c) => c.uuid == '2a25');
		read = await characteristic0.readAsync();
		console.log(read);

		characteristic0 = characteristics.find((c) => c.uuid == '2a28');
		read = await characteristic0.readAsync();
		console.log(read);

		//characteristic0 = characteristics.find((c) => c.uuid == '2a06');
		//read = await characteristic0.writeAsync(Buffer.from([02]), true);
		//console.log(read.toString());
		peripheral.updateRssiAsync();

		read = await characteristic.readAsync();
		read = await characteristic.writeAsync(Buffer.from('F9P2', 'utf-8'), true);
		console.log(read);

		console.log('send write async');
		setInterval(async () => {
			peripheral.updateRssi();
		}, 500);

		//await peripheral.disconnectAsync();
		//process.exit(0);

		/*setInterval(async () => {
			read = await characteristic.readAsync();
			console.log(read);
			res = await characteristic.writeAsync(Buffer.from('F9P2', 'utf-8'), true);
			console.log('send write async, loop', res);
			peripheral.updateRssiAsync();
		}, 10_000);*/

		peripheral.on('disconnect', () => {
			console.log('device disconnected');
		});

		peripheral.on('rssiUpdate', function () {
			console.log(3, arguments);
		});
	}
});
