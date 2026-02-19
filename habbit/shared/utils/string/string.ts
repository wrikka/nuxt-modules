export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowercase(str: string): string {
  return str.toLowerCase()
}

export function uppercase(str: string): string {
  return str.toUpperCase()
}

export function reverse(str: string): string {
  return str.split('').reverse().join('')
}

export function trim(str: string): string {
  return str.trim()
}

export function trimLeft(str: string): string {
  return str.trimLeft()
}

export function trimRight(str: string): string {
  return str.trimRight()
}

export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

export function padStart(str: string, length: number, char: string = ' '): string {
  return str.padStart(length, char)
}

export function padEnd(str: string, length: number, char: string = ' '): string {
  return str.padEnd(length, char)
}

export function repeat(str: string, count: number): string {
  return str.repeat(count)
}

export function contains(str: string, search: string): boolean {
  return str.includes(search)
}

export function startsWith(str: string, search: string): boolean {
  return str.startsWith(search)
}

export function endsWith(str: string, search: string): boolean {
  return str.endsWith(search)
}

export function replace(str: string, search: string, replacement: string): string {
  return str.replace(search, replacement)
}

export function replaceAll(str: string, search: string, replacement: string): string {
  return str.replaceAll(search, replacement)
}

export function split(str: string, separator: string | RegExp): string[] {
  return str.split(separator)
}

export function join(parts: string[], separator: string = ''): string {
  return parts.join(separator)
}

export function slice(str: string, start: number, end?: number): string {
  return str.slice(start, end)
}

export function substring(str: string, start: number, end?: number): string {
  return str.substring(start, end)
}

export function indexOf(str: string, search: string): number {
  return str.indexOf(search)
}

export function lastIndexOf(str: string, search: string): number {
  return str.lastIndexOf(search)
}

export function charAt(str: string, index: number): string {
  return str.charAt(index)
}

export function charCodeAt(str: string, index: number): number {
  return str.charCodeAt(index)
}

export function length(str: string): number {
  return str.length
}

export function isEmpty(str: string): boolean {
  return str.length === 0
}

export function isBlank(str: string): boolean {
  return str.trim().length === 0
}

export function words(str: string): string[] {
  return str.trim().split(/\s+/).filter(Boolean)
}

export function wordCount(str: string): number {
  return words(str).length
}

export function lines(str: string): string[] {
  return str.split(/\r?\n/)
}

export function lineCount(str: string): number {
  return lines(str).length
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function camelize(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toLowerCase())
}

export function dasherize(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function underscore(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

export function humanize(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ' '))
    .replace(/^(.)/, c => c.toUpperCase())
    .trim()
}

export function titleize(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, match => match.toUpperCase())
}

export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]!)
}

export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }
  return str.replace(/&(amp|lt|gt|quot|#39);/g, match => htmlUnescapes[match]!)
}

export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

export function stripHtml(str: string): string {
  return stripTags(str).replace(/&nbsp;/g, ' ')
}

export function countOccurrences(str: string, search: string): number {
  return str.split(search).length - 1
}

export function remove(str: string, search: string): string {
  return replaceAll(str, search, '')
}

export function removePrefix(str: string, prefix: string): string {
  return startsWith(str, prefix) ? str.slice(prefix.length) : str
}

export function removeSuffix(str: string, suffix: string): string {
  return endsWith(str, suffix) ? str.slice(0, -suffix.length) : str
}

export function ensurePrefix(str: string, prefix: string): string {
  return startsWith(str, prefix) ? str : prefix + str
}

export function ensureSuffix(str: string, suffix: string): string {
  return endsWith(str, suffix) ? str : str + suffix
}

export function between(str: string, start: string, end: string): string {
  const startIndex = str.indexOf(start)
  if (startIndex === -1) return ''
  const endIndex = str.indexOf(end, startIndex + start.length)
  if (endIndex === -1) return ''
  return str.slice(startIndex + start.length, endIndex)
}
