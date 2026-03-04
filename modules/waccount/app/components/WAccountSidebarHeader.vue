<script setup lang="ts">
interface Props {
  user: UserProfile | null;
}

defineProps<Props>();
</script>

<template>
  <div class="border-b border-gray-200 p-4 dark:border-gray-800">
    <div class="flex items-center gap-3">
      <AtomsAvatar
        :src="user?.avatar || undefined"
        :alt="user?.name || user?.email || 'Guest'"
        size="md"
        :fallback-icon="user?.avatar ? undefined : 'mdi:account'"
        class="bg-gradient-to-br from-blue-500 to-purple-600"
      />
      <div class="flex-1 min-w-0">
        <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
          {{ user?.name || user?.email || "Guest" }}
        </p>
        <p
          v-if="user?.email && user?.name"
          class="truncate text-xs text-gray-500 dark:text-gray-400"
        >
          {{ user.email }}
        </p>
      </div>
    </div>
  </div>
</template>
