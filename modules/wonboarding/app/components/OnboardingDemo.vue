<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDemo as OnboardingDemoType } from '#onboarding/types';

const props = defineProps<{
  demo: OnboardingDemoType;
  title?: string;
}>();

const emit = defineEmits<{
  complete: [];
  interaction: [action: string];
}>();

const demoType = computed(() => props.demo.type);
const instructions = computed(() => props.demo.instructions ?? []);
</script>

<template>
  <div class="onboarding-demo">
    <div class="onboarding-demo__header">
      <span class="onboarding-demo__badge">
        {{ demoType === 'playground' ? 'สนุกกับมัน' : demoType === 'interactive' ? 'ลองเล่น' : 'ตัวอย่าง' }}
      </span>
      <h4 v-if="title" class="onboarding-demo__title">{{ title }}</h4>
    </div>

    <!-- Instructions -->
    <div v-if="instructions.length > 0" class="onboarding-demo__instructions">
      <ol class="onboarding-demo__instruction-list">
        <li 
          v-for="(instruction, idx) in instructions" 
          :key="idx"
          class="onboarding-demo__instruction"
        >
          {{ instruction }}
        </li>
      </ol>
    </div>

    <!-- Demo Area -->
    <div class="onboarding-demo__area">
      <slot name="demo" :demo="demo" :props="demo.props">
        <div class="onboarding-demo__placeholder">
          <span class="onboarding-demo__placeholder-icon">🎮</span>
          <p class="onboarding-demo__placeholder-text">
            Interactive demo area
          </p>
          <p class="onboarding-demo__placeholder-hint">
            Component: {{ demo.component ?? 'Not specified' }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Actions -->
    <div class="onboarding-demo__actions">
      <button 
        type="button"
        class="onboarding-demo__btn onboarding-demo__btn--primary"
        @click="emit('complete')"
      >
        เสร็จสิ้น
      </button>
    </div>
  </div>
</template>

<style scoped>
.onboarding-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--onboarding-secondary, #f3f4f6);
  border-radius: 0.75rem;
  border: 1px solid var(--onboarding-border, #e5e7eb);
}

.onboarding-demo__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.onboarding-demo__badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--onboarding-primary-light, #eff6ff);
  color: var(--onboarding-primary, #3b82f6);
  border-radius: 0.25rem;
}

.onboarding-demo__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--onboarding-text, #111827);
}

.onboarding-demo__instructions {
  padding: 0.75rem;
  background: var(--onboarding-bg, #fff);
  border-radius: 0.5rem;
}

.onboarding-demo__instruction-list {
  margin: 0;
  padding-left: 1.25rem;
}

.onboarding-demo__instruction {
  font-size: 0.875rem;
  color: var(--onboarding-text-muted, #6b7280);
  margin-bottom: 0.25rem;
}

.onboarding-demo__instruction:last-child {
  margin-bottom: 0;
}

.onboarding-demo__area {
  min-height: 8rem;
  background: var(--onboarding-bg, #fff);
  border-radius: 0.5rem;
  border: 2px dashed var(--onboarding-border, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

.onboarding-demo__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1.5rem;
}

.onboarding-demo__placeholder-icon {
  font-size: 2rem;
}

.onboarding-demo__placeholder-text {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--onboarding-text, #111827);
}

.onboarding-demo__placeholder-hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-demo__actions {
  display: flex;
  justify-content: flex-end;
}

.onboarding-demo__btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.onboarding-demo__btn--primary {
  background: var(--onboarding-primary, #3b82f6);
  color: #fff;
}

.onboarding-demo__btn--primary:hover {
  background: var(--onboarding-primary-hover, #2563eb);
}
</style>
