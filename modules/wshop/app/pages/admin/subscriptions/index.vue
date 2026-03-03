<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Subscription Plans</h1>
    <div class="flex justify-end mb-4">
      <button @click="showForm = true" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Create New Plan</button>
    </div>
    <AdminSubscriptionsSubscriptionPlanList />
    <AdminSubscriptionsSubscriptionPlanForm v-if="showForm" @submit="handleSavePlan" @cancel="showForm = false" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
const showForm = ref(false);

const handleSavePlan = (planData: any) => {
  console.log('Saving plan:', planData);
  // API call to save the plan
  showForm.value = false;
  alert('Plan saved!');
};

definePageMeta({
  layout: 'admin',
});
</script>
