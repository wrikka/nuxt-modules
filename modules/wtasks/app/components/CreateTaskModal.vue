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
  <MoleculesDialog @close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold">Create new task</h2>
    </template>
    <form @submit.prevent="_handleCreateTask">
      <div class="mb-4">
        <label for="title" class="mb-2 block text-sm font-medium">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="What needs to be done?"
          class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
          autofocus
        />
      </div>
    </form>
    <template #footer>
      <AtomsButton variant="ghost" @click="emit('close')">
        <Icon name="mdi:close" />
        Cancel
      </AtomsButton>
      <AtomsButton :disabled="!title.trim()" @click="_handleCreateTask">
        <Icon name="mdi:plus" />
        Create Task
      </AtomsButton>
    </template>
  </MoleculesDialog>
</template>
