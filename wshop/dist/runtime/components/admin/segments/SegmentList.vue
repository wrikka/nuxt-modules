<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rules</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="segment in segments" :key="segment.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ segment.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ segment.description }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatRules(segment.rules) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <NuxtLink :to="`/admin/segments/${segment.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
            <button @click="$emit('delete', segment.id)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  segments: { type: Array, required: true }
});
defineEmits(["delete"]);
const formatRules = (rules) => {
  if (!rules || rules.length === 0) return "No rules defined";
  return rules.map((r) => `${r.field} ${r.operator} ${r.value}`).join(", ");
};
</script>
