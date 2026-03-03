// API Key Dashboard Types
// Type definitions for the WorkOS API Key Dashboard

export type ApiKeyStatus = "active" | "expired" | "revoked"
export type ApiKeyExpiration = "30d" | "90d" | "1y" | "never"

export interface ApiKey {
  id: string
  name: string
  description: string
  key: string
  permissions: string[]
  usage: number
  limit: number
  status: ApiKeyStatus
  expiresAt: Date
  createdAt: Date
}

export interface UsageDay {
  day: string
  requests: number
}

export interface Permission {
  value: string
  label: string
}

export interface KeyForm {
  name: string
  description: string
  permissions: string[]
  rateLimit: number
  expiration: ApiKeyExpiration
}

export const AVAILABLE_PERMISSIONS: Permission[] = [
  { value: "users.read", label: "Read Users" },
  { value: "users.write", label: "Write Users" },
  { value: "organizations.read", label: "Read Organizations" },
  { value: "organizations.write", label: "Write Organizations" },
  { value: "audit.read", label: "Read Audit Logs" },
  { value: "webhooks.manage", label: "Manage Webhooks" },
]
