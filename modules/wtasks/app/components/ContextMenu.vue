<script setup lang="ts">
import type { ContextMenuOption } from '#wui/components'

const props = defineProps<{
  x: number;
  y: number;
  options: { label: string; action: () => void }[];
}>();

const model = defineModel<boolean>();

// Convert simple options to ContextMenuOption format
const menuOptions = computed<ContextMenuOption[]>(() =>
  props.options.map(opt => ({
    label: opt.label,
    action: opt.action
  }))
);
</script>

<template>
  <MoleculesContextMenu
    v-model="model"
    :x="x"
    :y="y"
    :options="menuOptions"
  />
</template>
