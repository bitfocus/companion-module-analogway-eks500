import type { DropdownChoice } from '@companion-module/base'

export const SOURCE_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'None / Black' },
	{ id: 1, label: 'Input 1' },
	{ id: 2, label: 'Input 2' },
	{ id: 3, label: 'Input 3' },
	{ id: 4, label: 'Input 4' },
	{ id: 5, label: 'Input 5' },
	{ id: 6, label: 'Input 6' },
	{ id: 9, label: 'DVI 1 (Input 9)' },
	{ id: 10, label: 'DVI 2 (Input 10)' },
	{ id: 11, label: 'SDI 1 (Input 11)' },
	{ id: 12, label: 'SDI 2 (Input 12)' },
	{ id: 13, label: 'SDI 3 (Input 13)' },
	{ id: 14, label: 'SDI 4 (Input 14)' },
]

export const LAYER_SOURCE_CHOICES: DropdownChoice[] = [
	...SOURCE_CHOICES.slice(0, 7),
	{ id: 7, label: 'Frame / Logo 7' },
	{ id: 8, label: 'Frame / Logo 8' },
	...SOURCE_CHOICES.slice(7),
]

export const INPUT_INDEX_CHOICES: DropdownChoice[] = SOURCE_CHOICES.filter((choice) => choice.id !== 0).map(
	(choice) => ({
		id: Number(choice.id) - 1,
		label: choice.label,
	}),
)

export const PRESET_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'Current (Program)' },
	{ id: 1, label: 'Next (Preview)' },
	{ id: 2, label: 'Previous' },
	...Array.from({ length: 8 }, (_, index) => ({ id: index + 3, label: `Memory ${index + 1}` })),
]

export const MEMORY_CHOICES: DropdownChoice[] = Array.from({ length: 8 }, (_, index) => ({
	id: index + 3,
	label: `Memory ${index + 1}`,
}))

export const LAYER_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'Background frame — Output 1' },
	{ id: 1, label: 'Background frame — Output 2 (Matrix)' },
	{ id: 2, label: 'Background live — Output 1' },
	{ id: 3, label: 'PIP 1 / Background live — Output 2 (Matrix)' },
	{ id: 4, label: 'PIP 2 — Output 1' },
	{ id: 5, label: 'PIP 3 / PIP 1 — Output 2 (Matrix)' },
	{ id: 6, label: 'Logo 1' },
	{ id: 7, label: 'Logo 2' },
	{ id: 8, label: 'Audio — Output 1' },
	{ id: 9, label: 'Audio — Output 2' },
]

export const OUTPUT_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'Main output' },
	{ id: 1, label: 'Preview / Output 2' },
	{ id: 2, label: 'Recording output' },
]

export const COPY_SCOPE_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'Full preset' },
	{ id: 1, label: 'Output 1 only' },
	{ id: 2, label: 'Output 2 only' },
]

export const MODE_CHOICES: DropdownChoice[] = [
	{ id: 0, label: 'Mixer / seamless switcher' },
	{ id: 1, label: 'Matrix' },
	{ id: 2, label: 'Quadravision' },
]

export const LAYER_PARAMETER_CHOICES: DropdownChoice[] = [
	{ id: 'IN', label: 'Displayed input / frame / logo' },
	{ id: 'IS', label: 'Orchestra source number' },
	{ id: 'Aa', label: 'Auxiliary audio mixing enable' },
	{ id: 'ps', label: 'Smooth Move enable' },
	{ id: 'pf', label: 'Source flip' },
	{ id: 'pN', label: 'New unique layer ID' },
	{ id: 'pH', label: 'Horizontal position' },
	{ id: 'pV', label: 'Vertical position' },
	{ id: 'pW', label: 'Width' },
	{ id: 'pS', label: 'Height' },
	{ id: 'CH', label: 'Crop horizontal position' },
	{ id: 'CV', label: 'Crop vertical position' },
	{ id: 'CW', label: 'Horizontal crop amount' },
	{ id: 'CS', label: 'Vertical crop amount' },
	{ id: 'pA', label: 'Layer alpha' },
	{ id: 'bS', label: 'Border style' },
	{ id: 'bC', label: 'Border color' },
	{ id: 'bA', label: 'Border alpha' },
	{ id: 'bH', label: 'Border horizontal size' },
	{ id: 'bV', label: 'Border vertical size' },
	{ id: 'bP', label: 'Border shadow position' },
	{ id: 'oT', label: 'Opening transition type' },
	{ id: 'oW', label: 'Opening transition direction' },
	{ id: 'oD', label: 'Opening transition duration (0.1 s)' },
	{ id: 'cT', label: 'Closing transition type' },
	{ id: 'cW', label: 'Closing transition direction' },
	{ id: 'cD', label: 'Closing transition duration (0.1 s)' },
]

export const INPUT_PARAMETER_CHOICES: DropdownChoice[] = [
	{ id: 'iU', label: 'User format' },
	{ id: 'iK', label: 'Signal type' },
	{ id: 'il', label: 'H sync load' },
	{ id: 'iu', label: 'Input enabled' },
	{ id: 'iS', label: 'SD video standard' },
	{ id: 'iV', label: 'Video stability' },
	{ id: 'iY', label: 'VIS synchronization group' },
	{ id: 'iH', label: 'HDCP support' },
	{ id: 'iC', label: 'DVI cable length' },
	{ id: 'KT', label: 'Keying type' },
	{ id: 'KR', label: 'Key red level' },
	{ id: 'KG', label: 'Key green level' },
	{ id: 'KB', label: 'Key blue level' },
	{ id: 'KH', label: 'Key tolerance' },
	{ id: 'KL', label: 'Key luma low' },
	{ id: 'KM', label: 'Key luma high' },
	{ id: 'KA', label: 'DSK alpha' },
	{ id: 'KI', label: 'Invert key' },
	{ id: 'SH', label: 'Horizontal position' },
	{ id: 'SV', label: 'Vertical position' },
	{ id: 'Sw', label: 'Horizontal size' },
	{ id: 'Sh', label: 'Vertical size' },
	{ id: 'Sg', label: 'Brightness' },
	{ id: 'Sc', label: 'Contrast' },
	{ id: 'Sr', label: 'Color' },
	{ id: 'Su', label: 'Hue' },
	{ id: 'ST', label: 'Total pixels per line' },
	{ id: 'SS', label: 'Phase' },
	{ id: 'Sa', label: 'Auto-center request' },
	{ id: 'sr', label: 'ADC red gain' },
	{ id: 'sg', label: 'ADC green gain' },
	{ id: 'sb', label: 'ADC blue gain' },
	{ id: 'Sn', label: '2:2 pulldown' },
	{ id: 'Sp', label: '3:2 pulldown' },
	{ id: 'SI', label: 'Crop horizontal position' },
	{ id: 'SJ', label: 'Crop vertical position' },
	{ id: 'SK', label: 'Horizontal crop amount' },
	{ id: 'SL', label: 'Vertical crop amount' },
	{ id: 'si', label: 'Input aspect ratio' },
	{ id: 'so', label: 'Output aspect treatment' },
	{ id: 'sO', label: 'Overscan / underscan' },
	{ id: 'SF', label: 'Force 4:3' },
	{ id: 'Ss', label: 'Reset input settings' },
	{ id: 'Sf', label: 'Freeze input' },
	{ id: 'Sm', label: 'Motion detection correction' },
]

export const OUTPUT_PARAMETER_CHOICES: DropdownChoice[] = [
	{ id: 'Rf', label: 'Anti-flicker' },
	{ id: 'Rg', label: 'Gamma' },
	{ id: 'Rs', label: 'Sharpness' },
	{ id: 'OF', label: 'Output format' },
	{ id: 'OR', label: 'Output rate' },
	{ id: 'OA', label: 'Analog signal type' },
	{ id: 'OD', label: 'Digital signal type' },
	{ id: 'OS', label: 'Sync polarity' },
	{ id: 'OC', label: 'Background preset color' },
	{ id: 'OG', label: 'Background hue' },
	{ id: 'OJ', label: 'Background saturation' },
	{ id: 'OI', label: 'Background brightness' },
	{ id: 'OP', label: 'Test pattern' },
	{ id: 'OB', label: 'Black output' },
	{ id: 'OO', label: 'Overscan / underscan' },
	{ id: 'Oh', label: 'HDCP detection' },
	{ id: 'Xr', label: 'Framelock source' },
	{ id: 'Xm', label: 'Framelock mode' },
]

export const AUDIO_PARAMETER_CHOICES: DropdownChoice[] = [
	{ id: 'Af', label: 'Input mode (free / follow)' },
	{ id: 'Ai', label: 'Input map' },
	{ id: 'AL', label: 'Input level' },
	{ id: 'Al', label: 'Aux input level' },
	{ id: 'Ab', label: 'Input balance' },
	{ id: 'AB', label: 'Aux input balance' },
	{ id: 'Au', label: 'Output mute' },
	{ id: 'AV', label: 'Master volume' },
	{ id: 'Am', label: 'Mono / stereo' },
	{ id: 'AD', label: 'Audio delay' },
	{ id: 'Ae', label: 'Automatic delay' },
	{ id: 'Ac', label: 'SDI left channel' },
	{ id: 'AC', label: 'SDI right channel' },
]

export const SYSTEM_PARAMETER_CHOICES: DropdownChoice[] = [
	{ id: 'YK', label: 'Front panel lock' },
	{ id: 'YB', label: 'LCD brightness' },
	{ id: 'Yb', label: 'Key brightness' },
	{ id: 'YD', label: 'T-bar enable' },
	{ id: 'CR', label: 'Matrix preset management' },
	{ id: 'CM', label: 'Operating mode' },
	{ id: 'Cm', label: 'Matrix mirror mode' },
	{ id: 'yA', label: 'Orchestra control' },
	{ id: 'YL', label: 'Forbid signal-less inputs' },
	{ id: 'YT', label: 'Auto-take' },
	{ id: 'Ys', label: 'Auto-stepback' },
	{ id: 'Ym', label: 'Freeze mode' },
	{ id: 'Yf', label: 'Backup input' },
	{ id: 'Yt', label: 'Transparent background' },
	{ id: 'bF', label: 'PIP black fill' },
	{ id: 'bI', label: 'Disable preview IDs' },
	{ id: 'wQ', label: 'Standby (1) / wake (0)' },
	{ id: 'NC', label: 'Previewed layer' },
	{ id: 'NM', label: 'Mosaic preview' },
	{ id: 'NA', label: 'Refresh mosaic' },
	{ id: 'NQ', label: 'Quadravision layout' },
]

export const inputNumberToIndex = (source: number): number => source - 1

export const sourceLabel = (source: number): string =>
	String(SOURCE_CHOICES.find((choice) => Number(choice.id) === source)?.label ?? `Source ${source}`)
