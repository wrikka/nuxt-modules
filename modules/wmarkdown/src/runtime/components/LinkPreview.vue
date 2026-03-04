<script setup lang="ts">
import { useLinkPreview } from '../../composables/useLinkPreview'

interface Props {
  href: string
  text: string
}

const props = defineProps<Props>()

const { preview, isLoading, fetchPreview, clearPreview } = useLinkPreview()
const showPreview = ref(false)
const previewTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const handleMouseEnter = async () => {
  previewTimeout.value = setTimeout(async () => {
    showPreview.value = true
    await fetchPreview(props.href)
  }, 300)
}

const handleMouseLeave = () => {
  if (previewTimeout.value) {
    clearTimeout(previewTimeout.value)
    previewTimeout.value = null
  }
  showPreview.value = false
  clearPreview()
}
</script>

<template>
  <span class="link-preview-wrapper">
    <a
      :href="href"
      class="link"
      target="_blank"
      rel="noopener"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      {{ text }}
    </a>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showPreview"
        class="link-preview-card"
        @mouseenter="showPreview = true"
        @mouseleave="handleMouseLeave"
      >
        <div
          v-if="isLoading"
          class="preview-loading"
        >
          <div class="loading-spinner" />
          <span>Loading preview...</span>
        </div>

        <template v-else-if="preview">
          <img
            v-if="preview.image"
            :src="preview.image"
            :alt="preview.title"
            class="preview-image"
          >
          <div class="preview-content">
            <h4
              v-if="preview.title"
              class="preview-title"
            >
              {{ preview.title }}
            </h4>
            <p
              v-if="preview.description"
              class="preview-description"
            >
              {{ preview.description }}
            </p>
            <span class="preview-url">{{ preview.url }}</span>
          </div>
        </template>

        <div
          v-else
          class="preview-error"
        >
          <Icon
            name="lucide:link"
            class="error-icon"
          />
          <span>{{ href }}</span>
        </div>
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.link-preview-wrapper {
  @apply relative inline-block;
}

.link {
  @apply underline decoration-2 underline-offset-2;
  color: var(--wmd-primary-600);
  transition: all var(--wmd-transition-fast);
}

.link:hover {
  color: var(--wmd-primary-700);
  text-decoration-color: var(--wmd-primary-400);
}

.link-preview-card {
  @apply absolute z-50 left-0 top-full mt-2 w-80 rounded-xl overflow-hidden;
  background: var(--wmd-bg-primary);
  border: 1px solid var(--wmd-border-light);
  box-shadow: var(--wmd-shadow-xl), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: wmd-scale-in var(--wmd-transition-spring);
  backdrop-filter: blur(12px);
}

[data-theme="dark"] .link-preview-card {
  background: rgba(30, 41, 59, 0.95);
  border-color: var(--wmd-border-default);
}

.preview-loading {
  @apply flex items-center gap-3 p-5;
  color: var(--wmd-text-muted);
}

.loading-spinner {
  @apply w-5 h-5 border-2 border-t-transparent rounded-full;
  border-color: var(--wmd-primary-500);
  border-top-color: transparent;
  animation: wmd-spin 1s linear infinite;
}

.preview-image {
  @apply w-full h-40 object-cover;
  transition: transform var(--wmd-transition-base);
}

.link-preview-card:hover .preview-image {
  transform: scale(1.02);
}

.preview-content {
  @apply p-4;
  background: var(--wmd-bg-primary);
}

.preview-title {
  @apply font-semibold mb-2 line-clamp-2;
  color: var(--wmd-text-primary);
  font-size: var(--wmd-text-base);
  line-height: var(--wmd-leading-tight);
}

.preview-description {
  @apply text-sm line-clamp-2 mb-3;
  color: var(--wmd-text-secondary);
  line-height: var(--wmd-leading-relaxed);
}

.preview-url {
  @apply text-xs truncate flex items-center gap-1;
  color: var(--wmd-text-muted);
  font-family: var(--wmd-font-mono);
}

.preview-url::before {
  content: '';
  @apply w-2 h-2 rounded-full;
  background: var(--wmd-success-500);
}

.preview-error {
  @apply flex items-center gap-3 p-5;
  color: var(--wmd-text-muted);
  background: var(--wmd-bg-secondary);
}

.error-icon {
  @apply w-5 h-5;
  color: var(--wmd-text-muted);
}

/* Loading skeleton animation */
.preview-skeleton {
  @apply animate-pulse;
}

.preview-skeleton .preview-image {
  @apply bg-gray-200;
}

.preview-skeleton .preview-title {
  @apply h-5 bg-gray-200 rounded mb-2;
  width: 80%;
}

.preview-skeleton .preview-description {
  @apply h-4 bg-gray-200 rounded mb-2;
  width: 100%;
}

.preview-skeleton .preview-description:last-of-type {
  width: 60%;
}
</style>
