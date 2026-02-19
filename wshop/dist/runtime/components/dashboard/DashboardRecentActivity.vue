<template>
  <section v-if="activities?.length">
    <RecentActivityTable :activities="activities" />
  </section>

  <div v-else class="text-center py-12">
    <UIcon name="i-mdi-chart-line" class="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      No recent activity
    </h3>
    <p class="text-gray-500 dark:text-gray-400">
      Start making sales or updates to see activity here.
    </p>
  </div>
</template>

<script setup>
defineProps({
  activities: { type: [Array, null], required: true }
});
</script>
