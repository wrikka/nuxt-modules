// Login Flow Builder Types
// Type definitions for the WorkOS Login Flow Builder

export interface FlowStep {
  id: string
  type: string
  name: string
  icon: string
  required: boolean
  config: Record<string, unknown>
}

export interface AvailableStep {
  type: string
  name: string
  icon: string
  description: string
  defaultConfig: Record<string, unknown>
}

export interface FlowTemplate {
  name: string
  steps: FlowStep[]
}

export type FlowStepType =
  | 'sso'
  | 'password'
  | 'mfa'
  | 'condition'
  | 'redirect'
  | 'email'
  | 'consent'

export const FLOW_STEP_TYPES: Record<FlowStepType, Omit<AvailableStep, 'type'>> = {
  sso: {
    name: 'SSO Login',
    icon: '🔐',
    description: 'Single sign-on authentication',
    defaultConfig: { provider: 'google' },
  },
  password: {
    name: 'Password',
    icon: '🔑',
    description: 'Password authentication',
    defaultConfig: { requireUppercase: true, requireNumbers: true, requireSpecial: false },
  },
  mfa: {
    name: 'MFA Challenge',
    icon: '📱',
    description: 'Multi-factor authentication',
    defaultConfig: { method: 'totp' },
  },
  condition: {
    name: 'Condition',
    icon: '⚡',
    description: 'Conditional branching',
    defaultConfig: { condition: 'org_member' },
  },
  redirect: {
    name: 'Redirect',
    icon: '➡️',
    description: 'Redirect to URL',
    defaultConfig: { url: '/dashboard' },
  },
  email: {
    name: 'Email Verification',
    icon: '📧',
    description: 'Verify email address',
    defaultConfig: {},
  },
  consent: {
    name: 'Consent Screen',
    icon: '📋',
    description: 'Terms and conditions',
    defaultConfig: { title: 'Terms of Service' },
  },
}

export const DEFAULT_TEMPLATES: Record<string, FlowStep[]> = {
  simple: [
    { id: '1', type: 'password', name: 'Password', icon: '🔑', required: true, config: {} },
    { id: '2', type: 'redirect', name: 'Redirect', icon: '➡️', required: true, config: { url: '/dashboard' } },
  ],
  sso: [
    { id: '1', type: 'sso', name: 'SSO Login', icon: '🔐', required: true, config: { provider: 'google' } },
    { id: '2', type: 'redirect', name: 'Redirect', icon: '➡️', required: true, config: { url: '/dashboard' } },
  ],
  mfa: [
    { id: '1', type: 'password', name: 'Password', icon: '🔑', required: true, config: {} },
    { id: '2', type: 'mfa', name: 'MFA Challenge', icon: '📱', required: true, config: { method: 'totp' } },
    { id: '3', type: 'redirect', name: 'Redirect', icon: '➡️', required: true, config: { url: '/dashboard' } },
  ],
  enterprise: [
    { id: '1', type: 'sso', name: 'SSO Login', icon: '🔐', required: true, config: { provider: 'okta' } },
    { id: '2', type: 'mfa', name: 'MFA Challenge', icon: '📱', required: true, config: { method: 'totp' } },
    { id: '3', type: 'consent', name: 'Terms', icon: '📋', required: true, config: {} },
    { id: '4', type: 'redirect', name: 'Redirect', icon: '➡️', required: true, config: { url: '/dashboard' } },
  ],
}
