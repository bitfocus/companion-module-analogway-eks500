import type {
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

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [UpgradeLegacyConfig]
