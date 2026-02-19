<template>
  <a :href="href" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4">
    {{ text }}
  </a>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "Button"
  },
  href: {
    type: String,
    default: "#"
  }
});
</script>
