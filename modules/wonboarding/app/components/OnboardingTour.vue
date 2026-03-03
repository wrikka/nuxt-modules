<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { OnboardingTourStep } from '#onboarding/types';

const props = defineProps<{
  steps: OnboardingTourStep[];
  showProgress?: boolean;
  allowSkip?: boolean;
  scrollToSelector?: boolean;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  complete: [];
  skip: [];
  stepChange: [step: OnboardingTourStep, index: number];
}>();

const currentIndex = ref(0);
const isActive = ref(props.modelValue ?? false);
const targetElement = ref<HTMLElement | null>(null);
const spotlightRect = ref<DOMRect | null>(null);

const currentStep = computed(() => props.steps[currentIndex.value]);
const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === props.steps.length - 1);
const progress = computed(() => Math.round(((currentIndex.value + 1) / props.steps.length) * 100));

watch(() => props.modelValue, (val) => {
  isActive.value = val ?? false;
  if (isActive.value) {
    updateSpotlight();
  }
});

watch(isActive, (val) => {
  emit('update:modelValue', val);
});

watch(currentIndex, () => {
  updateSpotlight();
  if (currentStep.value) {
    emit('stepChange', currentStep.value, currentIndex.value);
  }
});

const updateSpotlight = () => {
  if (!currentStep.value || !isActive.value) return;

  const selector = currentStep.value.target;
  const el = document.querySelector<HTMLElement>(selector);
  
  if (el) {
    targetElement.value = el;
    spotlightRect.value = el.getBoundingClientRect();

    if (props.scrollToSelector !== false) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

const tooltipPosition = computed(() => {
  if (!spotlightRect.value || !currentStep.value) return {};

  const position = currentStep.value.position ?? 'bottom';
  const padding = currentStep.value.spotlightPadding ?? 8;
  const rect = spotlightRect.value;

  const positions: Record<string, { top: string; left: string }> = {
    top: {
      top: `${rect.top - padding - 100}px`,
      left: `${rect.left + rect.width / 2}px`,
    },
    bottom: {
      top: `${rect.bottom + padding}px`,
      left: `${rect.left + rect.width / 2}px`,
    },
    left: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.left - padding - 200}px`,
    },
    right: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + padding}px`,
    },
  };

  return positions[position];
});

const spotlightStyle = computed(() => {
  if (!spotlightRect.value || !currentStep.value) return {};

  const padding = currentStep.value.spotlightPadding ?? 8;
  const rect = spotlightRect.value;

  return {
    top: `${rect.top - padding}px`,
    left: `${rect.left - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
  };
});

const next = () => {
  if (isLast.value) {
    complete();
  } else {
    currentIndex.value++;
  }
};

const previous = () => {
  if (!isFirst.value) {
    currentIndex.value--;
  }
};

const skip = () => {
  isActive.value = false;
  emit('skip');
};

const complete = () => {
  isActive.value = false;
  emit('complete');
};

const handleResize = () => {
  updateSpotlight();
};

onMounted(() => {
  if (isActive.value) {
    updateSpotlight();
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="tour">
      <div v-if="isActive" class="onboarding-tour">
        <!-- Overlay with spotlight -->
        <div class="onboarding-tour__overlay">
          <div 
            v-if="currentStep?.spotlight !== false && spotlightRect"
            class="onboarding-tour__spotlight"
            :style="spotlightStyle"
          />
        </div>

        <!-- Progress -->
        <div v-if="showProgress" class="onboarding-tour__progress">
          <div class="onboarding-tour__progress-bar">
            <div 
              class="onboarding-tour__progress-fill"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <!-- Tooltip -->
        <div 
          v-if="currentStep"
          class="onboarding-tour__tooltip"
          :class="`onboarding-tour__tooltip--${currentStep.position ?? 'bottom'}`"
          :style="tooltipPosition"
        >
          <div class="onboarding-tour__tooltip-content">
            <h4 class="onboarding-tour__tooltip-title">
              {{ currentStep.title }}
            </h4>
            <p v-if="currentStep.description" class="onboarding-tour__tooltip-desc">
              {{ currentStep.description }}
            </p>
          </div>

          <div class="onboarding-tour__tooltip-footer">
            <span class="onboarding-tour__step-counter">
              {{ currentIndex + 1 }} / {{ steps.length }}
            </span>

            <div class="onboarding-tour__actions">
              <button 
                v-if="allowSkip"
                type="button"
                class="onboarding-tour__btn onboarding-tour__btn--ghost"
                @click="skip"
              >
                ข้ามทั้งหมด
              </button>

              <button 
                v-if="!isFirst"
                type="button"
                class="onboarding-tour__btn onboarding-tour__btn--secondary"
                @click="previous"
              >
                ย้อนกลับ
              </button>

              <button 
                type="button"
                class="onboarding-tour__btn onboarding-tour__btn--primary"
                @click="next"
              >
                {{ isLast ? 'เสร็จสิ้น' : 'ถัดไป' }}
              </button>
            </div>
          </div>

          <div class="onboarding-tour__tooltip-arrow" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.onboarding-tour {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.onboarding-tour__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.onboarding-tour__spotlight {
  position: absolute;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 9999px rgb(0 0 0 / 0.5);
  pointer-events: none;
  transition: all 0.3s ease;
}

.onboarding-tour__progress {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  pointer-events: none;
}

.onboarding-tour__progress-bar {
  height: 0.25rem;
  background: rgb(255 255 255 / 0.2);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-tour__progress-fill {
  height: 100%;
  background: var(--onboarding-primary, #3b82f6);
  transition: width 0.3s ease;
}

.onboarding-tour__tooltip {
  position: absolute;
  background: var(--onboarding-bg, #fff);
  border-radius: 0.75rem;
  box-shadow: var(--onboarding-shadow-lg, 0 25px 50px -12px rgb(0 0 0 / 0.25));
  padding: 1rem;
  min-width: 16rem;
  max-width: 20rem;
  pointer-events: auto;
  transform: translateX(-50%);
  z-index: 1;
}

.onboarding-tour__tooltip--top {
  transform: translateX(-50%) translateY(-100%);
}

.onboarding-tour__tooltip--left {
  transform: translateX(-100%) translateY(-50%);
}

.onboarding-tour__tooltip--right {
  transform: translateY(-50%);
}

.onboarding-tour__tooltip-content {
  margin-bottom: 0.75rem;
}

.onboarding-tour__tooltip-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--onboarding-text, #111827);
}

.onboarding-tour__tooltip-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-tour__tooltip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.onboarding-tour__step-counter {
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-tour__actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.onboarding-tour__btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.onboarding-tour__btn--primary {
  background: var(--onboarding-primary, #3b82f6);
  color: #fff;
}

.onboarding-tour__btn--primary:hover {
  background: var(--onboarding-primary-hover, #2563eb);
}

.onboarding-tour__btn--secondary {
  background: var(--onboarding-secondary, #e5e7eb);
  color: var(--onboarding-text, #111827);
}

.onboarding-tour__btn--secondary:hover {
  background: var(--onboarding-secondary-hover, #d1d5db);
}

.onboarding-tour__btn--ghost {
  background: transparent;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-tour__btn--ghost:hover {
  color: var(--onboarding-text, #111827);
}

.onboarding-tour__tooltip-arrow {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--onboarding-bg, #fff);
  transform: rotate(45deg);
}

.onboarding-tour__tooltip--bottom .onboarding-tour__tooltip-arrow {
  top: -0.25rem;
  left: 50%;
  margin-left: -0.25rem;
}

.onboarding-tour__tooltip--top .onboarding-tour__tooltip-arrow {
  bottom: -0.25rem;
  left: 50%;
  margin-left: -0.25rem;
}

.onboarding-tour__tooltip--left .onboarding-tour__tooltip-arrow {
  right: -0.25rem;
  top: 50%;
  margin-top: -0.25rem;
}

.onboarding-tour__tooltip--right .onboarding-tour__tooltip-arrow {
  left: -0.25rem;
  top: 50%;
  margin-top: -0.25rem;
}

/* Transitions */
.tour-enter-active,
.tour-leave-active {
  transition: opacity 0.3s ease;
}

.tour-enter-active .onboarding-tour__tooltip,
.tour-leave-active .onboarding-tour__tooltip {
  transition: all 0.3s ease;
}

.tour-enter-from,
.tour-leave-to {
  opacity: 0;
}

.tour-enter-from .onboarding-tour__tooltip,
.tour-leave-to .onboarding-tour__tooltip {
  opacity: 0;
  transform: translateX(-50%) translateY(0.5rem);
}
</style>
