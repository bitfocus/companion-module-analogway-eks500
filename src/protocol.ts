export type ParsedResponse = {
	raw: string
	code: string
	indexes: number[]
	value: number | string
}

export function buildReadCommand(code: string, indexes: number[] = []): string {
	return `${indexes.length > 0 ? `${indexes.join(',')},` : ''}${code}`
}

export function buildWriteCommand(code: string, value: number | string, indexes: number[] = []): string {
	return `${indexes.length > 0 ? `${indexes.join(',')},` : ''}${value}${code}`
}

export function stateKey(code: string, indexes: number[] = []): string {
	return `${code}|${indexes.join(',')}`
}

export function parseResponse(line: string): ParsedResponse | undefined {
	const raw = line.trim()
	if (!raw) return undefined
	if (/^E1[012]$/.test(raw)) return { raw, code: 'ERROR', indexes: [], value: Number(raw.slice(1)) }

	const match = /^([A-Za-z*#?]{1,4})(.*)$/.exec(raw)
	if (!match) return undefined
	const code = match[1]
	const payload = match[2]
	if (payload === '') return { raw, code, indexes: [], value: '' }

	const values = payload.split(',').map((part) => Number(part))
	if (values.some((value) => !Number.isFinite(value))) return { raw, code, indexes: [], value: payload }
	return { raw, code, indexes: values.slice(0, -1), value: values.at(-1) ?? '' }
}
