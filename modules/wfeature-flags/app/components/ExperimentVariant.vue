<script setup lang="ts">
import { computed } from '#imports';

const props = defineProps<{
  experiment: string;
}>();

const { variant, isActive, isControl, payload } = useExperiment(props.experiment);
</script>

<template>
  <div v-if="isActive" class="experiment-variant">
    <slot
      :variant="variant"
      :is-control="isControl"
      :payload="payload"
    />
  </div>
</template>
