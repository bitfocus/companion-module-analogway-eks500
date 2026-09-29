import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
	host: string
	port: number
	protocol: 'tcp' | 'udp'
	pollInterval: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Eikos IP address',
			width: 6,
			default: '',
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 3,
			min: 1,
			max: 65535,
			default: 10500,
		},
		{
			type: 'dropdown',
			id: 'protocol',
			label: 'Protocol',
			width: 3,
			default: 'tcp',
			choices: [
				{ id: 'tcp', label: 'TCP (recommended)' },
				{ id: 'udp', label: 'UDP' },
			],
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Feedback polling interval (ms, 0 disables)',
			width: 6,
			min: 0,
			max: 60000,
			default: 2000,
		},
		{
			type: 'static-text',
			id: 'udp_note',
			label: 'UDP feedback',
			width: 6,
			value:
				'For UDP feedback, configure the Eikos Remote Address and Remote Port to point back to this Companion host.',
		},
	]
}
