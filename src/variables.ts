import type ModuleInstance from './main.js'
import { LAYER_CHOICES, SOURCE_CHOICES, sourceLabel } from './choices.js'
import { stateKey } from './protocol.js'

export type VariablesSchema = Record<string, string | number>

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const definitions: Record<string, { name: string }> = {
		device_type: { name: 'Detected device type' },
		ready: { name: 'Device ready' },
		operating_mode: { name: 'Operating mode' },
		take_available: { name: 'TAKE available' },
		frames_valid: { name: 'Valid frame bitmask' },
		logos_valid: { name: 'Valid logo bitmask' },
		last_response: { name: 'Last protocol response' },
		last_error: { name: 'Last protocol error' },
	}

	for (const preset of [0, 1]) {
		for (const layer of LAYER_CHOICES) {
			definitions[`source_${preset}_${layer.id}`] = {
				name: `${preset === 0 ? 'Current' : 'Next'} source — ${layer.label}`,
			}
		}
	}
	for (const input of SOURCE_CHOICES.filter((choice) => Number(choice.id) > 0)) {
		definitions[`signal_${input.id}`] = { name: `Signal format — ${input.label}` }
		definitions[`frozen_${input.id}`] = { name: `Frozen — ${input.label}` }
	}
	for (const output of [0, 1, 2]) definitions[`output_black_${output}`] = { name: `Output ${output + 1} black` }
	for (const output of [0, 1]) definitions[`audio_mute_${output}`] = { name: `Audio output ${output + 1} mute` }

	self.setVariableDefinitions(definitions)
}

export function UpdateVariableValues(self: ModuleInstance): void {
	const modeNames = ['Mixer', 'Matrix', 'Quadravision']
	const values: Record<string, string | number> = {
		device_type: self.getState('DEV') === 85 ? 'EKS500' : String(self.getState('DEV') ?? 'Unknown'),
		ready: Number(self.getState('*') ?? 0),
		operating_mode: modeNames[Number(self.getState('CM') ?? -1)] ?? 'Unknown',
		take_available: Number(self.getState('TA') ?? 0),
		frames_valid: Number(self.getState('PF') ?? 0),
		logos_valid: Number(self.getState('PZ') ?? 0),
		last_response: self.lastResponse,
		last_error: self.lastError,
	}

	for (const preset of [0, 1]) {
		for (const layer of LAYER_CHOICES) {
			const source = Number(self.state.get(stateKey('IN', [preset, Number(layer.id)])) ?? 0)
			values[`source_${preset}_${layer.id}`] = sourceLabel(source)
		}
	}
	for (const input of SOURCE_CHOICES.filter((choice) => Number(choice.id) > 0)) {
		const index = Number(input.id) - 1
		values[`signal_${input.id}`] = Number(self.state.get(stateKey('sF', [index])) ?? 0)
		values[`frozen_${input.id}`] = Number(self.state.get(stateKey('Sf', [index])) ?? 0)
	}
	for (const output of [0, 1, 2])
		values[`output_black_${output}`] = Number(self.state.get(stateKey('OB', [output])) ?? 0)
	for (const output of [0, 1]) values[`audio_mute_${output}`] = Number(self.state.get(stateKey('Au', [output])) ?? 0)

	self.setVariableValues(values)
}
