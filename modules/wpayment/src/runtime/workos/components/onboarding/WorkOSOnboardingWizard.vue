<template>
  <div class="onboarding-wizard">
    <div class="wizard-header">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <div class="step-indicators">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="['step-indicator', { active: currentStep === index, completed: currentStep > index }]"
        >
          <span class="indicator-number">{{ currentStep > index ? '✓' : index + 1 }}</span>
          <span class="indicator-label">{{ step.title }}</span>
        </div>
      </div>
    </div>

    <div class="wizard-content">
      <div v-if="currentStep === 0" class="step-welcome">
        <div class="welcome-icon">👋</div>
        <h2>Welcome to {{ organizationName }}!</h2>
        <p>Let's get you set up. This will only take a few minutes.</p>
        <div class="quick-stats">
          <div class="stat">
            <span class="stat-icon">⏱️</span>
            <span class="stat-text">~3 minutes</span>
          </div>
          <div class="stat">
            <span class="stat-icon">📋</span>
            <span class="stat-text">{{ steps.length }} steps</span>
          </div>
        </div>
        <WorkOSButton variant="primary" @click="nextStep">Let's Get Started</WorkOSButton>
      </div>

      <div v-else-if="currentStep === 1" class="step-profile">
        <h2>Complete Your Profile</h2>
        <p>Tell us a bit about yourself</p>
        
        <div class="profile-form">
          <div class="avatar-upload">
            <div class="avatar-preview">
              <img v-if="profileData.avatar" :src="profileData.avatar" />
              <div v-else class="avatar-placeholder">{{ getInitials(profileData.firstName || 'U') }}</div>
            </div>
            <WorkOSButton variant="secondary" sm @click="uploadAvatar">Upload Photo</WorkOSButton>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>First Name *</label>
              <input v-model="profileData.firstName" type="text" placeholder="John" />
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input v-model="profileData.lastName" type="text" placeholder="Doe" />
            </div>
          </div>

          <div class="form-group">
            <label>Job Title</label>
            <input v-model="profileData.jobTitle" type="text" placeholder="Software Engineer" />
          </div>

          <div class="form-group">
            <label>Department</label>
            <select v-model="profileData.department">
              <option value="">Select department</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">Human Resources</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="profileData.phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      <div v-else-if="currentStep === 2" class="step-security">
        <h2>Secure Your Account</h2>
        <p>Set up additional security measures</p>

        <div class="security-options">
          <div
            :class="['security-option', { selected: securityData.mfaEnabled }]"
            @click="securityData.mfaEnabled = !securityData.mfaEnabled"
          >
            <div class="option-icon">📱</div>
            <div class="option-content">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div class="option-toggle">
              <div :class="['toggle', { active: securityData.mfaEnabled }]"></div>
            </div>
          </div>

          <div
            :class="['security-option', { selected: securityData.recoveryEmail }]"
            @click="securityData.recoveryEmail = !securityData.recoveryEmail"
          >
            <div class="option-icon">📧</div>
            <div class="option-content">
              <h4>Recovery Email</h4>
              <p>Add a backup email for account recovery</p>
            </div>
            <div class="option-toggle">
              <div :class="['toggle', { active: securityData.recoveryEmail }]"></div>
            </div>
          </div>

          <div class="recovery-email-input" v-if="securityData.recoveryEmail">
            <input v-model="securityData.recoveryEmailAddress" type="email" placeholder="recovery@email.com" />
          </div>
        </div>
      </div>

      <div v-else-if="currentStep === 3" class="step-notifications">
        <h2>Notification Preferences</h2>
        <p>Choose how you'd like to stay informed</p>

        <div class="notification-options">
          <div class="notification-group">
            <h4>Email Notifications</h4>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.email.important" />
                <span>Important updates only</span>
              </label>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.email.weekly" />
                <span>Weekly digest</span>
              </label>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.email.marketing" />
                <span>Product updates & tips</span>
              </label>
            </div>
          </div>

          <div class="notification-group">
            <h4>Push Notifications</h4>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.push.messages" />
                <span>Direct messages</span>
              </label>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.push.mentions" />
                <span>Mentions & replies</span>
              </label>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notificationData.push.tasks" />
                <span>Task assignments</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentStep === 4" class="step-team">
        <h2>Meet Your Team</h2>
        <p>Here are some people you might work with</p>

        <div class="team-grid">
          <div v-for="member in teamMembers" :key="member.id" class="team-member">
            <div class="member-avatar">
              <img v-if="member.avatar" :src="member.avatar" />
              <div v-else class="avatar-placeholder">{{ getInitials(member.name) }}</div>
            </div>
            <div class="member-info">
              <h4>{{ member.name }}</h4>
              <p>{{ member.role }}</p>
            </div>
            <WorkOSButton variant="secondary" sm @click="messageMember(member)">Message</WorkOSButton>
          </div>
        </div>
      </div>

      <div v-else-if="currentStep === 5" class="step-complete">
        <div class="complete-icon">🎉</div>
        <h2>You're All Set!</h2>
        <p>Your account is ready to use. Here's a quick summary:</p>

        <div class="summary-card">
          <div class="summary-item">
            <span class="summary-icon">👤</span>
            <span class="summary-text">{{ profileData.firstName }} {{ profileData.lastName }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-icon">🔐</span>
            <span class="summary-text">{{ securityData.mfaEnabled ? '2FA Enabled' : '2FA Disabled' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-icon">🔔</span>
            <span class="summary-text">{{ notificationCount }} notification types enabled</span>
          </div>
        </div>

        <WorkOSButton variant="primary" @click="goToDashboard">Go to Dashboard</WorkOSButton>
      </div>
    </div>

    <div v-if="currentStep > 0 && currentStep < 5" class="wizard-footer">
      <WorkOSButton variant="secondary" @click="prevStep">Back</WorkOSButton>
      <WorkOSButton
        variant="primary"
        :disabled="!canProceed"
        @click="nextStep"
      >
        {{ currentStep === 4 ? 'Complete Setup' : 'Continue' }}
      </WorkOSButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

const organizationName = ref("Acme Corp")
const currentStep = ref(0)

const steps = [
  { title: "Welcome" },
  { title: "Profile" },
  { title: "Security" },
  { title: "Notifications" },
  { title: "Team" },
  { title: "Complete" },
]

const profileData = ref({
  firstName: "",
  lastName: "",
  jobTitle: "",
  department: "",
  phone: "",
  avatar: "",
})

const securityData = ref({
  mfaEnabled: false,
  recoveryEmail: false,
  recoveryEmailAddress: "",
})

const notificationData = ref({
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

const getInitials = (name: string) => {
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

const uploadAvatar = () => {
  // Upload logic
}

const messageMember = (member: TeamMember) => {
  // Message logic
}

const goToDashboard = () => {
  // Navigate to dashboard
}
</script>

<style scoped>
.onboarding-wizard {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.wizard-header {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
}

.step-indicator.active {
  opacity: 1;
}

.step-indicator.completed {
  opacity: 1;
}

.indicator-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.step-indicator.active .indicator-number {
  background: #2563eb;
  color: white;
}

.step-indicator.completed .indicator-number {
  background: #10b981;
  color: white;
}

.indicator-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.wizard-content {
  min-height: 400px;
}

.step-welcome,
.step-profile,
.step-security,
.step-notifications,
.step-team,
.step-complete {
  text-align: center;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.wizard-content h2 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.wizard-content > div > p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.quick-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.25rem;
}

.stat-text {
  color: #374151;
  font-size: 0.875rem;
}

.profile-form {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.security-options {
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.security-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.security-option:hover {
  border-color: #2563eb;
}

.security-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.option-icon {
  font-size: 1.5rem;
}

.option-content {
  flex: 1;
}

.option-content h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.option-content p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.option-toggle {
  width: 40px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
}

.toggle {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle.active {
  transform: translateX(16px);
}

.option-toggle:has(.active) {
  background: #2563eb;
}

.recovery-email-input {
  margin-top: 0.75rem;
}

.recovery-email-input input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.notification-options {
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.notification-group {
  margin-bottom: 1.5rem;
}

.notification-group h4 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.notification-item {
  margin-bottom: 0.5rem;
}

.notification-item label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.notification-item input {
  width: 16px;
  height: 16px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  text-align: center;
  margin-bottom: 0.75rem;
}

.member-info h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.member-info p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.complete-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.summary-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.summary-icon {
  font-size: 1.25rem;
}

.summary-text {
  color: #374151;
  font-size: 0.875rem;
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1.5rem;
}
</style>
