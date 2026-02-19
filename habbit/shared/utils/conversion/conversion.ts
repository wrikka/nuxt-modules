export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toLowerCase())
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toUpperCase())
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

export function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
  }
  if (typeof value === 'number') {
    return value !== 0
  }
  return false
}

export function toNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }
  return defaultValue
}

export function toString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return ''
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString('base64')
}

export function fromBase64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8')
}

export function toHex(str: string): string {
  return Buffer.from(str).toString('hex')
}

export function fromHex(hex: string): string {
  return Buffer.from(hex, 'hex').toString('utf-8')
}
