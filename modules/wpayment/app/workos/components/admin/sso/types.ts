export interface HealthCheck {
  name: string
  status: "healthy" | "warning" | "error"
  value: string
}

export interface Alert {
  id: string
  severity: "warning" | "error"
  message: string
  timestamp: Date
}

export interface Connection {
  id: string
  name: string
  provider: string
  domain: string
  status: "healthy" | "degraded" | "down"
  uptime: number
  responseTime: number
  successRate: number
  lastCheck: Date
  checks: HealthCheck[]
  alerts: Alert[]
}

export interface TrendDay {
  day: string
  health: number
}

export interface TestStep {
  name: string
  success: boolean
  duration: number
}

export interface TestResult {
  success: boolean
  steps: TestStep[]
}

export interface NewConnection {
  name: string
  provider: string
  domain: string
  clientId: string
  clientSecret: string
}
