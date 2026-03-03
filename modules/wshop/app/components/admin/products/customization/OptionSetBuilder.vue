<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-semibold text-lg mb-4">{{ formTitle }}</h2>
    <div class="space-y-4">
      <div>
        <label for="set-name" class="block font-medium">Set Name</label>
        <input id="set-name" type="text" v-model="formData.name" placeholder="e.g., Apparel Options" class="w-full border rounded p-2" required />
      </div>
      <div>
        <h3 class="font-medium">Options</h3>
        <div class="p-4 border rounded bg-gray-50 space-y-2">
          <p class="text-gray-500">A full implementation would have dynamic option inputs here.</p>
          <textarea v-model="optionsString" class="w-full border rounded p-2 mt-2" placeholder="Enter options, one per line (e.g., Size, Color)"></textarea>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-6 space-x-4">
       <button type="button" @click="emit('cancel')" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</button>
      <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save Option Set</button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface OptionSet {
  id?: number;
  name: string;
  options: string[];
}

const props = defineProps<{
  optionSet?: OptionSet | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  name: '',
  options: [] as string[],
});

// Use a computed property with a setter to manage the textarea
const optionsString = computed({
  get: () => formData.value.options.join('\n'),
  set: (value) => {
    formData.value.options = value.split('\n').map(opt => opt.trim()).filter(opt => opt);
  },
});

const formTitle = computed(() => props.optionSet ? 'Edit Option Set' : 'Create New Option Set');

watch(() => props.optionSet, (newSet) => {
  if (newSet) {
    formData.value = { ...newSet };
  } else {
    formData.value = {
      name: '',
      options: [],
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
