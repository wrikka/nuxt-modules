<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Staff Management</h1>

    <div class="flex justify-end mb-4">
      <NuxtLink to="/admin/staff/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Staff Member
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center">Loading staff...</div>
    <div v-else-if="error" class="text-center text-red-500">Error loading staff: {{ error.message }}</div>
    
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffMembers" :key="staff.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ staff.name }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ staff.email }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-600 whitespace-no-wrap">{{ staff.role?.name || 'N/A' }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
              <NuxtLink :to="`/admin/staff/${staff.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: staffMembers, pending, error } = await useFetch('/api/staff');
</script>
