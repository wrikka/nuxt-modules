// useOnboarding Composable
// Core logic for the Onboarding Wizard

import { ref, computed } from 'vue'
import type {
  TeamMember,
  Step,
  ProfileData,
  SecurityData,
  NotificationData,
} from '../types/onboarding'

export function useOnboarding() {
  const organizationName = ref("Acme Corp")
  const currentStep = ref(0)

  const steps: Step[] = [
    { title: "Welcome" },
    { title: "Profile" },
    { title: "Security" },
    { title: "Notifications" },
    { title: "Team" },
    { title: "Complete" },
  ]

  const profileData = ref<ProfileData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    phone: "",
    avatar: "",
  })

  const securityData = ref<SecurityData>({
    mfaEnabled: false,
    recoveryEmail: false,
    recoveryEmailAddress: "",
  })

  const notificationData = ref<NotificationData>({
    email: {
      important: true,
      weekly: true,
      marketing: false,
    },
    push: {
      messages: true,
      mentions: true,
      tasks: true,
    },
  })

  const teamMembers = ref<TeamMember[]>([
    { id: "1", name: "Sarah Johnson", role: "Team Lead" },
    { id: "2", name: "Mike Chen", role: "Senior Developer" },
    { id: "3", name: "Emily Davis", role: "Product Manager" },
    { id: "4", name: "Alex Thompson", role: "Designer" },
  ])

  const progressPercentage = computed(() => {
    return (currentStep.value / (steps.length - 1)) * 100
  })

  const notificationCount = computed(() => {
    const email = Object.values(notificationData.value.email).filter(Boolean).length
    const push = Object.values(notificationData.value.push).filter(Boolean).length
    return email + push
  })

  const canProceed = computed(() => {
    if (currentStep.value === 1) {
      return profileData.value.firstName.trim() !== "" && profileData.value.lastName.trim() !== ""
    }
    return true
  })

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      currentStep.value = step
    }
  }

  const uploadAvatar = () => {
    // Upload logic - to be implemented
    console.log("Upload avatar")
  }

  const messageMember = (member: TeamMember) => {
    // Message logic - to be implemented
    console.log("Message member:", member.name)
  }

  const goToDashboard = () => {
    // Navigate to dashboard - to be implemented
    console.log("Go to dashboard")
  }

  return {
    organizationName,
    currentStep,
    steps,
    profileData,
    securityData,
    notificationData,
    teamMembers,
    progressPercentage,
    notificationCount,
    canProceed,
    getInitials,
    nextStep,
    prevStep,
    goToStep,
    uploadAvatar,
    messageMember,
    goToDashboard,
  }
}
