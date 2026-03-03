<script setup lang="ts" generic="T extends FormValues = FormValues">
import { computed, inject } from 'vue';
import type { FormContext, FormValues, UseFormWizardReturn, WizardStep } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';

interface Props {
  wizard: UseFormWizardReturn<T>;
  showProgress?: boolean;
  showSteps?: boolean;
  allowNavigation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  showSteps: true,
  allowNavigation: true,
});

const emit = defineEmits<{
  complete: [];
  stepChange: [from: number, to: number];
}>();

const context = inject<FormContext>(WFORM_CONTEXT_KEY);

const handleNext = async () => {
  const success = await props.wizard.nextStep();
  if (success && props.wizard.isLastStep.value) {
    emit('complete');
  }
};

const handlePrevious = async () => {
  await props.wizard.previousStep();
};

const goToStep = async (index: number) => {
  if (!props.allowNavigation) return;
  await props.wizard.goToStep(index);
};
</script>

<template>
  <div class="w-form-wizard">
    <!-- Progress Bar -->
    <div v-if="showProgress" class="wizard-progress">
      <div class="progress-bar" :style="{ width: `${wizard.progress.value}%` }" />
    </div>

    <!-- Steps Navigation -->
    <div v-if="showSteps" class="wizard-steps">
      <button
        v-for="(step, index) in wizard.totalSteps.value"
        :key="index"
        class="step-indicator"
        :class="{
          'step-active': index === wizard.currentStepIndex.value,
          'step-completed': wizard.getStepStatus(index) === 'completed',
          'step-pending': wizard.getStepStatus(index) === 'pending',
        }"
        :disabled="!allowNavigation || wizard.getStepStatus(index) === 'pending'"
        @click="goToStep(index)"
      >
        <span class="step-number">{{ index + 1 }}</span>
        <span class="step-title">{{ wizard.currentStep.value.title }}</span>
      </button>
    </div>

    <!-- Current Step Content -->
    <div class="wizard-content">
      <slot
        :step="wizard.currentStep.value"
        :stepIndex="wizard.currentStepIndex.value"
        :isFirst="wizard.isFirstStep.value"
        :isLast="wizard.isLastStep.value"
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="wizard-navigation">
      <button
        v-if="!wizard.isFirstStep.value"
        type="button"
        class="btn-previous"
        @click="handlePrevious"
      >
        Previous
      </button>
      <button
        type="button"
        class="btn-next"
        :disabled="!wizard.canGoNext.value"
        @click="handleNext"
      >
        {{ wizard.isLastStep.value ? 'Complete' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.w-form-wizard {
  width: 100%;
}

.wizard-progress {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.wizard-steps {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.step-indicator:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.step-completed {
  border-color: #10b981;
  background: #ecfdf5;
}

.step-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
}

.step-active .step-number {
  background: #3b82f6;
  color: white;
}

.step-completed .step-number {
  background: #10b981;
  color: white;
}

.wizard-content {
  margin-bottom: 1.5rem;
}

.wizard-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-previous,
.btn-next {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-previous {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-previous:hover {
  background: #e5e7eb;
}

.btn-next {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: #2563eb;
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
