import assert from 'node:assert/strict'
import test from 'node:test'
// eslint-disable-next-line n/no-unpublished-import
import { UpgradeScripts } from '../dist/upgrades.js'

const upgradeActions = (actions) =>
	UpgradeScripts[1]({ currentConfig: {} }, { config: null, secrets: null, actions, feedbacks: [] }).updatedActions

test('converts v1.0.2 text choices to numbers on legacy actions', () => {
	const updated = upgradeActions([
		{ id: 'a', controlId: 'c', actionId: 'Background LIVE', options: { input: { isExpression: false, value: '14' } } },
		{ id: 'b', controlId: 'c', actionId: 'LOGO 1', options: { frame: { isExpression: false, value: '3' } } },
		{ id: 'c', controlId: 'c', actionId: 'ps', options: { preset: { isExpression: false, value: '10' } } },
	])
	assert.deepEqual(
		updated.map((action) => [action.id, action.options]),
		[
			['a', { input: { isExpression: false, value: 14 } }],
			['b', { frame: { isExpression: false, value: 3 } }],
			['c', { preset: { isExpression: false, value: 10 } }],
		],
	)
})

test('leaves expressions, numeric values and other actions untouched', () => {
	const updated = upgradeActions([
		{ id: 'a', controlId: 'c', actionId: 'ps', options: { preset: { isExpression: true, value: '$(local:x)' } } },
		{ id: 'b', controlId: 'c', actionId: 'PIP 2', options: { input: { isExpression: false, value: 5 } } },
		{ id: 'c', controlId: 'c', actionId: 'custom_command', options: { command: { isExpression: false, value: '1' } } },
	])
	assert.deepEqual(updated, [])
})
