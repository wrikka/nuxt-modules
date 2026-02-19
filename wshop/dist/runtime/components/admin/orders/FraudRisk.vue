<script setup>
const props = defineProps({
  outcome: { type: null, required: true }
});
const riskLevelClasses = computed(() => {
  if (!props.outcome) return "bg-gray-100 text-gray-800";
  switch (props.outcome.risk_level) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "elevated":
      return "bg-yellow-100 text-yellow-800";
    case "highest":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});
const formattedRiskLevel = computed(() => {
  return props.outcome?.risk_level?.replace("_", " ") || "N/A";
});
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h3 class="text-xl font-bold mb-4">Fraud Analysis</h3>
    <div v-if="outcome" class="space-y-3">
      <div>
        <span class="font-semibold">Risk Level:</span>
        <span :class="riskLevelClasses" class="ml-2 px-2 py-1 text-sm font-medium rounded-full capitalize">
          {{ formattedRiskLevel }}
        </span>
      </div>
      <div>
        <span class="font-semibold">Risk Score:</span>
        <span class="ml-2">{{ outcome.risk_score }}/99</span>
      </div>
      <div>
        <span class="font-semibold">Reason:</span>
        <span class="ml-2 text-gray-700">{{ outcome.reason || "No specific reason provided." }}</span>
      </div>
       <div>
        <span class="font-semibold">Network Status:</span>
        <span class="ml-2 text-gray-700 capitalize">{{ outcome.network_status?.replace("_", " ") || "N/A" }}</span>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No fraud analysis data available for this payment.</p>
    </div>
  </div>
</template>
