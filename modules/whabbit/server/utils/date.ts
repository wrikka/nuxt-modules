export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] || ''
}

export function getToday(): string {
  return formatDate(new Date())
}

export function getDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return formatDate(date)
}

export function getDaysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

export function getDateRange(days: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(formatDate(date))
  }

  return dates
}

export function getWeekDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  const dayOfWeek = today.getDay()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - dayOfWeek + i)
    dates.push(formatDate(date))
  }

  return dates
}

export function getMonthDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    dates.push(formatDate(date))
  }

  return dates
}

export function isToday(date: string): boolean {
  return date === getToday()
}

export function isPast(date: string): boolean {
  return date < getToday()
}

export function isFuture(date: string): boolean {
  return date > getToday()
}

export function getDayName(date: string, short: boolean = false): string {
  const d = new Date(date)
  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[d.getDay()] || ''
}

export function getMonthName(date: string, short: boolean = false): string {
  const d = new Date(date)
  const months = short
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[d.getMonth()] || ''
}

export function getDayNumber(date: string): number {
  return new Date(date).getDate()
}

export function getWeekNumber(date: string): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
