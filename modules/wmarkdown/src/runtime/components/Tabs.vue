<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon?: string
}

interface Props {
  tabs: Tab[]
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  change: [tabId: string]
}>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  emit('change', tabId)
}
</script>

<template>
  <div
    class="wmarkdown-tabs"
    :class="`tabs-${variant}`"
  >
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ 'tab-active': activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        <Icon
          v-if="tab.icon"
          :name="tab.icon"
          class="tab-icon"
        />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="tabs-content">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="activeTab === tab.id"
        class="tab-panel"
      >
        <slot
          :name="tab.id"
          :tab="tab"
        >
          <slot :tab="tab" />
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wmarkdown-tabs {
  @apply my-6;
}

.tabs-header {
  @apply flex gap-1 p-1 rounded-xl;
  background: var(--wmd-bg-secondary);
  border: 1px solid var(--wmd-border-light);
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg relative;
  @apply transition-all duration-200;
  color: var(--wmd-text-secondary);
}

.tab-button:hover {
  color: var(--wmd-text-primary);
  background: var(--wmd-bg-primary);
}

.tab-button.tab-active {
  @apply shadow-sm;
  background: var(--wmd-bg-primary);
  color: var(--wmd-primary-600);
}

.tab-icon {
  @apply w-4 h-4;
  transition: transform var(--wmd-transition-fast);
}

.tab-button:hover .tab-icon {
  transform: scale(1.1);
}

.tabs-content {
  @apply mt-4;
  animation: wmd-fade-in-up var(--wmd-transition-base);
}

.tab-panel {
  @apply p-4 rounded-xl;
  background: var(--wmd-bg-primary);
  border: 1px solid var(--wmd-border-light);
}

/* Pills variant */
.tabs-pills .tabs-header {
  @apply border-none gap-2 p-0 bg-transparent;
}

.tabs-pills .tab-button {
  @apply rounded-full px-5 py-2;
  background: transparent;
  border: 1px solid transparent;
}

.tabs-pills .tab-button:hover {
  background: var(--wmd-bg-secondary);
  border-color: var(--wmd-border-light);
}

.tabs-pills .tab-button.tab-active {
  @apply shadow-md;
  background: var(--wmd-primary-500);
  color: white;
  border-color: var(--wmd-primary-500);
}

/* Underline variant */
.tabs-underline .tabs-header {
  @apply rounded-none p-0 bg-transparent border-b border-t-0 border-l-0 border-r-0;
  border-color: var(--wmd-border-light);
}

.tabs-underline .tab-button {
  @apply rounded-none px-4 py-3 border-b-2 border-transparent;
  background: transparent;
}

.tabs-underline .tab-button:hover {
  background: var(--wmd-bg-secondary);
  border-bottom-color: var(--wmd-border-strong);
}

.tabs-underline .tab-button.tab-active {
  @apply shadow-none;
  background: transparent;
  border-bottom-color: var(--wmd-primary-500);
  color: var(--wmd-primary-600);
}

/* Dark mode adjustments */
[data-theme="dark"] .tabs-header {
  background: var(--wmd-bg-tertiary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .tab-button:hover {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .tab-button.tab-active {
  background: var(--wmd-bg-secondary);
}

[data-theme="dark"] .tab-panel {
  background: var(--wmd-bg-secondary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .tabs-pills .tabs-header {
  background: transparent;
}

[data-theme="dark"] .tabs-pills .tab-button:hover {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .tabs-underline .tabs-header {
  background: transparent;
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .tabs-underline .tab-button:hover {
  background: var(--wmd-bg-tertiary);
}
</style>
