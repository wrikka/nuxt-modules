export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/
  return phoneRegex.test(phone)
}

export function isUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function isHexColor(color: string): boolean {
  const hexRegex = /^#?([a-f\d]{3}|[a-f\d]{6})$/i
  return hexRegex.test(color)
}

export function isNumeric(value: string): boolean {
  return !isNaN(Number(value))
}

export function isInteger(value: string): boolean {
  return /^\d+$/.test(value)
}

export function isFloat(value: string): boolean {
  return /^\d+\.\d+$/.test(value)
}

export function isBoolean(value: string): boolean {
  return ['true', 'false', '1', '0'].includes(value.toLowerCase())
}

export function isDateString(date: string): boolean {
  return !isNaN(Date.parse(date))
}

export function isStrongPassword(password: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function isPositive(value: number): boolean {
  return value > 0
}

export function isNegative(value: number): boolean {
  return value < 0
}

export function isEven(value: number): boolean {
  return value % 2 === 0
}

export function isOdd(value: number): boolean {
  return value % 2 !== 0
}
