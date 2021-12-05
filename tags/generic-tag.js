class GenericTag {
	localName = null;
	writeInterval = 250;
	peripheral = null;
	rssi = 0;
	constructor(peripheral) {
		const self = this;
		this.peripheral = peripheral;
	}

	async onConnect(peripheral) {}

	async sendAlert() {
		const { services, characteristics } = await this.peripheral.discoverAllServicesAndCharacteristicsAsync([]);
		let characteristic = characteristics.find((c) => c.uuid == '2a06');
		await characteristic.writeAsync(Buffer.from([0x02]), false);
	}
}

module.exports = { GenericTag };
