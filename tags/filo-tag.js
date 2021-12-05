class FiloTag {
	localName = 'FILO-TAG';
	writeInterval = 250;
	peripheral = null;
	rssi = 0;
	constructor(peripheral) {
		// const { services, characteristics } = await peripheral.discoverAllServicesAndCharacteristicsAsync([]);
		// this.characteristics = characteristics;
		const self = this;
		this.peripheral = peripheral;
		/*peripheral.discoverAllServicesAndCharacteristicsAsync([]).then(({ services, characteristics }) => {
			self.characteristics = characteristics;
		});*/
	}

	async onConnect() {
		const { services, characteristics } = await this.peripheral.discoverAllServicesAndCharacteristicsAsync([]);
		let characteristic = characteristics.find((c) => c.uuid == '5a7b2e1157d94b0b83b8855402e69494');

		// This mantains the connection to the tag
		let read = await characteristic.readAsync();
		read = await characteristic.writeAsync(Buffer.from('F9P2', 'utf-8'), true);

		/*
        setInterval(async () => {
			read = await characteristic.readAsync();
			res = await characteristic.writeAsync(Buffer.from('F9P2', 'utf-8'), true);
		}, this.writeInterval);
        */
	}

	async sendAlert() {
		const { services, characteristics } = await this.peripheral.discoverAllServicesAndCharacteristicsAsync([]);

		let characteristic = characteristics.find((c) => c.uuid == '2a06');
		await characteristic.writeAsync(Buffer.from([0x02]), false);
	}
}

module.exports = { FiloTag };
