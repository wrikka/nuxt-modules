<template>
  <component :is="tag" :class="headingClass">
    {{ text }}
  </component>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "Heading"
  },
  level: {
    type: Number,
    default: 1
  }
});
const tag = computed(() => `h${props.level}`);
const headingClass = computed(() => {
  switch (props.level) {
    case 1:
      return "text-4xl font-bold";
    case 2:
      return "text-3xl font-bold";
    case 3:
      return "text-2xl font-bold";
    case 4:
      return "text-xl font-bold";
    default:
      return "text-lg font-bold";
  }
});
</script>
