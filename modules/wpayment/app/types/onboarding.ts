// Onboarding Types
// Type definitions for the WorkOS Onboarding Wizard

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

export interface Step {
  title: string
}

export interface ProfileData {
  firstName: string
  lastName: string
  jobTitle: string
  department: string
  phone: string
  avatar: string
}

export interface SecurityData {
  mfaEnabled: boolean
  recoveryEmail: boolean
  recoveryEmailAddress: string
}

export interface NotificationData {
  email: {
    important: boolean
    weekly: boolean
    marketing: boolean
  }
  push: {
    messages: boolean
    mentions: boolean
    tasks: boolean
  }
}

export interface OnboardingState {
  currentStep: number
  organizationName: string
  profileData: ProfileData
  securityData: SecurityData
  notificationData: NotificationData
  teamMembers: TeamMember[]
  steps: Step[]
}
