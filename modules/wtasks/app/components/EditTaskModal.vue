<script setup lang="ts">
import type { Task } from '~/shared/types/task';
import { StatusSchema, PrioritySchema } from '~/shared/types/task';

const props = defineProps<{ task: Task }>();
const emit = defineEmits(["close"]);

const { updateTask } = useTaskApi();
const { allAssignees } = useTaskData();
const statuses = StatusSchema.options;
const priorities = PrioritySchema.options;
const editableTask = ref<Partial<Task>>({ ...props.task });

// When updating assignee, the object must be handled correctly
const selectedAssigneeName = ref(props.task.assignee?.name);
watch(selectedAssigneeName, (newName) => {
  if (newName) {
    const assignee = { name: newName, avatarUrl: `https://i.pravatar.cc/150?u=${newName}` };
    editableTask.value.assignee = assignee;
  } else {
    editableTask.value.assignee = undefined;
  }
});

async function handleUpdateTask() {
	if (!editableTask.value.title?.trim()) return;
	await updateTask(editableTask.value);
	emit("close");
}
</script>

<template>
  <MoleculesDialog @close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold">Edit Task #{{ task.id }}</h2>
    </template>
        <form @submit.prevent="handleUpdateTask" class="space-y-4">
      <div>
        <label for="edit-title" class="mb-2 block text-sm font-medium">Title</label>
        <input
          id="edit-title"
          v-model="editableTask.title"
          type="text"
          class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
        />
      </div>
      <div>
        <label for="edit-description" class="mb-2 block text-sm font-medium">Description</label>
        <textarea
          id="edit-description"
          v-model="editableTask.description"
          rows="4"
          class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
        ></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="edit-status" class="mb-2 block text-sm font-medium">Status</label>
          <select id="edit-status" v-model="editableTask.status" class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label for="edit-priority" class="mb-2 block text-sm font-medium">Priority</label>
          <select id="edit-priority" v-model="editableTask.priority" class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition">
            <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>
      <div>
        <label for="edit-assignee" class="mb-2 block text-sm font-medium">Assignee</label>
        <select id="edit-assignee" v-model="selectedAssigneeName" class="w-full rounded border bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition">
          <option :value="undefined">Unassigned</option>
          <option v-for="a in allAssignees" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </form>
    <template #footer>
      <AtomsButton variant="ghost" @click="emit('close')">
        Cancel
      </AtomsButton>
      <AtomsButton @click="handleUpdateTask">
        Save Changes
      </AtomsButton>
    </template>
  </MoleculesDialog>
</template>
