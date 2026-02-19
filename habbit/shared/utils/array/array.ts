export function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

export function head<T>(arr: T[]): T | undefined {
  return first(arr)
}

export function tail<T>(arr: T[]): T[] {
  return arr.slice(1)
}

export function initial<T>(arr: T[]): T[] {
  return arr.slice(0, -1)
}

export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n)
}

export function takeRight<T>(arr: T[], n: number): T[] {
  return arr.slice(-n)
}

export function drop<T>(arr: T[], n: number): T[] {
  return arr.slice(n)
}

export function dropRight<T>(arr: T[], n: number): T[] {
  return arr.slice(0, -n)
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val)
  }, [])
}

export function flattenDeep<T>(arr: unknown[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flattenDeep(val) : [val as T])
  }, [])
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export function uniqBy<T, K>(arr: T[], key: (item: T) => K): T[] {
  const seen = new Set<K>()
  return arr.filter(item => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function intersection<T>(...arrays: T[][]): T[] {
  return arrays.reduce((acc, arr) => {
    return acc.filter(item => arr.includes(item))
  })
}

export function union<T>(...arrays: T[][]): T[] {
  return uniq(arrays.flat())
}

export function difference<T>(arr: T[], ...others: T[][]): T[] {
  const otherSet = new Set(others.flat())
  return arr.filter(item => !otherSet.has(item))
}

export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item !== null && item !== undefined)
}

export function without<T>(arr: T[], ...values: T[]): T[] {
  return arr.filter(item => !values.includes(item))
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i]!, result[j]!] = [result[j]!, result[i]!]
  }
  return result
}

export function sample<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function sampleSize<T>(arr: T[], n: number): T[] {
  const shuffled = shuffle(arr)
  return shuffled.slice(0, n)
}

export function findIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  return arr.findIndex(predicate)
}

export function findLastIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i]!, i)) return i
  }
  return -1
}

export function groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function keyBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    acc[k] = item
    return acc
  }, {} as Record<K, T>)
}

export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return arr.reduce(
    (acc, item) => {
      acc[predicate(item) ? 0 : 1].push(item)
      return acc
    },
    [[], []] as [T[], T[]]
  )
}

export function sortBy<T>(arr: T[], key: (item: T) => number | string): T[] {
  return [...arr].sort((a, b) => {
    const ka = key(a)
    const kb = key(b)
    if (ka < kb) return -1
    if (ka > kb) return 1
    return 0
  })
}

export function orderBy<T>(arr: T[], key: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] {
  const sorted = sortBy(arr, key)
  return order === 'desc' ? sorted.reverse() : sorted
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0)
}

export function mean(arr: number[]): number {
  return arr.length > 0 ? sum(arr) / arr.length : 0
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2
}

export function max(arr: number[]): number {
  return Math.max(...arr)
}

export function min(arr: number[]): number {
  return Math.min(...arr)
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

export function times<T>(n: number, fn: (index: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i))
}

export function repeat<T>(value: T, n: number): T[] {
  return Array(n).fill(value)
}

export function isEmpty<T>(arr: T[]): boolean {
  return arr.length === 0
}

export function isNotEmpty<T>(arr: T[]): boolean {
  return arr.length > 0
}

export function includes<T>(arr: T[], value: T): boolean {
  return arr.includes(value)
}

export function indexOf<T>(arr: T[], value: T): number {
  return arr.indexOf(value)
}

export function lastIndexOf<T>(arr: T[], value: T): number {
  return arr.lastIndexOf(value)
}

export function join<T>(arr: T[], separator: string = ''): string {
  return arr.join(separator)
}

export function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse()
}

export function sort<T>(arr: T[]): T[] {
  return [...arr].sort((a, b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
}

export function countBy<T>(arr: T[], key: (item: T) => string | number): Record<string | number, number> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<string | number, number>)
}

export function pick<T, K extends keyof T>(arr: T[], keys: K[]): Pick<T, K>[] {
  return arr.map(item => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      result[key] = item[key]
    })
    return result
  })
}

export function omit<T, K extends keyof T>(arr: T[], keys: K[]): Omit<T, K>[] {
  return arr.map(item => {
    const result = { ...item }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  })
}

export function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key])
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const length = Math.min(arr1.length, arr2.length)
  return Array.from({ length }, (_, i) => [arr1[i]!, arr2[i]!])
}

export function unzip<T, U>(arr: [T, U][]): [T[], U[]] {
  return arr.reduce(
    (acc, [a, b]) => {
      acc[0].push(a)
      acc[1].push(b)
      return acc
    },
    [[], []] as [T[], U[]]
  )
}
