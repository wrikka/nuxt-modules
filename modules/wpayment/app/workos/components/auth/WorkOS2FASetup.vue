<template>
  <div class="twofa-setup">
    <div class="setup-header">
      <h2>Two-Factor Authentication</h2>
      <p class="subtitle">Secure your account with an authenticator app</p>
    </div>

    <div v-if="!isSetupComplete" class="setup-content">
      <div class="setup-steps">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="['step', { active: currentStep === index, completed: currentStep > index }]"
        >
          <div class="step-number">{{ currentStep > index ? '✓' : index + 1 }}</div>
          <span>{{ step }}</span>
        </div>
      </div>

      <div class="step-content">
        <div v-if="currentStep === 0" class="step-intro">
          <div class="intro-icon">🔐</div>
          <h3>Why enable 2FA?</h3>
          <ul class="benefits-list">
            <li>Protect your account from unauthorized access</li>
            <li>Add an extra layer of security beyond your password</li>
            <li>Required for accessing sensitive organization data</li>
          </ul>
          <WorkOSButton variant="primary" @click="nextStep">Get Started</WorkOSButton>
        </div>

        <div v-else-if="currentStep === 1" class="step-qr">
          <h3>Scan QR Code</h3>
          <p>Use your authenticator app (Google Authenticator, Authy, etc.) to scan this code</p>
          <div class="qr-container">
            <div class="qr-placeholder">
              <div class="qr-code">
                <div v-for="(row, rowIndex) in qrMatrix" :key="rowIndex" class="qr-row">
                  <span
                    v-for="(cell, cellIndex) in row"
                    :key="`${rowIndex}-${cellIndex}`"
                    :class="['qr-cell', { filled: cell }]"
                  />
                </div>
              </div>
            </div>
            <div class="secret-key">
              <p>Or enter this code manually:</p>
              <code class="secret-code">{{ maskedSecret }}</code>
              <WorkOSButton variant="secondary" sm @click="copySecret">Copy</WorkOSButton>
            </div>
          </div>
          <WorkOSButton variant="primary" @click="nextStep">Next</WorkOSButton>
        </div>

        <div v-else-if="currentStep === 2" class="step-verify">
          <h3>Verify Setup</h3>
          <p>Enter the 6-digit code from your authenticator app</p>
          <div class="code-input-container">
            <input
              v-for="(_, index) in verificationCode"
              :key="index"
              ref="codeInputs"
              v-model="verificationCode[index]"
              type="text"
              maxlength="1"
              class="code-input"
              @input="handleCodeInput(index)"
              @keydown="handleCodeKeydown($event, index)"
            />
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <div class="actions">
            <WorkOSButton variant="secondary" @click="prevStep">Back</WorkOSButton>
            <WorkOSButton variant="primary" :disabled="!isCodeComplete" @click="verifyCode">
              Verify
            </WorkOSButton>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step-recovery">
          <h3>Recovery Codes</h3>
          <p>Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
          <div class="recovery-codes">
            <div v-for="(code, index) in recoveryCodes" :key="index" class="recovery-code">
              <span>{{ code }}</span>
            </div>
          </div>
          <div class="actions">
            <WorkOSButton variant="secondary" @click="downloadRecoveryCodes">
              Download Codes
            </WorkOSButton>
            <WorkOSButton variant="primary" @click="completeSetup">Complete Setup</WorkOSButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="setup-complete">
      <div class="complete-icon">✓</div>
      <h3>2FA is now enabled</h3>
      <p>Your account is protected with two-factor authentication</p>
      <div class="complete-actions">
        <WorkOSButton variant="secondary" @click="showRecoveryCodes = true">
          View Recovery Codes
        </WorkOSButton>
        <WorkOSButton variant="danger" @click="disable2FA">Disable 2FA</WorkOSButton>
      </div>
    </div>

    <WorkOSModal
      :show="showRecoveryCodes"
      title="Recovery Codes"
      @close="showRecoveryCodes = false"
    >
      <div class="recovery-codes-modal">
        <div v-for="(code, index) in recoveryCodes" :key="index" class="recovery-code">
          <span>{{ code }}</span>
        </div>
      </div>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

const steps = ["Introduction", "Scan QR Code", "Verify", "Recovery Codes"]
const currentStep = ref(0)
const isSetupComplete = ref(false)
const showRecoveryCodes = ref(false)
const errorMessage = ref("")

const secretKey = ref("JBSWY3DPEHPK3PXP")
const maskedSecret = computed(() => 
  secretKey.value.match(/.{1,4}/g)?.join(" ") || secretKey.value
)

const verificationCode = ref(["", "", "", "", "", ""])
const codeInputs = ref<HTMLInputElement[]>([])

const recoveryCodes = ref([
  "abcd-efgh-ijkl",
  "mnop-qrst-uvwx",
  "yz12-3456-7890",
  "abcd-efgh-ijkl",
  "mnop-qrst-uvwx",
  "yz12-3456-7890",
  "abcd-efgh-ijkl",
  "mnop-qrst-uvwx",
])

const qrMatrix = ref<boolean[][]>([])
const isCodeComplete = computed(() => 
  verificationCode.value.every(c => c.length === 1)
)

const generateQrMatrix = () => {
  const size = 21
  const matrix: boolean[][] = []
  for (let i = 0; i < size; i++) {
    const row: boolean[] = []
    for (let j = 0; j < size; j++) {
      row.push(Math.random() > 0.5)
    }
    matrix.push(row)
  }
  qrMatrix.value = matrix
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

const handleCodeInput = (index: number) => {
  if (verificationCode.value[index] && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

const handleCodeKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === "Backspace" && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

const verifyCode = async () => {
  const code = verificationCode.value.join("")
  if (code.length === 6) {
    errorMessage.value = ""
    nextStep()
  } else {
    errorMessage.value = "Invalid code. Please try again."
  }
}

const copySecret = async () => {
  await navigator.clipboard.writeText(secretKey.value)
}

const downloadRecoveryCodes = () => {
  const content = recoveryCodes.value.join("\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "recovery-codes.txt"
  a.click()
  URL.revokeObjectURL(url)
}

const completeSetup = () => {
  isSetupComplete.value = true
}

const disable2FA = () => {
  isSetupComplete.value = false
  currentStep.value = 0
  verificationCode.value = ["", "", "", "", "", ""]
}

generateQrMatrix()
</script>

<style scoped>
.twofa-setup {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.setup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.setup-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.subtitle {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.setup-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step.completed .step-number {
  background: #10b981;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.step.active .step-number {
  background: #2563eb;
}

.step span {
  font-size: 0.75rem;
  color: #6b7280;
}

.step-content {
  text-align: center;
}

.step-intro,
.step-qr,
.step-verify,
.step-recovery {
  padding: 1rem;
}

.intro-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.benefits-list {
  text-align: left;
  display: inline-block;
  margin: 1.5rem 0;
}

.benefits-list li {
  margin: 0.75rem 0;
  color: #374151;
}

.qr-container {
  margin: 1.5rem 0;
}

.qr-placeholder {
  display: inline-block;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.qr-code {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.qr-row {
  display: flex;
}

.qr-cell {
  width: 8px;
  height: 8px;
  background: white;
}

.qr-cell.filled {
  background: #1f2937;
}

.secret-key {
  margin-top: 1rem;
}

.secret-key p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.secret-code {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.25rem;
  margin-right: 0.5rem;
}

.code-input-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.code-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.code-input:focus {
  border-color: #2563eb;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.recovery-codes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.recovery-code {
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}

.setup-complete {
  text-align: center;
  padding: 2rem;
}

.complete-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.complete-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.recovery-codes-modal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
</style>
