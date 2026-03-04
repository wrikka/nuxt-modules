<script setup lang="ts">
interface Props {
  type?: 'info' | 'warning' | 'danger' | 'success' | 'tip' | 'note'
  title?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  collapsible: false,
  defaultOpen: true
})

const isOpen = ref(props.defaultOpen)

const icons = {
  info: 'lucide:info',
  warning: 'lucide:alert-triangle',
  danger: 'lucide:x-circle',
  success: 'lucide:check-circle-2',
  tip: 'lucide:sparkles',
  note: 'lucide:file-text'
}

const colorSchemes = {
  info: {
    bg: 'var(--wmd-info-50)',
    border: 'var(--wmd-info-500)',
    icon: 'var(--wmd-info-600)',
    title: 'var(--wmd-info-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-info-50) 0%, transparent 100%)'
  },
  warning: {
    bg: 'var(--wmd-warning-50)',
    border: 'var(--wmd-warning-500)',
    icon: 'var(--wmd-warning-600)',
    title: 'var(--wmd-warning-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-warning-50) 0%, transparent 100%)'
  },
  danger: {
    bg: 'var(--wmd-danger-50)',
    border: 'var(--wmd-danger-500)',
    icon: 'var(--wmd-danger-600)',
    title: 'var(--wmd-danger-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-danger-50) 0%, transparent 100%)'
  },
  success: {
    bg: 'var(--wmd-success-50)',
    border: 'var(--wmd-success-500)',
    icon: 'var(--wmd-success-600)',
    title: 'var(--wmd-success-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-success-50) 0%, transparent 100%)'
  },
  tip: {
    bg: 'var(--wmd-primary-50)',
    border: 'var(--wmd-primary-500)',
    icon: 'var(--wmd-primary-600)',
    title: 'var(--wmd-primary-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-primary-50) 0%, transparent 100%)'
  },
  note: {
    bg: 'var(--wmd-gray-50)',
    border: 'var(--wmd-gray-400)',
    icon: 'var(--wmd-gray-600)',
    title: 'var(--wmd-gray-700)',
    gradient: 'linear-gradient(135deg, var(--wmd-gray-50) 0%, transparent 100%)'
  }
}

const currentScheme = computed(() => colorSchemes[props.type])

const toggleOpen = () => {
  if (props.collapsible) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div
    class="wmarkdown-callout"
    :class="[
      `callout-${type}`,
      { 'callout-collapsible': collapsible, 'callout-open': isOpen }
    ]"
    :style="{
      '--callout-bg': currentScheme.bg,
      '--callout-border': currentScheme.border,
      '--callout-icon': currentScheme.icon,
      '--callout-title': currentScheme.title,
      '--callout-gradient': currentScheme.gradient
    }"
  >
    <div
      class="callout-header"
      :class="{ 'cursor-pointer': collapsible }"
      @click="toggleOpen"
    >
      <div class="callout-icon-wrapper">
        <Icon
          :name="icons[type]"
          class="callout-icon"
        />
      </div>

      <div class="callout-title-wrapper">
        <span
          v-if="title"
          class="callout-title"
        >{{ title }}</span>
        <span
          v-else
          class="callout-title capitalize"
        >{{ type }}</span>
      </div>

      <div
        v-if="collapsible"
        class="callout-toggle"
        :class="{ 'is-open': isOpen }"
      >
        <Icon
          name="lucide:chevron-down"
          class="callout-chevron"
        />
      </div>
    </div>

    <Transition
      enter-active-class="callout-enter-active"
      enter-from-class="callout-enter-from"
      enter-to-class="callout-enter-to"
      leave-active-class="callout-leave-active"
      leave-from-class="callout-leave-from"
      leave-to-class="callout-leave-to"
    >
      <div
        v-show="isOpen"
        class="callout-content"
      >
        <div class="callout-content-inner">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.wmarkdown-callout {
  @apply relative rounded-xl my-5 overflow-hidden;
  background: var(--callout-bg);
  border: 1px solid var(--callout-border);
  box-shadow: var(--wmd-shadow-sm);
  transition: all var(--wmd-transition-base);
}

.wmarkdown-callout:hover {
  box-shadow: var(--wmd-shadow-md);
  transform: translateY(-1px);
}

.wmarkdown-callout::before {
  content: '';
  @apply absolute top-0 left-0 right-0 h-1;
  background: var(--callout-border);
  opacity: 0.6;
}

.callout-header {
  @apply flex items-center gap-3 px-5 py-4;
  @apply transition-all duration-200;
  background: var(--callout-gradient);
}

.callout-header.cursor-pointer:hover {
  background: var(--callout-bg);
}

.callout-icon-wrapper {
  @apply flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0;
  background: var(--wmd-bg-primary);
  box-shadow: var(--wmd-shadow-sm);
  transition: all var(--wmd-transition-base);
}

.wmarkdown-callout:hover .callout-icon-wrapper {
  transform: scale(1.05);
  box-shadow: var(--wmd-shadow-md);
}

.callout-icon {
  @apply w-5 h-5;
  color: var(--callout-icon);
}

.callout-title-wrapper {
  @apply flex-1;
}

.callout-title {
  @apply text-base font-semibold;
  color: var(--callout-title);
  letter-spacing: -0.01em;
}

.callout-toggle {
  @apply flex items-center justify-center w-8 h-8 rounded-lg;
  @apply transition-all duration-200;
  background: var(--wmd-bg-primary);
  opacity: 0.7;
}

.callout-toggle:hover {
  opacity: 1;
  background: var(--wmd-bg-secondary);
}

.callout-toggle.is-open {
  opacity: 1;
}

.callout-chevron {
  @apply w-5 h-5;
  color: var(--callout-icon);
  transition: transform var(--wmd-transition-spring);
}

.callout-toggle.is-open .callout-chevron {
  transform: rotate(180deg);
}

.callout-content {
  @apply overflow-hidden;
  background: var(--wmd-bg-primary);
}

.callout-content-inner {
  @apply px-5 py-4;
  color: var(--wmd-text-secondary);
  line-height: var(--wmd-leading-relaxed);
}

/* Transitions */
.callout-enter-active,
.callout-leave-active {
  transition: all var(--wmd-transition-base);
  max-height: 1000px;
}

.callout-enter-from,
.callout-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.callout-enter-to,
.callout-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

/* Dark mode adjustments */
[data-theme="dark"] .wmarkdown-callout {
  background: var(--wmd-bg-secondary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .callout-content {
  background: var(--wmd-bg-primary);
}

[data-theme="dark"] .callout-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
}

[data-theme="dark"] .callout-icon-wrapper,
[data-theme="dark"] .callout-toggle {
  background: var(--wmd-bg-tertiary);
}

/* Specific type variations */
.callout-danger .callout-icon-wrapper {
  @apply ring-2 ring-red-200;
}

.callout-warning .callout-icon-wrapper {
  @apply ring-2 ring-yellow-200;
}

.callout-success .callout-icon-wrapper {
  @apply ring-2 ring-green-200;
}

.callout-info .callout-icon-wrapper {
  @apply ring-2 ring-blue-200;
}

/* Content styling */
.callout-content :deep(p) {
  @apply mb-3 last:mb-0;
}

.callout-content :deep(ul),
.callout-content :deep(ol) {
  @apply my-2 ml-4;
}

.callout-content :deep(li) {
  @apply mb-1;
}

.callout-content :deep(a) {
  color: var(--callout-icon);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.callout-content :deep(a:hover) {
  opacity: 0.8;
}

.callout-content :deep(code) {
  @apply px-1.5 py-0.5 rounded text-sm font-mono;
  background: var(--wmd-bg-secondary);
  color: var(--callout-icon);
}
</style>
