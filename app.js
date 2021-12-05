const { program } = require('commander');
const { scan_devices, calibrate, run, debug, run_active } = require('./ble');
program.version('0.0.1');

program
	.option('--calibrate', 'calibrate the ble rssi values', 'first_time')
	.option('--start', 'start scanning')
	.option('--threshold <int>', 'Set the rssi threshold', -70)
	.option('--debug', 'debug uuid')
	.option('--local-name <name> ', 'debug uuid')
	.option('--uuid <uuid> ', 'debug uuid')
	.option('--active <uuid> ', 'active mode', false);

program.parse(process.argv);

const options = program.opts();

(async () => {
	if (options.start) {
		if (Math.abs(options.threshold) < 50) {
			console.log('Invalid threshold, must be lower than -50');
			process.exit();
		}

		if (options.active) {
			await run_active(options.uuid, options.localName, options.threshold);
		} else {
			await run(options.uuid, options.localName, options.threshold);
		}
	} else if (options.debug) {
		debug(options.debug);
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
