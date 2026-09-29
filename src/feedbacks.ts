import type ModuleInstance from './main.js'
import {
	INPUT_INDEX_CHOICES,
	LAYER_CHOICES,
	LAYER_SOURCE_CHOICES,
	MODE_CHOICES,
	OUTPUT_CHOICES,
	PRESET_CHOICES,
} from './choices.js'
import { stateKey } from './protocol.js'

export type FeedbacksSchema = {
	source_tally: { type: 'boolean'; options: { preset: number; layer: number; source: number } }
	input_signal: { type: 'boolean'; options: { input: number } }
	input_frozen: { type: 'boolean'; options: { input: number } }
	output_black: { type: 'boolean'; options: { output: number } }
	audio_mute: { type: 'boolean'; options: { output: number } }
	operating_mode: { type: 'boolean'; options: { mode: number } }
	take_available: { type: 'boolean'; options: Record<string, never> }
	frame_stored: { type: 'boolean'; options: { frame: number } }
	logo_stored: { type: 'boolean'; options: { logo: number } }
	parameter_equals: { type: 'boolean'; options: { code: string; indexes: string; value: number } }
}

const activeStyle = { bgcolor: 0x00cc44, color: 0xffffff }

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		source_tally: {
			name: 'Source selected on layer',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [
				{ id: 'preset', type: 'dropdown', label: 'Preset', default: 0, choices: PRESET_CHOICES },
				{ id: 'layer', type: 'dropdown', label: 'Layer', default: 2, choices: LAYER_CHOICES },
				{ id: 'source', type: 'dropdown', label: 'Source / frame / logo', default: 1, choices: LAYER_SOURCE_CHOICES },
			],
			callback: (feedback) =>
				Number(self.state.get(stateKey('IN', [feedback.options.preset, feedback.options.layer]))) ===
				feedback.options.source,
		},
		input_signal: {
			name: 'Input signal detected',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [{ id: 'input', type: 'dropdown', label: 'Input', default: 0, choices: INPUT_INDEX_CHOICES }],
			callback: (feedback) => Number(self.state.get(stateKey('sF', [feedback.options.input])) ?? 0) > 2,
		},
		input_frozen: {
			name: 'Input is frozen',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x0066cc, color: 0xffffff },
			options: [{ id: 'input', type: 'dropdown', label: 'Input', default: 0, choices: INPUT_INDEX_CHOICES }],
			callback: (feedback) => Number(self.state.get(stateKey('Sf', [feedback.options.input]))) === 1,
		},
		output_black: {
			name: 'Output is black',
			type: 'boolean',
			defaultStyle: { bgcolor: 0xcc0000, color: 0xffffff },
			options: [{ id: 'output', type: 'dropdown', label: 'Output', default: 0, choices: OUTPUT_CHOICES }],
			callback: (feedback) => Number(self.state.get(stateKey('OB', [feedback.options.output]))) === 1,
		},
		audio_mute: {
			name: 'Audio output is muted',
			type: 'boolean',
			defaultStyle: { bgcolor: 0xcc0000, color: 0xffffff },
			options: [{ id: 'output', type: 'dropdown', label: 'Output', default: 0, choices: OUTPUT_CHOICES.slice(0, 2) }],
			callback: (feedback) => Number(self.state.get(stateKey('Au', [feedback.options.output]))) === 1,
		},
		operating_mode: {
			name: 'Operating mode',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [{ id: 'mode', type: 'dropdown', label: 'Mode', default: 0, choices: MODE_CHOICES }],
			callback: (feedback) => Number(self.getState('CM')) === feedback.options.mode,
		},
		take_available: {
			name: 'TAKE is available',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [],
			callback: () => Number(self.getState('TA')) === 1,
		},
		frame_stored: {
			name: 'Frame is stored',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [{ id: 'frame', type: 'number', label: 'Frame', default: 1, min: 1, max: 8 }],
			callback: (feedback) => (Number(self.getState('PF')) & (1 << (feedback.options.frame - 1))) !== 0,
		},
		logo_stored: {
			name: 'Logo is stored',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [{ id: 'logo', type: 'number', label: 'Logo', default: 1, min: 1, max: 8 }],
			callback: (feedback) => (Number(self.getState('PZ')) & (1 << (feedback.options.logo - 1))) !== 0,
		},
		parameter_equals: {
			name: 'Protocol parameter equals value',
			type: 'boolean',
			defaultStyle: activeStyle,
			options: [
				{ id: 'code', type: 'textinput', label: 'Response code (case-sensitive)', default: 'CM', useVariables: true },
				{
					id: 'indexes',
					type: 'textinput',
					label: 'Comma-separated indexes (optional)',
					default: '',
					useVariables: true,
				},
				{ id: 'value', type: 'number', label: 'Value', default: 0, min: -2147483648, max: 2147483647 },
			],
			callback: (feedback) => {
				const indexes = self.parseIndexes(feedback.options.indexes)
				return Number(self.state.get(stateKey(feedback.options.code, indexes))) === feedback.options.value
			},
		},
	})
}
