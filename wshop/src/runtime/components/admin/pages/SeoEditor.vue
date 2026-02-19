<template>
  <div class="p-4 border-t">
    <h3 class="text-lg font-semibold mb-4">Search Engine Listing Preview</h3>
    <div class="mb-4 p-2 border rounded">
      <div class="text-blue-700 text-lg font-medium truncate">{{ metaTitle || title || 'Untitled Page' }}</div>
      <div class="text-green-600 text-sm">{{ siteUrl }}/{{ slug || 'url-slug' }}</div>
      <p class="text-gray-600 text-sm">{{ metaDescription || 'No meta description yet.' }}</p>
    </div>

    <div class="space-y-4">
      <div>
        <label for="meta-title" class="block text-sm font-medium text-gray-700">Meta Title</label>
        <input 
          id="meta-title" 
          type="text" 
          :value="metaTitle" 
          @input="$emit('update:metaTitle', ($event.target as HTMLInputElement).value)" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter meta title"
        >
      </div>
      <div>
        <label for="meta-description" class="block text-sm font-medium text-gray-700">Meta Description</label>
        <textarea 
          id="meta-description" 
          :value="metaDescription" 
          @input="$emit('update:metaDescription', ($event.target as HTMLInputElement).value)" 
          rows="3" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter meta description"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Assuming a siteUrl is available, perhaps from config
const siteUrl = 'https://your-store.com';

defineProps<{ 
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}>();

defineEmits(['update:metaTitle', 'update:metaDescription']);
</script>
