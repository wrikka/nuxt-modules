<template>
  <aside class="w-64 bg-gray-100 p-4 overflow-y-auto">
    <h3 class="text-lg font-semibold mb-4">Components</h3>
    <div class="space-y-2">
      <div v-for="block in availableBlocks" :key="block.type" @click="$emit('add-block', block.type)" class="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50">
        {{ block.name }}
      </div>
    </div>
  </aside>
</template>

<script setup>
const availableBlocks = [
  { type: "Heading", name: "Heading", defaultProps: { text: "New Heading", level: 1 } },
  { type: "Paragraph", name: "Paragraph", defaultProps: { text: "Some paragraph text." } },
  { type: "Button", name: "Button", defaultProps: { text: "Click me", href: "#" } }
];
defineEmits(["add-block"]);
</script>
