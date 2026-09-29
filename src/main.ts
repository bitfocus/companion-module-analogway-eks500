import {
	InstanceBase,
	InstanceStatus,
	TCPHelper,
	UDPHelper,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { buildReadCommand, buildWriteCommand, parseResponse, stateKey } from './protocol.js'
import { UpdatePresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateVariableDefinitions, UpdateVariableValues, type VariablesSchema } from './variables.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

const INPUT_INDEXES = [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13]
const MONITORED_LAYERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig
	state = new Map<string, number | string>()
	lastResponse = ''
	lastError = ''

	private tcp?: TCPHelper
	private udp?: UDPHelper
	private receiveBuffer = ''
	private pollTimer?: NodeJS.Timeout
	private pollRunning = false

	async init(config: ModuleConfig): Promise<void> {
		this.config = this.normalizeConfig(config)
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		this.connect()
	}

	async destroy(): Promise<void> {
		this.stopPolling()
		this.closeConnection()
		this.log('debug', 'EKS500 module destroyed')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = this.normalizeConfig(config)
		this.state.clear()
		this.lastError = ''
		this.stopPolling()
		this.closeConnection()
		this.connect()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
		UpdateVariableValues(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	getState(code: string, indexes: number[] = []): number | string | undefined {
		return this.state.get(stateKey(code, indexes))
	}

	parseIndexes(value: string): number[] {
		if (!value.trim()) return []
		return value
			.split(',')
			.map((part) => Number(part.trim()))
			.filter((part) => Number.isFinite(part))
	}

	audioCommandIndexes(code: string, index: number): number[] {
		return ['Af', 'Al', 'AB', 'Ae'].includes(code) ? [] : [index]
	}

	async copyPreset(from: number, to: number, scope: number): Promise<void> {
		await this.sendCommands([
			buildWriteCommand('Nf', from),
			buildWriteCommand('Nt', to),
			buildWriteCommand('Ns', scope),
			buildWriteCommand('Nc', 1),
		])
	}

	async sendCommand(command: string): Promise<void> {
		if (!command) return
		try {
			if (this.config.protocol === 'udp') {
				if (!this.udp) throw new Error('UDP socket is not available')
				await this.udp.sendAsync(command)
				return
			}

			if (!this.tcp?.isConnected) throw new Error('TCP socket is not connected')
			await this.tcp.sendAsync(command)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.lastError = message
			this.log('warn', `Unable to send “${command}”: ${message}`)
			UpdateVariableValues(this)
		}
	}

	async sendCommands(commands: string[]): Promise<void> {
		for (const command of commands) {
			await this.sendCommand(command)
			await new Promise((resolve) => setTimeout(resolve, 12))
		}
	}

	async pollStatus(force = false): Promise<void> {
		if (this.pollRunning && !force) return
		this.pollRunning = true
		try {
			const commands = ['?', '*', 'CM', 'TA', 'PF', 'PZ']
			for (const preset of [0, 1]) {
				for (const layer of MONITORED_LAYERS) commands.push(buildReadCommand('IN', [preset, layer]))
			}
			for (const input of INPUT_INDEXES) {
				commands.push(buildReadCommand('sF', [input]), buildReadCommand('Sf', [input]))
			}
			for (const output of [0, 1, 2]) commands.push(buildReadCommand('OB', [output]))
			for (const output of [0, 1]) commands.push(buildReadCommand('Au', [output]))
			await this.sendCommands(commands)
		} finally {
			this.pollRunning = false
		}
	}

	private normalizeConfig(config: ModuleConfig): ModuleConfig {
		return {
			host: config.host ?? '',
			port: Number(config.port ?? 10500),
			protocol: config.protocol === 'udp' ? 'udp' : 'tcp',
			pollInterval: Math.max(0, Number(config.pollInterval ?? 2000)),
		}
	}

	private connect(): void {
		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'Enter the Eikos IP address')
			return
		}

		this.receiveBuffer = ''
		this.updateStatus(InstanceStatus.Connecting)
		if (this.config.protocol === 'udp') this.connectUdp()
		else this.connectTcp()
	}

	private connectTcp(): void {
		this.tcp = new TCPHelper(this.config.host, this.config.port)
		this.tcp.on('status_change', (status, message) => this.updateStatus(status, message))
		this.tcp.on('error', (error) => {
			this.lastError = error.message
			this.log('error', `TCP error: ${error.message}`)
			UpdateVariableValues(this)
		})
		this.tcp.on('data', (data) => this.processData(data))
		this.tcp.on('connect', () => {
			this.lastError = ''
			this.updateStatus(InstanceStatus.Ok)
			this.startPolling()
			setTimeout(() => void this.pollStatus(true), 50)
		})
	}

	private connectUdp(): void {
		try {
			this.udp = new UDPHelper(this.config.host, this.config.port, { bind_port: this.config.port })
			this.udp.on('status_change', (status, message) => this.updateStatus(status, message))
			this.udp.on('error', (error) => {
				this.lastError = error.message
				this.updateStatus(InstanceStatus.UnknownError, error.message)
				this.log('error', `UDP error: ${error.message}`)
				UpdateVariableValues(this)
			})
			this.udp.on('data', (data) => this.processData(data))
			this.udp.on('listening', () => {
				this.lastError = ''
				this.updateStatus(InstanceStatus.Ok)
				this.startPolling()
				setTimeout(() => void this.pollStatus(true), 50)
			})
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.updateStatus(InstanceStatus.UnknownError, message)
		}
	}

	private processData(data: Buffer): void {
		this.receiveBuffer += data.toString('ascii')
		const lines = this.receiveBuffer.split(/\r?\n/)
		this.receiveBuffer = lines.pop() ?? ''
		let changed = false
		for (const line of lines) {
			const response = parseResponse(line)
			if (!response) continue
			this.lastResponse = response.raw
			if (response.code === 'ERROR') {
				this.lastError = `Protocol error E${response.value}`
				this.log('warn', `${this.lastError}; last response was “${response.raw}”`)
			} else {
				this.state.set(stateKey(response.code, response.indexes), response.value)
			}
			changed = true
		}
		if (changed) {
			UpdateVariableValues(this)
			this.checkFeedbacks(
				'source_tally',
				'input_signal',
				'input_frozen',
				'output_black',
				'audio_mute',
				'operating_mode',
				'take_available',
				'frame_stored',
				'logo_stored',
				'parameter_equals',
			)
		}
	}

	private startPolling(): void {
		this.stopPolling()
		if (this.config.pollInterval > 0) {
			this.pollTimer = setInterval(() => void this.pollStatus(), Math.max(500, this.config.pollInterval))
		}
	}

	private stopPolling(): void {
		if (this.pollTimer) clearInterval(this.pollTimer)
		delete this.pollTimer
	}

	private closeConnection(): void {
		this.tcp?.destroy()
		this.udp?.destroy()
		delete this.tcp
		delete this.udp
	}
}
