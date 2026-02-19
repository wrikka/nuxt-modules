<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-semibold text-lg mb-4">{{ formTitle }}</h2>
    <div class="space-y-4">
      <div>
        <label for="plan-name" class="block font-medium">Plan Name</label>
        <input id="plan-name" type="text" v-model="formData.name" class="w-full border rounded p-2" required />
      </div>
      <div>
        <label for="plan-price" class="block font-medium">Price</label>
        <input id="plan-price" type="number" v-model="formData.price" class="w-full border rounded p-2" required />
      </div>
      <div>
        <label for="plan-interval" class="block font-medium">Billing Interval</label>
        <select id="plan-interval" v-model="formData.interval" class="w-full border rounded p-2" required>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
    </div>
    <div class="mt-6 flex justify-end space-x-4">
      <button type="button" @click="emit('cancel')" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</button>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Plan</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  plan: { type: [Object, null], required: false }
});
const emit = defineEmits(["submit", "cancel"]);
const formData = ref({
  name: "",
  price: 0,
  interval: "month"
});
const formTitle = computed(() => props.plan ? "Edit Plan" : "Create New Plan");
watch(() => props.plan, (newPlan) => {
  if (newPlan) {
    formData.value = { ...newPlan };
  } else {
    formData.value = {
      name: "",
      price: 0,
      interval: "month"
    };
  }
}, { immediate: true });
const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>
