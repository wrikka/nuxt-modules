<script setup>
defineProps({
  customer: { type: null, required: true }
});
const emit = defineEmits(["select"]);
const select = (customer) => {
  emit("select", customer);
};
</script>

<template>
  <div
    @click="select(customer)"
    class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
  >
    <div class="flex items-center">
      <img 
        :src="customer.avatar || '/default-avatar.png'" 
        :alt="customer.firstName"
        class="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div class="font-medium">
          {{ customer.firstName }} {{ customer.lastName }}
        </div>
        <div class="text-sm text-gray-600">
          {{ customer.email || customer.phone }}
        </div>
      </div>
    </div>
  </div>
</template>
