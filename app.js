const { program } = require('commander');
const { scan_devices, calibrate, run } = require('./ble');
program.version('0.0.1');

program
	.option('-c, --calibrate [uuid]', 'calibrate the ble rssi values', 'first_time')
	.option('-s, --start <uuid>', 'start scanning')
	.option('-r, --rssi <int> ', 'Set the rssi threshold', -70);

program.parse(process.argv);

const options = program.opts();

(async () => {
	if (options.start) {
		if (Math.abs(options.rssi) < 50) {
			console.log('Invalid rssi, must be lower than -50');
			process.exit();
		}

		await run(options.start, options.rssi);
	} else if (options.calibrate) {
		if (options.calibrate == 'first_time') {
			console.log('scan all devices and print it');
			scan_devices();
		} else {
			console.log('Calibrating for device ', options.calibrate);

			calibrate(options.calibrate);
		}
	}
})();
