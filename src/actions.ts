import type ModuleInstance from './main.js'
import type { CompanionActionDefinition } from '@companion-module/base'
import {
	AUDIO_PARAMETER_CHOICES,
	COPY_SCOPE_CHOICES,
	INPUT_INDEX_CHOICES,
	INPUT_PARAMETER_CHOICES,
	LAYER_CHOICES,
	LAYER_PARAMETER_CHOICES,
	LAYER_SOURCE_CHOICES,
	MEMORY_CHOICES,
	OUTPUT_CHOICES,
	OUTPUT_PARAMETER_CHOICES,
	PRESET_CHOICES,
	SOURCE_CHOICES,
	SYSTEM_PARAMETER_CHOICES,
} from './choices.js'
import { buildReadCommand, buildWriteCommand } from './protocol.js'

export type ActionsSchema = {
	take: { options: Record<string, never> }
	'Background LIVE': { options: { input: number } }
	'PIP 2': { options: { input: number } }
	'PIP 3': { options: { input: number } }
	'Background Frame': { options: { frame: number } }
	'LOGO 1': { options: { frame: number } }
	'LOGO 2': { options: { frame: number } }
	ps: { options: { preset: number } }
	select_source: { options: { preset: number; layer: number; source: number } }
	memory_copy: { options: { from: number; to: number; scope: number } }
	tbar: { options: { value: number } }
	input_freeze: { options: { input: number; freeze: boolean } }
	input_autoset: { options: { input: number } }
	layer_parameter: { options: { preset: number; layer: number; code: string; value: number } }
	input_parameter: { options: { input: number; code: string; value: number } }
	output_parameter: { options: { output: number; code: string; value: number } }
	audio_parameter: { options: { index: number; code: string; value: number } }
	system_parameter: { options: { code: string; value: number } }
	custom_write: { options: { code: string; indexes: string; value: string } }
	custom_read: { options: { code: string; indexes: string } }
	custom_command: { options: { command: string } }
	refresh_status: { options: Record<string, never> }
}

const sourceOption = {
	id: 'input' as const,
	type: 'dropdown' as const,
	label: 'Input',
	default: 0,
	choices: SOURCE_CHOICES,
}
const numericValueOption = {
	id: 'value' as const,
	type: 'number' as const,
	label: 'Value (see EKS500 Programmer’s Guide for the selected parameter)',
	default: 0,
	min: 0,
	max: 65535,
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		take: {
			name: 'TAKE',
			options: [],
			callback: async () => self.sendCommand(buildWriteCommand('TK', 1)),
		},
		'Background LIVE': legacySourceAction(self, 'Background live (legacy)', 2),
		'PIP 2': legacySourceAction(self, 'PIP 2 (legacy)', 3),
		'PIP 3': legacySourceAction(self, 'PIP 3 (legacy)', 4),
		'Background Frame': legacyPictureAction(self, 'Background frame (legacy)', 0),
		'LOGO 1': legacyPictureAction(self, 'Logo 1 (legacy)', 6),
		'LOGO 2': legacyPictureAction(self, 'Logo 2 (legacy)', 7),
		ps: {
			name: 'Recall user preset to Preview (legacy)',
			options: [{ id: 'preset', type: 'dropdown', label: 'Preset', default: 3, choices: MEMORY_CHOICES }],
			callback: async (event) => self.copyPreset(event.options.preset, 1, 0),
		},
		select_source: {
			name: 'Layer: Select source / frame / logo',
			options: [
				{ id: 'preset', type: 'dropdown', label: 'Preset', default: 1, choices: PRESET_CHOICES },
				{ id: 'layer', type: 'dropdown', label: 'Layer', default: 2, choices: LAYER_CHOICES },
				{
					id: 'source',
					type: 'dropdown',
					label: 'Input, frame, or logo number',
					default: 1,
					choices: LAYER_SOURCE_CHOICES,
				},
			],
			callback: async (event) =>
				self.sendCommand(buildWriteCommand('IN', event.options.source, [event.options.preset, event.options.layer])),
		},
		memory_copy: {
			name: 'Preset memory: Recall / store by copying',
			options: [
				{ id: 'from', type: 'dropdown', label: 'Copy from', default: 3, choices: PRESET_CHOICES },
				{ id: 'to', type: 'dropdown', label: 'Copy to', default: 1, choices: PRESET_CHOICES },
				{ id: 'scope', type: 'dropdown', label: 'Scope', default: 0, choices: COPY_SCOPE_CHOICES },
			],
			callback: async (event) => self.copyPreset(event.options.from, event.options.to, event.options.scope),
		},
		tbar: {
			name: 'T-bar: Set position',
			options: [{ id: 'value', type: 'number', label: 'Position (0.01%)', default: 0, min: 0, max: 10000 }],
			callback: async (event) => self.sendCommand(buildWriteCommand('NT', event.options.value)),
		},
		input_freeze: {
			name: 'Input: Set freeze',
			options: [
				{ id: 'input', type: 'dropdown', label: 'Input', default: 0, choices: INPUT_INDEX_CHOICES },
				{ id: 'freeze', type: 'checkbox', label: 'Frozen', default: true },
			],
			callback: async (event) =>
				self.sendCommand(buildWriteCommand('Sf', event.options.freeze ? 1 : 0, [event.options.input])),
		},
		input_autoset: {
			name: 'Input: Auto-set',
			options: [{ id: 'input', type: 'dropdown', label: 'Input', default: 0, choices: INPUT_INDEX_CHOICES }],
			callback: async (event) => self.sendCommand(buildWriteCommand('Ii', 1, [event.options.input])),
		},
		layer_parameter: {
			name: 'Layer: Set documented parameter',
			options: [
				{ id: 'preset', type: 'dropdown', label: 'Preset', default: 1, choices: PRESET_CHOICES },
				{ id: 'layer', type: 'dropdown', label: 'Layer', default: 3, choices: LAYER_CHOICES },
				{ id: 'code', type: 'dropdown', label: 'Parameter', default: 'pH', choices: LAYER_PARAMETER_CHOICES },
				numericValueOption,
			],
			callback: async (event) =>
				self.sendCommand(
					buildWriteCommand(event.options.code, event.options.value, [event.options.preset, event.options.layer]),
				),
		},
		input_parameter: {
			name: 'Input: Set documented parameter',
			options: [
				{ id: 'input', type: 'dropdown', label: 'Input', default: 0, choices: INPUT_INDEX_CHOICES },
				{ id: 'code', type: 'dropdown', label: 'Parameter', default: 'Sg', choices: INPUT_PARAMETER_CHOICES },
				numericValueOption,
			],
			callback: async (event) =>
				self.sendCommand(buildWriteCommand(event.options.code, event.options.value, [event.options.input])),
		},
		output_parameter: {
			name: 'Output: Set documented parameter',
			options: [
				{ id: 'output', type: 'dropdown', label: 'Output', default: 0, choices: OUTPUT_CHOICES },
				{ id: 'code', type: 'dropdown', label: 'Parameter', default: 'OB', choices: OUTPUT_PARAMETER_CHOICES },
				numericValueOption,
			],
			callback: async (event) =>
				self.sendCommand(buildWriteCommand(event.options.code, event.options.value, [event.options.output])),
		},
		audio_parameter: {
			name: 'Audio: Set documented parameter',
			options: [
				{
					id: 'index',
					type: 'number',
					label: 'Index (input or output; use 0 if parameter has no index)',
					default: 0,
					min: 0,
					max: 13,
				},
				{ id: 'code', type: 'dropdown', label: 'Parameter', default: 'Au', choices: AUDIO_PARAMETER_CHOICES },
				numericValueOption,
			],
			callback: async (event) =>
				self.sendCommand(
					buildWriteCommand(
						event.options.code,
						event.options.value,
						self.audioCommandIndexes(event.options.code, event.options.index),
					),
				),
		},
		system_parameter: {
			name: 'System / switching: Set documented parameter',
			options: [
				{ id: 'code', type: 'dropdown', label: 'Parameter', default: 'YT', choices: SYSTEM_PARAMETER_CHOICES },
				numericValueOption,
			],
			callback: async (event) => self.sendCommand(buildWriteCommand(event.options.code, event.options.value)),
		},
		custom_write: {
			name: 'Custom parameter write',
			options: [
				{ id: 'code', type: 'textinput', label: 'Command code (case-sensitive)', default: 'CM', useVariables: true },
				{
					id: 'indexes',
					type: 'textinput',
					label: 'Comma-separated indexes (optional)',
					default: '',
					useVariables: true,
				},
				{ id: 'value', type: 'textinput', label: 'Value', default: '0', useVariables: true },
			],
			callback: async (event) => {
				const indexes = self.parseIndexes(event.options.indexes)
				await self.sendCommand(buildWriteCommand(event.options.code, event.options.value, indexes))
			},
		},
		custom_read: {
			name: 'Custom parameter read',
			options: [
				{ id: 'code', type: 'textinput', label: 'Command code (case-sensitive)', default: 'CM', useVariables: true },
				{
					id: 'indexes',
					type: 'textinput',
					label: 'Comma-separated indexes (optional)',
					default: '',
					useVariables: true,
				},
			],
			callback: async (event) => {
				const indexes = self.parseIndexes(event.options.indexes)
				await self.sendCommand(buildReadCommand(event.options.code, indexes))
			},
		},
		custom_command: {
			name: 'Custom raw command',
			options: [
				{
					id: 'command',
					type: 'textinput',
					label: 'Command (case-sensitive, no terminator required)',
					default: 'TA',
					useVariables: true,
				},
			],
			callback: async (event) => self.sendCommand(event.options.command),
		},
		refresh_status: {
			name: 'Refresh all monitored status',
			options: [],
			callback: async () => self.pollStatus(true),
		},
	})
}

function legacySourceAction(
	self: ModuleInstance,
	name: string,
	layer: number,
): CompanionActionDefinition<{ input: number }> {
	return {
		name,
		options: [sourceOption],
		callback: async (event: { options: { input: number } }) =>
			self.sendCommand(buildWriteCommand('IN', event.options.input, [1, layer])),
	}
}

function legacyPictureAction(
	self: ModuleInstance,
	name: string,
	layer: number,
): CompanionActionDefinition<{ frame: number }> {
	return {
		name,
		options: [{ id: 'frame' as const, type: 'number' as const, label: 'Frame / logo', default: 0, min: 0, max: 8 }],
		callback: async (event: { options: { frame: number } }) =>
			self.sendCommand(buildWriteCommand('IN', event.options.frame, [1, layer])),
	}
}
