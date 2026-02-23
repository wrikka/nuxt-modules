<script setup lang="ts">
const _props = defineProps<{
	cellAddress: string;
	cellValue: string;
}>();

const emit = defineEmits<(e: "update:cellValue", value: string) => void>();

const _onInput = (event: Event) => {
	emit("update:cellValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="flex items-center p-1 px-2 border-b border-gray-300 bg-gray-50">
    <div class="p-1 px-2 min-w-60px text-center">{{ cellAddress || 'A1' }}</div>
    <div class="p-1 px-2 text-gray-500">fx</div>
    <input 
      type="text" 
      class="flex-grow border border-gray-300 outline-none p-1 bg-white focus:border-orange-600"
      :value="cellValue" 
      @input="_onInput"
    />
  </div>
</template>
