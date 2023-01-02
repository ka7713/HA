const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const definition = {
    fingerprint: [
        {
            modelID: 'TS0601',
            manufacturerName: '_TZE200_shkxsgis',
        },
    ],
    model: 'TB26-4',
    vendor: 'Zemismart',
    description: '4-gang smart wall switch - neutral wire',
	
	exposes: [
		e.switch().withEndpoint('l1').setAccess('state', ea.STATE_SET),
		e.switch().withEndpoint('l2').setAccess('state', ea.STATE_SET),
		e.switch().withEndpoint('l3').setAccess('state', ea.STATE_SET),
		e.switch().withEndpoint('l4').setAccess('state', ea.STATE_SET)
	],
	fromZigbee: [fz.ignore_basic_report, fz.tuya_switch],
	toZigbee: [tz.tuya_switch_state],
	meta: {multiEndpoint: true},
	endpoint: (device) => {
		// Endpoint selection is made in tuya_switch_state
		return {'l1': 1, 'l2': 1, 'l3': 1, 'l4': 1};
	},
	configure: async (device, coordinatorEndpoint, logger) => {
		await tuya.configureMagicPacket(device, coordinatorEndpoint, logger);
		await reporting.bind(device.getEndpoint(1), coordinatorEndpoint, ['genOnOff']);
		if (device.getEndpoint(2)) await reporting.bind(device.getEndpoint(2), coordinatorEndpoint, ['genOnOff']);
		if (device.getEndpoint(3)) await reporting.bind(device.getEndpoint(3), coordinatorEndpoint, ['genOnOff']);
		if (device.getEndpoint(4)) await reporting.bind(device.getEndpoint(4), coordinatorEndpoint, ['genOnOff']);
	},
		
};

module.exports = definition;


