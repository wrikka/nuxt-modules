<script setup>
import CustomerForm from "./CustomerForm.vue";
import CustomerListItem from "./CustomerListItem.vue";
const emit = defineEmits(["close", "select"]);
const searchQuery = ref("");
const showAddForm = ref(false);
const customers = ref([
  {
    id: "1",
    name: "\u0E2A\u0E21\u0E0A\u0E32\u0E22 \u0E43\u0E08\u0E14\u0E35",
    email: "somchai@example.com",
    phone: "0812345678"
  },
  {
    id: "2",
    name: "\u0E2A\u0E34\u0E23\u0E34\u0E1E\u0E23 \u0E23\u0E31\u0E15\u0E19\u0E32",
    email: "siriporn@example.com",
    phone: "0823456789"
  }
]);
const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value;
  const query = searchQuery.value.toLowerCase();
  return customers.value.filter(
    (customer) => customer.name?.toLowerCase().includes(query) || customer.email?.toLowerCase().includes(query) || customer.phone?.includes(query)
  );
});
const selectCustomer = (customer) => {
  emit("select", customer);
};
const selectWalkInCustomer = () => {
  const walkInCustomer = {
    id: "0",
    name: "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B",
    email: "",
    phone: ""
  };
  emit("select", walkInCustomer);
};
const addCustomer = async (customerData) => {
  try {
    const maxId = customers.value.reduce((max, c) => {
      const idNum = parseInt(c.id) || 0;
      return idNum > max ? idNum : max;
    }, 0);
    const newId = String(maxId + 1);
    const customer = {
      id: newId,
      ...customerData
    };
    customers.value.push(customer);
    selectCustomer(customer);
    showAddForm.value = false;
  } catch (_error) {
    console.error("Failed to add customer:", _error);
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">เลือกลูกค้า</h3>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Search Customer -->
      <div class="mb-4">
        <div class="relative">
          <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาลูกค้า..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Quick Add Customer -->
      <div class="mb-4">
        <button
          @click="showAddForm = !showAddForm"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Icon name="mdi:plus" class="w-4 h-4 inline mr-2" />
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      <!-- Add Customer Form -->
      <CustomerForm 
        v-if="showAddForm" 
        class="mb-4"
        @save="addCustomer"
        @cancel="showAddForm = false"
      />

      <!-- Customer List -->
      <div class="space-y-2">
        <CustomerListItem
          v-for="customer in filteredCustomers"
          :key="customer.id"
          :customer="customer"
          @select="selectCustomer"
        />
      </div>

      <!-- Walk-in Customer -->
      <div
        @click="selectWalkInCustomer"
        class="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer text-center"
      >
        <p class="text-gray-600">ลูกค้าทั่วไป (Walk-in)</p>
      </div>
    </div>
  </div>
</template>
