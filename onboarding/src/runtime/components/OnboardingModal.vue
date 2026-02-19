<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useOnboarding } from '#onboarding/composables';

const props = defineProps<{
  modelValue?: boolean;
  persistent?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
  open: [];
}>();

const { isActive } = useOnboarding();

const isOpen = ref(props.modelValue ?? false);
const previousOverflow = ref('');

watch(() => props.modelValue, (val) => {
  isOpen.value = val ?? false;
});

watch(isOpen, (val) => {
  emit('update:modelValue', val);
  if (val) {
    emit('open');
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = previousOverflow.value;
    emit('close');
  }
});

watch(isActive, (val) => {
  if (val && !isOpen.value) {
    isOpen.value = true;
  }
});

const close = () => {
  if (props.persistent) return;
  isOpen.value = false;
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay !== false) {
    close();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (props.closeOnEscape !== false && e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  previousOverflow.value = document.body.style.overflow;
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.body.style.overflow = previousOverflow.value;
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="onboarding-modal">
        <div 
          class="onboarding-modal__overlay" 
          @click="handleOverlayClick"
        />
        <div 
          class="onboarding-modal__container"
          :class="`onboarding-modal__container--${size ?? 'md'}`"
        >
          <button 
            v-if="!persistent"
            type="button"
            class="onboarding-modal__close"
            aria-label="Close"
            @click="close"
          >
            ✕
          </button>
          
          <div class="onboarding-modal__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.onboarding-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.onboarding-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
}

.onboarding-modal__container {
  position: relative;
  background: var(--onboarding-bg, #fff);
  border-radius: var(--onboarding-radius, 0.75rem);
  box-shadow: var(--onboarding-shadow-lg, 0 25px 50px -12px rgb(0 0 0 / 0.25));
  max-height: calc(100vh - 2rem);
  overflow: auto;
}

.onboarding-modal__container--sm {
  width: 100%;
  max-width: 24rem;
}

.onboarding-modal__container--md {
  width: 100%;
  max-width: 32rem;
}

.onboarding-modal__container--lg {
  width: 100%;
  max-width: 48rem;
}

.onboarding-modal__container--xl {
  width: 100%;
  max-width: 64rem;
}

.onboarding-modal__container--full {
  width: calc(100vw - 2rem);
  height: calc(100vh - 2rem);
}

.onboarding-modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: var(--onboarding-text-muted, #6b7280);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.15s ease;
  z-index: 1;
}

.onboarding-modal__close:hover {
  background: var(--onboarding-secondary, #e5e7eb);
  color: var(--onboarding-text, #111827);
}

.onboarding-modal__content {
  padding: 1.5rem;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .onboarding-modal__container,
.modal-leave-active .onboarding-modal__container {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .onboarding-modal__container,
.modal-leave-to .onboarding-modal__container {
  opacity: 0;
  transform: scale(0.95);
}
</style>
