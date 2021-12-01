const noble = require('@abandonware/noble');

noble.startScanning([]); // any service UUID, allow duplicates
noble.on('warning', (message) => {
	console.log(message);
});
let interval = null;
noble.on('discover', (peripheral) => {
	console.log('discover', peripheral.advertisement.localName);
	if (peripheral.advertisement.localName == 'FILO-TAG') {
		//console.log('tring to connect');
		//console.log(noble);
		//noble.reset();
		peripheral.connect([
			(error) => {
				console.log(error);
			},
		]);
		peripheral.once('disconnect', () => {
			console.log('disonnect');
		});

		peripheral.once('rssiUpdate', (rssi) => {
			console.log(rssi);
		});

		peripheral.once('connect', async (cenas) => {
			console.log('connected', cenas);
			noble.stopScanning();
			const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['180f'], ['2a19']);
			console.log(characteristics);
			const batteryLevel = (await characteristics[0].readAsync())[0];
			console.log(1);

			if (interval != null) {
				clearInterval(interval);
			}
			interval = setInterval(() => {
				peripheral.updateRssi();
				characteristics[0].readAsync();
			}, 250);

			characteristics[0].notify(true);
			characteristics[0].on('data', (data, isNotification) => {
				console.log('cenas');
				console.log(data.readUInt8(0), isNotification);
			});

			console.log(`${peripheral.address} (${peripheral.advertisement.localName}): ${batteryLevel}%`);
		});

		//peripheral.readHandle(handle, callback(error, data));

		/*peripheral.once('servicesDiscover', (services) => {
			services.forEach((service) => {
				if (service.type == 'org.bluetooth.service.battery_service') {
					console.log('bluetooth');
					service.discoverCharacteristics(); // any characteristic UUID
					service.once('characteristicsDiscover', (characteristic) => {
						console.log('characteristicsDiscover');
						characteristic[0].read([
							[
								function (error, data) {
									console.log(error, data);
								},
							],
						]);
						characteristic[0].notify(true);

						characteristic[0].on('data', (data, isNotification) => {
							console.log('cenas');
							console.log(data.readUInt8(0), isNotification);
						});

						characteristic[0].once('read', (data, isNotification) => {
							console.log('read');
							console.log(data.readUInt8(0), isNotification);
						}); // legacy
					});
				}
			});
		});*/
	}
});
