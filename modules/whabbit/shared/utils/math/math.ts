export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1))
}

export function round(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function floor(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.floor(value * factor) / factor
}

export function ceil(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.ceil(value * factor) / factor
}

export function sum(...values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0)
}

export function average(...values: number[]): number {
  return values.length > 0 ? sum(...values) / values.length : 0
}

export function median(...values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2
}

export function min(...values: number[]): number {
  return Math.min(...values)
}

export function max(...values: number[]): number {
  return Math.max(...values)
}

export function abs(value: number): number {
  return Math.abs(value)
}

export function pow(base: number, exponent: number): number {
  return Math.pow(base, exponent)
}

export function sqrt(value: number): number {
  return Math.sqrt(value)
}

export function cbrt(value: number): number {
  return Math.cbrt(value)
}

export function log(value: number, base: number = Math.E): number {
  return Math.log(value) / Math.log(base)
}

export function log10(value: number): number {
  return Math.log10(value)
}

export function log2(value: number): number {
  return Math.log2(value)
}

export function sin(angle: number): number {
  return Math.sin(angle)
}

export function cos(angle: number): number {
  return Math.cos(angle)
}

export function tan(angle: number): number {
  return Math.tan(angle)
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

export function factorial(n: number): number {
  if (n < 0) return 0
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

export function fibonacci(n: number): number {
  if (n < 0) return 0
  if (n === 0) return 0
  if (n === 1) return 1
  return fibonacci(n - 1) + fibonacci(n - 2)
}
