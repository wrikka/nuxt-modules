<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  member: { type: [Object, null], required: true },
  tiers: { type: Array, required: true },
  processing: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue", "save"]);
const localMember = ref({});
watch(() => props.member, (newVal) => {
  localMember.value = { ...newVal };
}, { immediate: true, deep: true });
const isEditing = computed(() => !!localMember.value.id);
const closeModal = () => {
  emit("update:modelValue", false);
};
const save = () => {
  emit("save", localMember.value);
};
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEditing ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E43\u0E2B\u0E21\u0E48" }}
      </h3>
      
      <form @submit.prevent="save">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
            <input
              v-model="localMember.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
            <input
              v-model="localMember.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input
              v-model="localMember.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ระดับสมาชิก</label>
            <select
              v-model="localMember.tierId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                {{ tier.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ processing ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01..." : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
