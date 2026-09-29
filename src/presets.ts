import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import { SOURCE_CHOICES } from './choices.js'
import type ModuleInstance from './main.js'
import type { ModuleSchema } from './main.js'

const WHITE = 0xffffff
const GREEN = 0x00a83b
const BLUE = 0x005bbb
const DARK_BLUE = 0x002c5f
const AMBER = 0xd47b00
const PURPLE = 0x65318e
const RED = 0xb00020

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions<ModuleSchema> = {}
	const sourceGroups: { id: string; name: string; layer: number; color: number; presetIds: string[] }[] = [
		{ id: 'background', name: 'Background live (Preview)', layer: 2, color: BLUE, presetIds: [] },
		{ id: 'pip1', name: 'PIP 1 (Preview)', layer: 3, color: DARK_BLUE, presetIds: [] },
		{ id: 'pip2', name: 'PIP 2 (Preview)', layer: 4, color: DARK_BLUE, presetIds: [] },
		{ id: 'pip3', name: 'PIP 3 (Preview)', layer: 5, color: DARK_BLUE, presetIds: [] },
	]

	presets.take = {
		type: 'simple',
		name: 'TAKE',
		style: buttonStyle('TAKE', GREEN, 24),
		steps: [{ down: [{ actionId: 'take', options: {} }], up: [] }],
		feedbacks: [{ feedbackId: 'take_available', options: {}, style: { bgcolor: 0x00dd55, color: WHITE } }],
	}

	for (const group of sourceGroups) {
		for (const source of SOURCE_CHOICES) {
			const id = `${group.id}_source_${source.id}`
			group.presetIds.push(id)
			const sourceId = Number(source.id)
			presets[id] = {
				type: 'simple',
				name: `${group.name}: ${source.label}`,
				style: buttonStyle(sourceId === 0 ? 'BLACK' : shortSourceName(String(source.label)), group.color),
				steps: [
					{
						down: [{ actionId: 'select_source', options: { preset: 1, layer: group.layer, source: sourceId } }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'source_tally',
						options: { preset: 1, layer: group.layer, source: sourceId },
						style: { bgcolor: GREEN, color: WHITE },
					},
				],
			}
		}
	}

	const frameIds: string[] = []
	for (let frame = 0; frame <= 8; frame++) {
		const id = `frame_${frame}`
		frameIds.push(id)
		presets[id] = {
			type: 'simple',
			name: frame === 0 ? 'No background frame' : `Background frame ${frame}`,
			style: buttonStyle(frame === 0 ? 'NO\nFRAME' : `FRAME\n${frame}`, AMBER),
			steps: [{ down: [{ actionId: 'select_source', options: { preset: 1, layer: 0, source: frame } }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'source_tally',
					options: { preset: 1, layer: 0, source: frame },
					style: { bgcolor: GREEN, color: WHITE },
				},
			],
		}
	}

	const logoGroups: { id: string; layer: number; ids: string[] }[] = [
		{ id: 'logo1', layer: 6, ids: [] },
		{ id: 'logo2', layer: 7, ids: [] },
	]
	for (const group of logoGroups) {
		for (let logo = 0; logo <= 8; logo++) {
			const id = `${group.id}_${logo}`
			group.ids.push(id)
			presets[id] = {
				type: 'simple',
				name: `${group.id === 'logo1' ? 'Logo 1 layer' : 'Logo 2 layer'}: ${logo === 0 ? 'Off' : `Logo ${logo}`}`,
				style: buttonStyle(logo === 0 ? 'LOGO\nOFF' : `LOGO\n${logo}`, PURPLE),
				steps: [
					{ down: [{ actionId: 'select_source', options: { preset: 1, layer: group.layer, source: logo } }], up: [] },
				],
				feedbacks: [
					{
						feedbackId: 'source_tally',
						options: { preset: 1, layer: group.layer, source: logo },
						style: { bgcolor: GREEN, color: WHITE },
					},
				],
			}
		}
	}

	const memoryIds: string[] = []
	for (let memory = 1; memory <= 8; memory++) {
		const id = `memory_${memory}`
		memoryIds.push(id)
		presets[id] = {
			type: 'simple',
			name: `Recall memory ${memory} to Preview`,
			style: buttonStyle(`MEMORY\n${memory}`, 0x77702b),
			steps: [{ down: [{ actionId: 'memory_copy', options: { from: memory + 2, to: 1, scope: 0 } }], up: [] }],
			feedbacks: [],
		}
	}

	presets.output_black_on = {
		type: 'simple',
		name: 'Main output black',
		style: buttonStyle('OUTPUT\nBLACK', RED),
		steps: [{ down: [{ actionId: 'output_parameter', options: { output: 0, code: 'OB', value: 1 } }], up: [] }],
		feedbacks: [{ feedbackId: 'output_black', options: { output: 0 }, style: { bgcolor: RED, color: WHITE } }],
	}
	presets.output_black_off = {
		type: 'simple',
		name: 'Main output normal',
		style: buttonStyle('OUTPUT\nON', GREEN),
		steps: [{ down: [{ actionId: 'output_parameter', options: { output: 0, code: 'OB', value: 0 } }], up: [] }],
		feedbacks: [],
	}
	presets.audio_mute = {
		type: 'simple',
		name: 'Mute main audio',
		style: buttonStyle('AUDIO\nMUTE', RED),
		steps: [{ down: [{ actionId: 'audio_parameter', options: { index: 0, code: 'Au', value: 1 } }], up: [] }],
		feedbacks: [{ feedbackId: 'audio_mute', options: { output: 0 }, style: { bgcolor: RED, color: WHITE } }],
	}
	presets.audio_unmute = {
		type: 'simple',
		name: 'Unmute main audio',
		style: buttonStyle('AUDIO\nON', GREEN),
		steps: [{ down: [{ actionId: 'audio_parameter', options: { index: 0, code: 'Au', value: 0 } }], up: [] }],
		feedbacks: [],
	}

	const structure: CompanionPresetSection<ModuleSchema>[] = [
		{
			id: 'switching',
			name: 'Switching',
			definitions: [{ id: 'take', type: 'simple', name: 'TAKE', presets: ['take'] }],
		},
		{
			id: 'sources',
			name: 'Live sources',
			definitions: sourceGroups.map((group) => ({
				id: group.id,
				type: 'simple' as const,
				name: group.name,
				presets: group.presetIds,
			})),
		},
		{
			id: 'media',
			name: 'Frames and logos',
			definitions: [
				{ id: 'frames', type: 'simple', name: 'Background frames', presets: frameIds },
				...logoGroups.map((group) => ({
					id: group.id,
					type: 'simple' as const,
					name: group.id === 'logo1' ? 'Logo layer 1' : 'Logo layer 2',
					presets: group.ids,
				})),
			],
		},
		{
			id: 'memories',
			name: 'Preset memories',
			definitions: [{ id: 'recall', type: 'simple', name: 'Recall to Preview', presets: memoryIds }],
		},
		{
			id: 'output_audio',
			name: 'Output and audio',
			definitions: [
				{ id: 'output', type: 'simple', name: 'Main output', presets: ['output_black_on', 'output_black_off'] },
				{ id: 'audio', type: 'simple', name: 'Main audio', presets: ['audio_mute', 'audio_unmute'] },
			],
		},
	]

	self.setPresetDefinitions(structure, presets)
}

function buttonStyle(text: string, bgcolor: number, size: number | 'auto' = 'auto') {
	return { text, size, color: WHITE, bgcolor, show_topbar: false }
}

function shortSourceName(label: string): string {
	return label
		.replace(' (Input ', '\n')
		.replace(')', '')
		.replace('Input ', 'IN\n')
		.replace('DVI ', 'DVI\n')
		.replace('SDI ', 'SDI\n')
}
