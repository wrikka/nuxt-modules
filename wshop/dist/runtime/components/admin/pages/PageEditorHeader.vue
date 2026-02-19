<template>
  <header class="bg-white border-b p-4 flex justify-between items-center">
    <div>
      <div class="flex flex-col">
        <input type="text" :value="title" @input="$emit('update:title', $event.target.value)" placeholder="Page Title" class="text-xl font-bold border-none focus:ring-0 p-0">
        <div class="flex items-center">
          <span class="text-sm text-gray-500">/</span>
          <input type="text" :value="slug" @input="$emit('update:slug', $event.target.value)" placeholder="url-slug" class="text-sm border-none focus:ring-0 p-0 text-gray-600">
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <button @click="$emit('save')" class="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
      <NuxtLink to="/admin/pages" class="text-gray-600">Exit</NuxtLink>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  slug: { type: String, required: true }
});
defineEmits(["update:title", "update:slug", "save"]);
</script>
