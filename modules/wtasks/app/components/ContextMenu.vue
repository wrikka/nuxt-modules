<script setup lang="ts">
defineProps<{
	x: number;
	y: number;
	options: { label: string; action: () => void }[];
}>();

const model = defineModel<boolean>();
const menu = ref<HTMLElement | null>(null);

onClickOutside(menu, () => {
	model.value = false;
});

function handleAction(action: () => void) {
	action();
	model.value = false;
}
</script>

<template>
  <div
    v-if="model"
    ref="menu"
    class="fixed bg-[#1a1a1c] border border-gray-700 rounded-md shadow-lg p-2 z-50 text-sm"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <ul>
      <li
        v-for="(option, index) in options"
        :key="index"
        class="px-3 py-1.5 hover:bg-gray-700/80 rounded-md cursor-pointer"
        ~/click="handleAction(option.action)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
