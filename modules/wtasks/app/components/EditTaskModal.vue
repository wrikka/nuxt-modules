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
  <BaseModal ~/close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-100">Edit Task #{{ task.id }}</h2>
    </template>
        <form ~/submit.prevent="handleUpdateTask" class="space-y-4">
      <div>
        <label for="edit-title" class="mb-2 block text-sm font-medium text-gray-300">Title</label>
        <input
          id="edit-title"
          v-model="editableTask.title"
          type="text"
          class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label for="edit-description" class="mb-2 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="edit-description"
          v-model="editableTask.description"
          rows="4"
          class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        ></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="edit-status" class="mb-2 block text-sm font-medium text-gray-300">Status</label>
          <select id="edit-status" v-model="editableTask.status" class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label for="edit-priority" class="mb-2 block text-sm font-medium text-gray-300">Priority</label>
          <select id="edit-priority" v-model="editableTask.priority" class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition">
            <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>
      <div>
        <label for="edit-assignee" class="mb-2 block text-sm font-medium text-gray-300">Assignee</label>
        <select id="edit-assignee" v-model="selectedAssigneeName" class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition">
          <option :value="undefined">Unassigned</option>
          <option v-for="a in allAssignees" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </form>
    <template #footer>
      <button ~/click="emit('close')" type="button" class="rounded-md bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/80 transition">
        Cancel
      </button>
      <button ~/click="handleUpdateTask" type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition">
        Save Changes
      </button>
    </template>
  </BaseModal>
</template>
