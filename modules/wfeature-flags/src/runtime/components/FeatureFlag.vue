<script setup lang="ts">
import { computed } from '#imports';

const props = defineProps<{
  flag: string;
  fallback?: boolean;
}>();

const { isEnabled } = useFeatureFlags();

const enabled = computed(() => isEnabled(props.flag) ?? props.fallback ?? false);
</script>

<template>
  <slot v-if="enabled" name="enabled" />
  <slot v-else name="disabled" />
  <slot v-if="enabled" />
</template>
