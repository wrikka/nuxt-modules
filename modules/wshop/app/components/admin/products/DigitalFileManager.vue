<script setup lang="ts">
interface DigitalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

const props = defineProps<{ 
  productId: string;
  files: DigitalFile[];
}>();

const emit = defineEmits(['update']);

const newFile = ref({ fileName: '', fileUrl: '' });
const isLoading = ref(false);
const error = ref<string | null>(null);

const addFile = async () => {
  if (!newFile.value.fileName || !newFile.value.fileUrl) {
    error.value = 'File Name and URL are required.';
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    await $fetch(`/api/products/${props.productId}/digital-files`, {
      method: 'POST',
      body: newFile.value,
    });
    newFile.value = { fileName: '', fileUrl: '' };
    emit('update');
  } catch (err: unknown) {
    const h3Error = err as { data?: { message?: string } };
    error.value = h3Error.data?.message || 'Failed to add file.';
  } finally {
    isLoading.value = false;
  }
};

const deleteFile = async (fileId: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return;
  try {
    await $fetch(`/api/products/${props.productId}/digital-files`, {
      method: 'DELETE',
      body: { fileId },
    });
    emit('update');
  } catch (err: unknown) {
    const h3Error = err as { data?: { message?: string } };
    alert(h3Error.data?.message || 'Failed to delete file.');
  }
};

</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md mt-8">
    <h3 class="text-xl font-bold mb-4">Digital Files</h3>

    <!-- Existing Files -->
    <div v-if="files.length > 0" class="space-y-2 mb-6">
      <div v-for="file in files" :key="file.id" class="p-3 bg-gray-50 rounded border flex justify-between items-center">
        <a :href="file.fileUrl" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">{{ file.fileName }}</a>
        <button @click="deleteFile(file.id)" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
      </div>
    </div>
    <p v-else class="text-gray-500 mb-4">No files attached to this product yet.</p>

    <!-- Add New File Form -->
    <form @submit.prevent="addFile" class="border-t pt-4 space-y-4">
      <h4 class="font-semibold">Add a new file</h4>
      <div>
        <label for="fileName" class="block text-sm font-medium text-gray-700">File Name</label>
        <input id="fileName" v-model="newFile.fileName" type="text" placeholder="e.g., E-book Chapter 1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div>
        <label for="fileUrl" class="block text-sm font-medium text-gray-700">File URL</label>
        <input id="fileUrl" v-model="newFile.fileUrl" type="url" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <button type="submit" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
        {{ isLoading ? 'Adding...' : 'Add File' }}
      </button>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </form>
  </div>
</template>
