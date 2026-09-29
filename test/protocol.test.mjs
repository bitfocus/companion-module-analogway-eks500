import assert from 'node:assert/strict'
import test from 'node:test'
// eslint-disable-next-line n/no-unpublished-import
import { buildReadCommand, buildWriteCommand, parseResponse, stateKey } from '../dist/protocol.js'

test('builds EKS500 read commands', () => {
	assert.equal(buildReadCommand('TA'), 'TA')
	assert.equal(buildReadCommand('IN', [1, 2]), '1,2,IN')
})

test('builds EKS500 write commands', () => {
	assert.equal(buildWriteCommand('TK', 1), '1TK')
	assert.equal(buildWriteCommand('IN', 12, [1, 2]), '1,2,12IN')
	assert.equal(buildWriteCommand('Nf', 10), '10Nf')
})

test('parses device, scalar, and indexed responses', () => {
	assert.deepEqual(parseResponse('DEV85\r'), { raw: 'DEV85', code: 'DEV', indexes: [], value: 85 })
	assert.deepEqual(parseResponse('CM1'), { raw: 'CM1', code: 'CM', indexes: [], value: 1 })
	assert.deepEqual(parseResponse('IN1,2,12'), { raw: 'IN1,2,12', code: 'IN', indexes: [1, 2], value: 12 })
	assert.deepEqual(parseResponse('*1'), { raw: '*1', code: '*', indexes: [], value: 1 })
})

test('parses protocol errors', () => {
	assert.deepEqual(parseResponse('E10'), { raw: 'E10', code: 'ERROR', indexes: [], value: 10 })
	assert.deepEqual(parseResponse('E11'), { raw: 'E11', code: 'ERROR', indexes: [], value: 11 })
	assert.deepEqual(parseResponse('E12'), { raw: 'E12', code: 'ERROR', indexes: [], value: 12 })
})

test('produces stable state keys', () => {
	assert.equal(stateKey('IN', [1, 2]), 'IN|1,2')
	assert.equal(stateKey('CM'), 'CM|')
})
