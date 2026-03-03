<script setup lang="ts">
import { computed } from 'vue';
import { useOnboarding } from '#onboarding/composables';
import type { OnboardingStep } from '#onboarding/types';

const props = defineProps<{
  position?: 'left' | 'right';
  collapsible?: boolean;
  showProgress?: boolean;
}>();

const emit = defineEmits<{
  stepClick: [step: OnboardingStep];
}>();

const { steps, progress, currentStepIndex, goToStep } = useOnboarding();

const isCollapsed = defineModel<boolean>('collapsed', { default: false });

const orderedSteps = computed(() =>
  steps.value.map((step: OnboardingStep, idx: number) => ({
    ...step,
    index: idx,
    isActive: idx === currentStepIndex.value,
    isCompleted: step.completed,
    isSkipped: step.skipped,
    isPending: !step.completed && !step.skipped && idx !== currentStepIndex.value,
  }))
);

const handleStepClick = (stepId: string) => {
  goToStep(stepId);
  const step = steps.value.find((s: OnboardingStep) => s.id === stepId);
  if (step) {
    emit('stepClick', step);
  }
};

const toggleCollapse = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value;
  }
};

const getStatusIcon = (step: typeof orderedSteps.value[number]) => {
  if (step.isCompleted) return '✓';
  if (step.isSkipped) return '⊘';
  return null;
};
</script>

<template>
  <aside 
    class="onboarding-sidebar"
    :class="[
      `onboarding-sidebar--${position ?? 'left'}`,
      { 'onboarding-sidebar--collapsed': isCollapsed }
    ]"
  >
    <div class="onboarding-sidebar__header">
      <h3 v-if="!isCollapsed" class="onboarding-sidebar__title">
        ขั้นตอนการเริ่มต้น
      </h3>
      <button 
        v-if="collapsible"
        type="button"
        class="onboarding-sidebar__toggle"
        @click="toggleCollapse"
      >
        {{ isCollapsed ? '→' : '←' }}
      </button>
    </div>

    <div v-if="showProgress && !isCollapsed" class="onboarding-sidebar__progress">
      <div class="onboarding-sidebar__progress-bar">
        <div 
          class="onboarding-sidebar__progress-fill"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
      <span class="onboarding-sidebar__progress-text">
        {{ progress.percentage }}% เสร็จสิ้น
      </span>
    </div>

    <nav class="onboarding-sidebar__nav">
      <ol class="onboarding-sidebar__list">
        <li
          v-for="step in orderedSteps"
          :key="step.id"
          class="onboarding-sidebar__item"
          :class="{
            'onboarding-sidebar__item--active': step.isActive,
            'onboarding-sidebar__item--completed': step.isCompleted,
            'onboarding-sidebar__item--skipped': step.isSkipped,
            'onboarding-sidebar__item--disabled': step.isPending && step.dependsOn?.length,
          }"
        >
          <button
            type="button"
            class="onboarding-sidebar__step"
            :disabled="step.isPending && !!(step.dependsOn?.length ?? 0)"
            @click="handleStepClick(step.id)"
          >
            <span class="onboarding-sidebar__step-indicator">
              <span v-if="getStatusIcon(step)" class="onboarding-sidebar__step-status">
                {{ getStatusIcon(step) }}
              </span>
              <span v-else-if="step.icon" class="onboarding-sidebar__step-icon">
                {{ step.icon }}
              </span>
              <span v-else class="onboarding-sidebar__step-number">
                {{ step.index + 1 }}
              </span>
            </span>

            <span v-if="!isCollapsed" class="onboarding-sidebar__step-content">
              <span class="onboarding-sidebar__step-title">{{ step.title }}</span>
              <span v-if="step.description" class="onboarding-sidebar__step-desc">
                {{ step.description }}
              </span>
            </span>
          </button>
        </li>
      </ol>
    </nav>
  </aside>
</template>

<style scoped>
.onboarding-sidebar {
  display: flex;
  flex-direction: column;
  background: var(--onboarding-bg, #fff);
  border-right: 1px solid var(--onboarding-border, #e5e7eb);
  width: 16rem;
  transition: width 0.2s ease;
}

.onboarding-sidebar--right {
  border-right: none;
  border-left: 1px solid var(--onboarding-border, #e5e7eb);
}

.onboarding-sidebar--collapsed {
  width: 3.5rem;
}

.onboarding-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--onboarding-border, #e5e7eb);
}

.onboarding-sidebar__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--onboarding-text, #111827);
}

.onboarding-sidebar__toggle {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--onboarding-text-muted, #6b7280);
  cursor: pointer;
  border-radius: 0.25rem;
}

.onboarding-sidebar__toggle:hover {
  background: var(--onboarding-secondary, #e5e7eb);
}

.onboarding-sidebar__progress {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--onboarding-border, #e5e7eb);
}

.onboarding-sidebar__progress-bar {
  height: 0.375rem;
  background: var(--onboarding-progress-bg, #e5e7eb);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-sidebar__progress-fill {
  height: 100%;
  background: var(--onboarding-progress-fill, #3b82f6);
  transition: width 0.3s ease;
}

.onboarding-sidebar__progress-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.onboarding-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.onboarding-sidebar__item {
  margin-bottom: 0.25rem;
}

.onboarding-sidebar__step {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.onboarding-sidebar__step:hover:not(:disabled) {
  background: var(--onboarding-secondary, #f3f4f6);
}

.onboarding-sidebar__step:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.onboarding-sidebar__item--active .onboarding-sidebar__step {
  background: var(--onboarding-primary-light, #eff6ff);
}

.onboarding-sidebar__step-indicator {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 2px solid var(--onboarding-border, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--onboarding-text-muted, #6b7280);
  background: var(--onboarding-bg, #fff);
}

.onboarding-sidebar__item--active .onboarding-sidebar__step-indicator {
  border-color: var(--onboarding-primary, #3b82f6);
  color: var(--onboarding-primary, #3b82f6);
}

.onboarding-sidebar__item--completed .onboarding-sidebar__step-indicator {
  border-color: var(--onboarding-success, #10b981);
  background: var(--onboarding-success, #10b981);
  color: #fff;
}

.onboarding-sidebar__item--skipped .onboarding-sidebar__step-indicator {
  border-color: var(--onboarding-warning, #f59e0b);
  background: var(--onboarding-warning, #f59e0b);
  color: #fff;
}

.onboarding-sidebar__step-status {
  font-size: 0.875rem;
}

.onboarding-sidebar__step-icon {
  font-size: 1rem;
  line-height: 1;
}

.onboarding-sidebar__step-number {
  font-size: 0.75rem;
}

.onboarding-sidebar__step-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.onboarding-sidebar__step-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--onboarding-text, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.onboarding-sidebar__item--active .onboarding-sidebar__step-title {
  color: var(--onboarding-primary, #3b82f6);
}

.onboarding-sidebar__step-desc {
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.onboarding-sidebar--collapsed .onboarding-sidebar__step {
  justify-content: center;
  padding: 0.5rem;
}

.onboarding-sidebar--collapsed .onboarding-sidebar__step-indicator {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
