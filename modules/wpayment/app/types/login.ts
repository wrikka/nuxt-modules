// Login Page Types
// Type definitions for the WorkOS Login Page

export type LoginVariant = 'minimal' | 'card' | 'split' | 'fullscreen'

export interface SSOProvider {
  id: string
  name: string
  icon?: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

export interface LoginProps {
  variant?: LoginVariant
  title?: string
  subtitle?: string
  logo?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  showMagicLink?: boolean
  showSignup?: boolean
  features?: Feature[]
}

export interface LoginEmits {
  submit: [credentials: LoginCredentials]
  'sso-login': [providerId: string]
  'magic-link': [email: string]
  'forgot-password': []
  signup: []
}
