<script setup lang="ts">
import type { TestResult } from "./types"

const props = defineProps<{
  show: boolean
  inProgress: boolean
  result: TestResult | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})
</script>

<template>
  <WorkOSModal
    :show="show"
    title="Connection Test"
    @close="show = false"
  >
    <div class="test-results">
      <div v-if="inProgress" class="test-progress">
        <div class="spinner"></div>
        <p>Testing connection...</p>
      </div>
      <div v-else-if="result" class="test-complete">
        <div :class="['test-status', result.success ? 'success' : 'failed']">
          {{ result.success ? '✓ Connection Successful' : '✕ Connection Failed' }}
        </div>
        <div class="test-details">
          <div v-for="step in result.steps" :key="step.name" class="test-step">
            <span :class="['step-status', step.success ? 'success' : 'failed']">
              {{ step.success ? '✓' : '✕' }}
            </span>
            <span>{{ step.name }}</span>
            <span class="step-time">{{ step.duration }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </WorkOSModal>
</template>

<style scoped>
.test-results {
  min-height: 200px;
}

.test-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.test-complete {
  text-align: center;
}

.test-status {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.test-status.success {
  background: #d1fae5;
  color: #059669;
}

.test-status.failed {
  background: #fee2e2;
  color: #dc2626;
}

.test-details {
  text-align: left;
}

.test-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.step-status {
  font-weight: 700;
}

.step-status.success {
  color: #059669;
}

.step-status.failed {
  color: #dc2626;
}

.step-time {
  margin-left: auto;
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>
