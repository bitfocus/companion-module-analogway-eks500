import type {
	CompanionMigrationAction,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
} from '@companion-module/base'
import type { ModuleConfig } from './config.js'

function UpgradeLegacyConfig(
	_context: CompanionUpgradeContext<ModuleConfig>,
	props: CompanionStaticUpgradeProps<ModuleConfig, undefined>,
): CompanionStaticUpgradeResult<ModuleConfig, undefined> {
	const oldConfig = (props.config ?? {}) as unknown as Record<string, unknown>
	if (!('prot' in oldConfig) && 'protocol' in oldConfig && 'port' in oldConfig && 'pollInterval' in oldConfig) {
		return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
	}

	return {
		updatedConfig: {
			host: typeof oldConfig.host === 'string' ? oldConfig.host : '',
			port: Number(oldConfig.port ?? 10500),
			protocol: oldConfig.prot === 'udp' ? 'udp' : 'tcp',
			pollInterval: Number(oldConfig.pollInterval ?? 2000),
		},
		updatedActions: [],
		updatedFeedbacks: [],
	}
}

/** v1.0.2 action ids, and the options that stored numeric choices as text */
const LEGACY_NUMERIC_OPTIONS: Record<string, string[]> = {
	'Background LIVE': ['input'],
	'PIP 2': ['input'],
	'PIP 3': ['input'],
	'Background Frame': ['frame'],
	'LOGO 1': ['frame'],
	'LOGO 2': ['frame'],
	ps: ['preset'],
}

/**
 * v1.0.2 stored dropdown choices as text ('3', '14'); v2 uses numeric dropdowns and number fields.
 * Convert the stored values so they match the new choices.
 */
function UpgradeLegacyNumericOptions(
	_context: CompanionUpgradeContext<ModuleConfig>,
	props: CompanionStaticUpgradeProps<ModuleConfig, undefined>,
): CompanionStaticUpgradeResult<ModuleConfig, undefined> {
	const updatedActions: CompanionMigrationAction[] = []

	for (const action of props.actions) {
		const optionIds = LEGACY_NUMERIC_OPTIONS[action.actionId]
		if (!optionIds) continue

		let changed = false
		for (const optionId of optionIds) {
			const option = action.options[optionId]
			if (!option || option.isExpression || typeof option.value !== 'string') continue
			const value = Number(option.value.trim())
			if (option.value.trim() === '' || !Number.isFinite(value)) continue
			action.options[optionId] = { isExpression: false, value }
			changed = true
		}
		if (changed) updatedActions.push(action)
	}

	return { updatedConfig: null, updatedActions, updatedFeedbacks: [] }
}

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	UpgradeLegacyConfig,
	UpgradeLegacyNumericOptions,
]
