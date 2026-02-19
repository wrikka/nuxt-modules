<script setup lang="ts">
import { computed } from 'vue';
import { useOnboarding } from '#onboarding/composables';
import type { OnboardingStep } from '#onboarding/types';

const props = defineProps<{
  showLabels?: boolean;
  showPercentage?: boolean;
  variant?: 'bar' | 'dots' | 'steps';
  size?: 'sm' | 'md' | 'lg';
}>();

const { steps, progress, currentStepIndex } = useOnboarding();

const percentage = computed(() => progress.value.percentage);

const stepStates = computed(() =>
  steps.value.map((step: OnboardingStep, idx: number) => ({
    id: step.id,
    title: step.title,
    icon: step.icon,
    isActive: idx === currentStepIndex.value,
    isCompleted: step.completed,
    isSkipped: step.skipped,
    isCurrent: idx === currentStepIndex.value,
  }))
);

const sizeClass = computed(() => {
  const sizes = {
    sm: 'onboarding-progress--sm',
    md: 'onboarding-progress--md',
    lg: 'onboarding-progress--lg',
  };
  return sizes[props.size ?? 'md'];
});
</script>

<template>
  <div 
    class="onboarding-progress" 
    :class="[`onboarding-progress--${variant ?? 'bar'}`, sizeClass]"
  >
    <!-- Bar variant -->
    <template v-if="variant === 'bar' || !variant">
      <div class="onboarding-progress__bar">
        <div 
          class="onboarding-progress__fill" 
          :style="{ width: `${percentage}%` }"
        />
      </div>
      <span v-if="showPercentage" class="onboarding-progress__percentage">
        {{ percentage }}%
      </span>
    </template>

    <!-- Dots variant -->
    <template v-else-if="variant === 'dots'">
      <div class="onboarding-progress__dots">
        <button
          v-for="(step, idx) in stepStates"
          :key="step.id"
          type="button"
          class="onboarding-progress__dot"
          :class="{
            'onboarding-progress__dot--active': step.isActive,
            'onboarding-progress__dot--completed': step.isCompleted,
            'onboarding-progress__dot--skipped': step.isSkipped,
          }"
          :title="step.title"
        >
          <span v-if="step.icon" class="onboarding-progress__dot-icon">
            {{ step.icon }}
          </span>
          <span v-else>{{ idx + 1 }}</span>
        </button>
      </div>
    </template>

    <!-- Steps variant -->
    <template v-else-if="variant === 'steps'">
      <ol class="onboarding-progress__steps">
        <li
          v-for="(step, idx) in stepStates"
          :key="step.id"
          class="onboarding-progress__step"
          :class="{
            'onboarding-progress__step--active': step.isActive,
            'onboarding-progress__step--completed': step.isCompleted,
            'onboarding-progress__step--skipped': step.isSkipped,
          }"
        >
          <span class="onboarding-progress__step-indicator">
            <span v-if="step.isCompleted" class="onboarding-progress__step-check">✓</span>
            <span v-else-if="step.icon" class="onboarding-progress__step-icon">{{ step.icon }}</span>
            <span v-else>{{ idx + 1 }}</span>
          </span>
          <span v-if="showLabels" class="onboarding-progress__step-label">
            {{ step.title }}
          </span>
          <span 
            v-if="idx < stepStates.length - 1" 
            class="onboarding-progress__step-connector"
          />
        </li>
      </ol>
    </template>
  </div>
</template>

<style scoped>
.onboarding-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Bar variant */
.onboarding-progress__bar {
  flex: 1;
  height: var(--onboarding-progress-height, 0.5rem);
  background: var(--onboarding-progress-bg, #e5e7eb);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-progress__fill {
  height: 100%;
  background: var(--onboarding-progress-fill, #3b82f6);
  transition: width 0.3s ease;
}

.onboarding-progress__percentage {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--onboarding-text-muted, #6b7280);
  min-width: 2.5rem;
  text-align: right;
}

/* Dots variant */
.onboarding-progress--dots {
  justify-content: center;
}

.onboarding-progress__dots {
  display: flex;
  gap: 0.5rem;
}

.onboarding-progress__dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid var(--onboarding-progress-bg, #e5e7eb);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
  transition: all 0.2s ease;
}

.onboarding-progress__dot--active {
  border-color: var(--onboarding-progress-fill, #3b82f6);
  color: var(--onboarding-progress-fill, #3b82f6);
}

.onboarding-progress__dot--completed {
  border-color: var(--onboarding-success, #10b981);
  background: var(--onboarding-success, #10b981);
  color: #fff;
}

.onboarding-progress__dot--skipped {
  border-color: var(--onboarding-warning, #f59e0b);
  background: var(--onboarding-warning, #f59e0b);
  color: #fff;
}

.onboarding-progress__dot-icon {
  font-size: 1rem;
  line-height: 1;
}

/* Steps variant */
.onboarding-progress--steps {
  width: 100%;
}

.onboarding-progress__steps {
  display: flex;
  justify-content: space-between;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.onboarding-progress__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.onboarding-progress__step-indicator {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid var(--onboarding-progress-bg, #e5e7eb);
  background: var(--onboarding-bg, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--onboarding-text-muted, #6b7280);
  z-index: 1;
}

.onboarding-progress__step--active .onboarding-progress__step-indicator {
  border-color: var(--onboarding-progress-fill, #3b82f6);
  color: var(--onboarding-progress-fill, #3b82f6);
}

.onboarding-progress__step--completed .onboarding-progress__step-indicator {
  border-color: var(--onboarding-success, #10b981);
  background: var(--onboarding-success, #10b981);
  color: #fff;
}

.onboarding-progress__step--skipped .onboarding-progress__step-indicator {
  border-color: var(--onboarding-warning, #f59e0b);
  background: var(--onboarding-warning, #f59e0b);
  color: #fff;
}

.onboarding-progress__step-check {
  font-size: 0.875rem;
}

.onboarding-progress__step-icon {
  font-size: 1rem;
  line-height: 1;
}

.onboarding-progress__step-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
  text-align: center;
  max-width: 5rem;
}

.onboarding-progress__step--active .onboarding-progress__step-label {
  color: var(--onboarding-progress-fill, #3b82f6);
  font-weight: 500;
}

.onboarding-progress__step-connector {
  position: absolute;
  top: 1rem;
  left: calc(50% + 1rem);
  right: calc(-50% + 1rem);
  height: 2px;
  background: var(--onboarding-progress-bg, #e5e7eb);
}

.onboarding-progress__step--completed .onboarding-progress__step-connector {
  background: var(--onboarding-success, #10b981);
}

/* Size variants */
.onboarding-progress--sm .onboarding-progress__bar {
  height: 0.25rem;
}

.onboarding-progress--sm .onboarding-progress__dot,
.onboarding-progress--sm .onboarding-progress__step-indicator {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.625rem;
}

.onboarding-progress--lg .onboarding-progress__bar {
  height: 0.75rem;
}

.onboarding-progress--lg .onboarding-progress__dot,
.onboarding-progress--lg .onboarding-progress__step-indicator {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}
</style>
