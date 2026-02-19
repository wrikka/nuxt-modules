<template>
  <div class="flex items-center space-x-1">
    <button type="button" v-for="i in 5" :key="i" @click="setRating(i)" class="focus:outline-none">
      <Icon name="lucide:star" class="w-6 h-6" :class="i <= modelValue ? 'text-yellow-400' : 'text-gray-300'" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true }
});
const emit = defineEmits(["update:modelValue"]);
const setRating = (rating) => {
  emit("update:modelValue", rating);
};
</script>
