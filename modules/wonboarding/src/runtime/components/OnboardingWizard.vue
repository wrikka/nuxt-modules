<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useOnboarding } from '#onboarding/composables';
import type { OnboardingStep } from '#onboarding/types';

const props = defineProps<{
  showNavigation?: boolean;
  showSkip?: boolean;
  animated?: boolean;
}>();

const emit = defineEmits<{
  complete: [];
  skip: [];
  stepChange: [step: OnboardingStep];
}>();

const {
  steps,
  progress,
  isActive,
  currentStepIndex,
  nextStep,
  previousStep,
  completeStep,
  skipStep,
  skipAll,
  goToStep,
} = useOnboarding();

const transitionName = ref('slide-left');
const isAnimating = ref(false);

const currentStep = computed(() => {
  const idx = currentStepIndex.value;
  return steps.value[idx] ?? null;
});

const canGoNext = computed(() => nextStep.value !== null);
const canGoPrevious = computed(() => previousStep.value !== null);
const canSkip = computed(() => currentStep.value && !currentStep.value.required);

watch(currentStepIndex, (newIdx, oldIdx) => {
  transitionName.value = newIdx > oldIdx ? 'slide-left' : 'slide-right';
  if (currentStep.value) {
    emit('stepChange', currentStep.value);
  }
});

const handleNext = async () => {
  if (!canGoNext.value || isAnimating.value) return;
  isAnimating.value = true;
  if (currentStep.value) {
    await completeStep(currentStep.value.id);
  }
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

const handlePrevious = () => {
  if (!canGoPrevious.value || isAnimating.value) return;
  const prev = previousStep.value;
  if (prev) {
    goToStep(prev.id);
  }
};

const handleSkip = async () => {
  if (!canSkip.value || isAnimating.value) return;
  if (currentStep.value) {
    await skipStep(currentStep.value.id);
  }
};

const handleSkipAll = async () => {
  await skipAll();
  emit('skip');
};

watch(progress, (p) => {
  if (p.completed) {
    emit('complete');
  }
});
</script>

<template>
  <div v-if="isActive" class="onboarding-wizard">
    <div class="onboarding-wizard__header">
      <div class="onboarding-wizard__progress">
        <span class="onboarding-wizard__step-counter">
          {{ currentStepIndex + 1 }} / {{ steps.length }}
        </span>
        <div class="onboarding-wizard__progress-bar">
          <div 
            class="onboarding-wizard__progress-fill" 
            :style="{ width: `${progress.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <div class="onboarding-wizard__content">
      <Transition :name="animated ? transitionName : ''" mode="out-in">
        <div 
          v-if="currentStep" 
          :key="currentStep.id" 
          class="onboarding-wizard__step"
        >
          <div v-if="currentStep.icon" class="onboarding-wizard__icon">
            {{ currentStep.icon }}
          </div>
          
          <h2 class="onboarding-wizard__title">
            {{ currentStep.title }}
          </h2>
          
          <p v-if="currentStep.description" class="onboarding-wizard__description">
            {{ currentStep.description }}
          </p>

          <slot 
            name="step-content" 
            :step="currentStep" 
            :complete="() => completeStep(currentStep.id)"
          />
        </div>
      </Transition>
    </div>

    <div v-if="showNavigation !== false" class="onboarding-wizard__navigation">
      <button 
        v-if="canGoPrevious"
        type="button"
        class="onboarding-wizard__btn onboarding-wizard__btn--secondary"
        @click="handlePrevious"
      >
        ย้อนกลับ
      </button>

      <div class="onboarding-wizard__actions">
        <button 
          v-if="showSkip && canSkip"
          type="button"
          class="onboarding-wizard__btn onboarding-wizard__btn--ghost"
          @click="handleSkip"
        >
          ข้าม
        </button>

        <button 
          type="button"
          class="onboarding-wizard__btn onboarding-wizard__btn--primary"
          :disabled="!canGoNext"
          @click="handleNext"
        >
          {{ canGoNext ? 'ถัดไป' : 'เสร็จสิ้น' }}
        </button>
      </div>
    </div>

    <button 
      v-if="showSkip"
      type="button"
      class="onboarding-wizard__skip-all"
      @click="handleSkipAll"
    >
      ข้ามทั้งหมด
    </button>
  </div>
</template>

<style scoped>
.onboarding-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--onboarding-bg, #fff);
  border-radius: var(--onboarding-radius, 0.75rem);
  box-shadow: var(--onboarding-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1));
  max-width: 32rem;
  width: 100%;
}

.onboarding-wizard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.onboarding-wizard__progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.onboarding-wizard__step-counter {
  font-size: 0.875rem;
  color: var(--onboarding-text-muted, #6b7280);
  white-space: nowrap;
}

.onboarding-wizard__progress-bar {
  flex: 1;
  height: 0.375rem;
  background: var(--onboarding-progress-bg, #e5e7eb);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-wizard__progress-fill {
  height: 100%;
  background: var(--onboarding-progress-fill, #3b82f6);
  transition: width 0.3s ease;
}

.onboarding-wizard__content {
  min-height: 12rem;
}

.onboarding-wizard__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.onboarding-wizard__icon {
  font-size: 2.5rem;
  line-height: 1;
}

.onboarding-wizard__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--onboarding-text, #111827);
}

.onboarding-wizard__description {
  font-size: 0.9375rem;
  color: var(--onboarding-text-muted, #6b7280);
  margin: 0;
  max-width: 28rem;
}

.onboarding-wizard__navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.onboarding-wizard__actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.onboarding-wizard__btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.onboarding-wizard__btn--primary {
  background: var(--onboarding-primary, #3b82f6);
  color: #fff;
}

.onboarding-wizard__btn--primary:hover:not(:disabled) {
  background: var(--onboarding-primary-hover, #2563eb);
}

.onboarding-wizard__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.onboarding-wizard__btn--secondary {
  background: var(--onboarding-secondary, #e5e7eb);
  color: var(--onboarding-text, #111827);
}

.onboarding-wizard__btn--secondary:hover {
  background: var(--onboarding-secondary-hover, #d1d5db);
}

.onboarding-wizard__btn--ghost {
  background: transparent;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-wizard__btn--ghost:hover {
  color: var(--onboarding-text, #111827);
}

.onboarding-wizard__skip-all {
  align-self: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.onboarding-wizard__skip-all:hover {
  color: var(--onboarding-text, #111827);
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-1rem);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
