<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Dynamic Pricing Rules</h1>
    <div class="flex justify-end mb-4">
      <button @click="showBuilder = true" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Add New Rule</button>
    </div>
    <AdminPricingPricingRuleList />
    <AdminPricingPricingRuleBuilder v-if="showBuilder" @submit="handleSaveRule" @cancel="showBuilder = false" />
  </div>
</template>

<script setup>
const showBuilder = ref(false);
const handleSaveRule = (ruleData) => {
  console.log("Saving rule:", ruleData);
  showBuilder.value = false;
  alert("Rule saved!");
};
definePageMeta({
  layout: "admin"
});
</script>
