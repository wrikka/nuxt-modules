<script setup>
defineProps({
  registers: { type: Array, required: true },
  selectedRegister: { type: [Number, null], required: true },
  currentUser: { type: null, required: true }
});
const emit = defineEmits(["update:selectedRegister", "open-settings", "end-shift"]);
</script>

<template>
  <div class="bg-white shadow-sm border-b">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-900">Point of Sale</h1>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">เครื่องที่:</span>
          <select
            :value="selectedRegister"
            @change="emit('update:selectedRegister', parseInt($event.target.value))"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option v-for="register in registers" :key="register.id" :value="register.id">
              {{ register.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-sm">
          <span class="text-gray-600">พนักงาน:</span>
          <span class="font-medium">{{ currentUser.username }}</span>
        </div>
        <button
          @click="emit('open-settings')"
          class="p-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="mdi:cog" class="w-5 h-5" />
        </button>
        <button
          @click="emit('end-shift')"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          จบกะ
        </button>
      </div>
    </div>
  </div>
</template>
