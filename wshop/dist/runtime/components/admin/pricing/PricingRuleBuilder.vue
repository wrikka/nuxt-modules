<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow mt-6">
    <h2 class="font-semibold text-lg mb-4">{{ formTitle }}</h2>
    <div class="space-y-4">
      <div>
        <label for="rule-name" class="block font-medium">Rule Name</label>
        <input id="rule-name" type="text" v-model="formData.name" placeholder="e.g., Weekend Flash Sale" class="w-full border rounded p-2" required />
      </div>
      <div>
        <h3 class="font-medium">Conditions (IF)</h3>
        <div class="p-4 border rounded bg-gray-50">
          <!-- A full implementation would have dynamic component rendering here -->
          <p class="text-gray-500">Condition builder UI is not yet implemented.</p>
          <textarea v-model="formData.conditions" class="w-full border rounded p-2 mt-2" placeholder="Describe conditions..."></textarea>
        </div>
      </div>
      <div>
        <h3 class="font-medium">Actions (THEN)</h3>
        <div class="p-4 border rounded bg-gray-50">
          <!-- A full implementation would have dynamic component rendering here -->
          <p class="text-gray-500">Action builder UI is not yet implemented.</p>
          <textarea v-model="formData.action" class="w-full border rounded p-2 mt-2" placeholder="Describe actions..."></textarea>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-6 space-x-4">
      <button type="button" @click="emit('cancel')" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</button>
      <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save Rule</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  rule: { type: [Object, null], required: false }
});
const emit = defineEmits(["submit", "cancel"]);
const formData = ref({
  name: "",
  conditions: "",
  action: ""
});
const formTitle = computed(() => props.rule ? "Edit Rule" : "Create New Rule");
watch(() => props.rule, (newRule) => {
  if (newRule) {
    formData.value = { ...newRule };
  } else {
    formData.value = {
      name: "",
      conditions: "",
      action: ""
    };
  }
}, { immediate: true });
const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>
