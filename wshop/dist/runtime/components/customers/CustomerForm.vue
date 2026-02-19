<script setup>
const newCustomer = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});
const emit = defineEmits(["save", "cancel"]);
const saveCustomer = () => {
  emit("save", newCustomer.value);
};
const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <h4 class="font-medium mb-3">เพิ่มลูกค้าใหม่</h4>
    <form @submit.prevent="saveCustomer">
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
          <input
            v-model="newCustomer.firstName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
          <input
            v-model="newCustomer.lastName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
          <input
            v-model="newCustomer.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
          <input
            v-model="newCustomer.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div class="flex space-x-2 mt-3">
        <button
          type="button"
          @click="cancel"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          เพิ่ม
        </button>
      </div>
    </form>
  </div>
</template>
