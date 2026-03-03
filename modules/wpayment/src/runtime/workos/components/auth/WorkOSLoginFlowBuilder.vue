<template>
  <div class="login-flow-builder">
    <div class="builder-header">
      <h2>Login Flow Builder</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="previewFlow">Preview</WorkOSButton>
        <WorkOSButton variant="primary" @click="saveFlow">Save Flow</WorkOSButton>
      </div>
    </div>

    <div class="builder-container">
      <div class="steps-panel">
        <h3>Available Steps</h3>
        <div class="steps-list">
          <div
            v-for="step in availableSteps"
            :key="step.type"
            class="step-item"
            draggable="true"
            @dragstart="dragStart($event, step)"
          >
            <span class="step-icon">{{ step.icon }}</span>
            <div class="step-info">
              <h4>{{ step.name }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flow-canvas" @dragover.prevent @drop="dropStep">
        <div class="canvas-header">
          <span>Login Flow</span>
          <span class="step-count">{{ flowSteps.length }} steps</span>
        </div>

        <div class="flow-steps">
          <div class="flow-start">
            <div class="start-node">
              <span>▶</span>
              <span>Start</span>
            </div>
          </div>

          <div
            v-for="(step, index) in flowSteps"
            :key="step.id"
            class="flow-step-wrapper"
          >
            <div class="flow-connector"></div>
            <div
              :class="['flow-step', step.type]"
              @click="selectStep(index)"
            >
              <div class="step-header">
                <span class="step-icon">{{ step.icon }}</span>
                <span class="step-title">{{ step.name }}</span>
                <button class="remove-btn" @click.stop="removeStep(index)">✕</button>
              </div>
              <div v-if="step.config" class="step-config">
                <div
                  v-for="(value, key) in step.config"
                  :key="key"
                  class="config-item"
                >
                  <span class="config-key">{{ key }}:</span>
                  <span class="config-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="flowSteps.length === 0" class="empty-canvas">
            <p>Drag steps here to build your login flow</p>
          </div>

          <div class="flow-end">
            <div class="flow-connector"></div>
            <div class="end-node">
              <span>✓</span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div class="config-panel">
        <h3>Step Configuration</h3>
        <div v-if="selectedStep" class="config-form">
          <h4>{{ selectedStep.name }}</h4>

          <div v-if="selectedStep.type === 'sso'" class="form-group">
            <label>SSO Provider</label>
            <select v-model="selectedStep.config.provider">
              <option value="google">Google</option>
              <option value="microsoft">Microsoft</option>
              <option value="okta">Okta</option>
              <option value="auth0">Auth0</option>
            </select>
          </div>

          <div v-if="selectedStep?.type === 'mfa'" class="form-group">
            <label>MFA Method</label>
            <select v-model="selectedStep.config.method">
              <option value="totp">TOTP (Authenticator App)</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div v-if="selectedStep?.type === 'password'" class="form-group">
            <label>Password Requirements</label>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="selectedStep.config.requireUppercase" />
                Require uppercase
              </label>
              <label>
                <input type="checkbox" v-model="selectedStep.config.requireNumbers" />
                Require numbers
              </label>
              <label>
                <input type="checkbox" v-model="selectedStep.config.requireSpecial" />
                Require special chars
              </label>
            </div>
          </div>

          <div v-if="selectedStep?.type === 'redirect'" class="form-group">
            <label>Redirect URL</label>
            <input v-model="selectedStep.config.url" type="text" placeholder="/dashboard" />
          </div>

          <div v-if="selectedStep?.type === 'condition'" class="form-group">
            <label>Condition</label>
            <select v-model="selectedStep.config.condition">
              <option value="org_member">Is Organization Member</option>
              <option value="admin">Is Admin</option>
              <option value="verified">Email Verified</option>
            </select>
          </div>

          <div class="form-group">
            <label>Step Name</label>
            <input v-model="selectedStep!.name" type="text" />
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="selectedStep!.required" />
              Required Step
            </label>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>Select a step to configure</p>
        </div>
      </div>
    </div>

    <div class="flow-templates">
      <h3>Templates</h3>
      <div class="templates-list">
        <button class="template-btn" @click="loadTemplate('simple')">Simple Login</button>
        <button class="template-btn" @click="loadTemplate('sso')">SSO Only</button>
        <button class="template-btn" @click="loadTemplate('mfa')">MFA Required</button>
        <button class="template-btn" @click="loadTemplate('enterprise')">Enterprise</button>
      </div>
    </div>

    <WorkOSModal
      :show="showPreview"
      title="Flow Preview"
      large
      @close="showPreview = false"
    >
      <div class="preview-container">
        <div class="preview-phone">
          <div class="preview-header">
            <span>Login</span>
          </div>
          <div class="preview-content">
            <div v-if="previewStep < flowSteps.length" class="preview-step">
              <span class="preview-icon">{{ flowSteps[previewStep]?.icon }}</span>
              <h4>{{ flowSteps[previewStep]?.name }}</h4>
              <WorkOSButton variant="primary" @click="nextPreviewStep">Continue</WorkOSButton>
            </div>
            <div v-else class="preview-complete">
              <span class="complete-icon">✓</span>
              <h4>Login Complete!</h4>
            </div>
          </div>
        </div>
        <div class="preview-controls">
          <span>Step {{ previewStep + 1 }} of {{ flowSteps.length }}</span>
          <WorkOSButton variant="secondary" sm @click="resetPreview">Reset</WorkOSButton>
        </div>
      </div>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface FlowStep {
  id: string
  type: string
  name: string
  icon: string
  required: boolean
  config: Record<string, unknown>
}

interface AvailableStep {
  type: string
  name: string
  icon: string
  description: string
  defaultConfig: Record<string, unknown>
}

const selectedStepIndex = ref<number | null>(null)
const showPreview = ref(false)
const previewStep = ref(0)

const flowSteps = ref<FlowStep[]>([
  {
    id: "1",
    type: "sso",
    name: "SSO Login",
    icon: "🔐",
    required: true,
    config: { provider: "google" },
  },
  {
    id: "2",
    type: "mfa",
    name: "MFA Challenge",
    icon: "📱",
    required: true,
    config: { method: "totp" },
  },
  {
    id: "3",
    type: "redirect",
    name: "Redirect to Dashboard",
    icon: "➡️",
    required: true,
    config: { url: "/dashboard" },
  },
])

const selectedStep = computed<FlowStep | null>(() => {
  if (selectedStepIndex.value === null) return null
  return flowSteps.value[selectedStepIndex.value] ?? null
})

const availableSteps: AvailableStep[] = [
  {
    type: "sso",
    name: "SSO Login",
    icon: "🔐",
    description: "Single sign-on authentication",
    defaultConfig: { provider: "google" },
  },
  {
    type: "password",
    name: "Password",
    icon: "🔑",
    description: "Password authentication",
    defaultConfig: { requireUppercase: true, requireNumbers: true, requireSpecial: false },
  },
  {
    type: "mfa",
    name: "MFA Challenge",
    icon: "📱",
    description: "Multi-factor authentication",
    defaultConfig: { method: "totp" },
  },
  {
    type: "condition",
    name: "Condition",
    icon: "⚡",
    description: "Conditional branching",
    defaultConfig: { condition: "org_member" },
  },
  {
    type: "redirect",
    name: "Redirect",
    icon: "➡️",
    description: "Redirect to URL",
    defaultConfig: { url: "/dashboard" },
  },
  {
    type: "email",
    name: "Email Verification",
    icon: "📧",
    description: "Verify email address",
    defaultConfig: {},
  },
  {
    type: "consent",
    name: "Consent Screen",
    icon: "📋",
    description: "Terms and conditions",
    defaultConfig: { title: "Terms of Service" },
  },
]

const dragStart = (event: DragEvent, step: AvailableStep) => {
  event.dataTransfer?.setData("step", JSON.stringify(step))
}

const dropStep = (event: DragEvent) => {
  const stepData = event.dataTransfer?.getData("step")
  if (stepData) {
    const step: AvailableStep = JSON.parse(stepData)
    flowSteps.value.push({
      id: Date.now().toString(),
      type: step.type,
      name: step.name,
      icon: step.icon,
      required: true,
      config: { ...step.defaultConfig },
    })
  }
}

const selectStep = (index: number) => {
  selectedStepIndex.value = index
}

const removeStep = (index: number) => {
  flowSteps.value.splice(index, 1)
  if (selectedStepIndex.value === index) {
    selectedStepIndex.value = null
  }
}

const previewFlow = () => {
  showPreview.value = true
  previewStep.value = 0
}

const nextPreviewStep = () => {
  previewStep.value++
}

const resetPreview = () => {
  previewStep.value = 0
}

const saveFlow = () => {
  // Save logic
}

const loadTemplate = (template: string) => {
  const templates: Record<string, FlowStep[]> = {
    simple: [
      { id: "1", type: "password", name: "Password", icon: "🔑", required: true, config: {} },
      { id: "2", type: "redirect", name: "Redirect", icon: "➡️", required: true, config: { url: "/dashboard" } },
    ],
    sso: [
      { id: "1", type: "sso", name: "SSO Login", icon: "🔐", required: true, config: { provider: "google" } },
      { id: "2", type: "redirect", name: "Redirect", icon: "➡️", required: true, config: { url: "/dashboard" } },
    ],
    mfa: [
      { id: "1", type: "password", name: "Password", icon: "🔑", required: true, config: {} },
      { id: "2", type: "mfa", name: "MFA Challenge", icon: "📱", required: true, config: { method: "totp" } },
      { id: "3", type: "redirect", name: "Redirect", icon: "➡️", required: true, config: { url: "/dashboard" } },
    ],
    enterprise: [
      { id: "1", type: "sso", name: "SSO Login", icon: "🔐", required: true, config: { provider: "okta" } },
      { id: "2", type: "mfa", name: "MFA Challenge", icon: "📱", required: true, config: { method: "totp" } },
      { id: "3", type: "consent", name: "Terms", icon: "📋", required: true, config: {} },
      { id: "4", type: "redirect", name: "Redirect", icon: "➡️", required: true, config: { url: "/dashboard" } },
    ],
  }
  flowSteps.value = templates[template] || []
}
</script>

<style scoped>
.login-flow-builder {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.builder-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.builder-container {
  display: grid;
  grid-template-columns: 250px 1fr 280px;
  gap: 1.5rem;
  min-height: 500px;
}

.steps-panel,
.config-panel {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
}

.steps-panel h3,
.config-panel h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
}

.step-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-item .step-icon {
  font-size: 1.25rem;
}

.step-item .step-info h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.step-item .step-info p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.flow-canvas {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px dashed #e5e7eb;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #374151;
}

.step-count {
  color: #6b7280;
  font-weight: 400;
}

.flow-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-start,
.flow-end {
  display: flex;
  justify-content: center;
}

.start-node,
.end-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.end-node {
  background: #2563eb;
}

.flow-connector {
  width: 2px;
  height: 24px;
  background: #d1d5db;
}

.flow-step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-step {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  min-width: 250px;
  cursor: pointer;
  transition: all 0.2s;
}

.flow-step:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flow-step.sso { border-left: 4px solid #10b981; }
.flow-step.password { border-left: 4px solid #f59e0b; }
.flow-step.mfa { border-left: 4px solid #8b5cf6; }
.flow-step.condition { border-left: 4px solid #ec4899; }
.flow-step.redirect { border-left: 4px solid #3b82f6; }
.flow-step.email { border-left: 4px solid #06b6d4; }
.flow-step.consent { border-left: 4px solid #6366f1; }

.step-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-header .step-icon {
  font-size: 1.25rem;
}

.step-title {
  flex: 1;
  font-weight: 500;
  color: #1f2937;
}

.remove-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
}

.step-config {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.config-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.config-key {
  color: #6b7280;
}

.config-value {
  color: #374151;
  font-weight: 500;
}

.empty-canvas {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-form h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.75rem;
  color: #6b7280;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.no-selection {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.flow-templates {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.flow-templates h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.templates-list {
  display: flex;
  gap: 0.75rem;
}

.template-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  background: #f9fafb;
  border-color: #2563eb;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-phone {
  width: 280px;
  background: #1f2937;
  border-radius: 24px;
  padding: 0.75rem;
}

.preview-header {
  background: #374151;
  padding: 0.75rem;
  border-radius: 16px 16px 0 0;
  text-align: center;
  color: white;
  font-weight: 500;
}

.preview-content {
  background: white;
  border-radius: 0 0 16px 16px;
  padding: 2rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.preview-icon {
  font-size: 3rem;
}

.preview-step h4 {
  margin: 0;
  color: #1f2937;
}

.preview-complete {
  text-align: center;
}

.complete-icon {
  display: inline-block;
  width: 48px;
  height: 48px;
  line-height: 48px;
  background: #d1fae5;
  color: #059669;
  border-radius: 50%;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
