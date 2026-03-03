<script setup lang="ts">
const emit = defineEmits(["close"]);
const { createTask } = useTaskApi();
const title = ref("");

async function _handleCreateTask() {
	if (!title.value.trim()) return;
	await createTask(title.value);
	title.value = "";
	emit("close");
}
</script>

<template>
  <BaseModal ~/close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-100">Create new task</h2>
    </template>
    <form ~/submit.prevent="_handleCreateTask">
      <div class="mb-4">
        <label for="title" class="mb-2 block text-sm font-medium text-gray-300">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="What needs to be done?"
          class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          autofocus
        />
      </div>
    </form>
    <template #footer>
      <button ~/click="emit('close')" type="button" class="inline-flex items-center gap-2 rounded-md bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/80 transition">
        <Icon name="mdi:close" />
        Cancel
      </button>
      <button ~/click="_handleCreateTask" type="submit" class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!title.trim()">
        <Icon name="mdi:plus" />
        Create Task
      </button>
    </template>
  </BaseModal>
</template>
