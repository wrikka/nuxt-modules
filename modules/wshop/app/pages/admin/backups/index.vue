<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Backups</h1>

    <div class="flex gap-4 mb-6">
      <button
        @click="createBackup"
        :disabled="isCreating"
        class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        {{ isCreating ? 'Creating...' : 'Create Backup' }}
      </button>
    </div>

    <div v-if="pending" class="text-center py-8">Loading...</div>

    <div v-else-if="error" class="text-red-500">Failed to load backups</div>

    <div v-else-if="backups.length === 0" class="text-gray-500 text-center py-8">
      No backups yet. Create your first backup to protect your data.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="backup in backups"
        :key="backup.path"
        class="bg-white p-4 rounded-lg shadow flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold mb-1">{{ formatDate(backup.createdAt) }}</h3>
          <p class="text-sm text-gray-600">Size: {{ formatSize(backup.size) }}</p>
          <p class="text-xs text-gray-500">{{ backup.path }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="restoreBackup(backup.path)"
            class="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Restore
          </button>
          <button
            @click="deleteBackup(backup.path)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Backup {
  path: string;
  createdAt: string;
  size: number;
}
const { data: backups, pending, error, refresh } = await useFetch<Backup[]>('/api/backups', { default: () => [] });

const isCreating = ref(false);

const createBackup = async () => {
  isCreating.value = true;
  try {
    await $fetch('/api/backups', { method: 'POST' });
    await refresh();
  } catch (error) {
    console.error('Failed to create backup:', error);
  } finally {
    isCreating.value = false;
  }
};

const restoreBackup = async (backupPath: string) => {
  if (!confirm('This will replace your current database. Are you sure?')) return;
  
  try {
    await $fetch('/api/backups/restore', {
      method: 'POST',
      body: { path: backupPath },
    });
    alert('Database restored successfully');
  } catch (error) {
    console.error('Failed to restore backup:', error);
    alert('Failed to restore backup');
  }
};

const deleteBackup = async (backupPath: string) => {
  if (!confirm('Are you sure you want to delete this backup?')) return;
  
  try {
    await $fetch('/api/backups/delete', {
      method: 'POST',
      body: { path: backupPath },
    });
    await refresh();
  } catch (error) {
    console.error('Failed to delete backup:', error);
    alert('Failed to delete backup');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const formatSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
</script>
