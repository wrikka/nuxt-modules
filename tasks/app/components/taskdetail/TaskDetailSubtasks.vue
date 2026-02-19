<script setup lang="ts">
import type { Task, Subtask } from '~/shared/types/task';

const props = defineProps<{ task: Task }>();

const { updateTask } = useTaskApi();

const newSubtaskTitle = ref('');

const subtasks = ref<Subtask[]>(props.task.subtasks || []);

const completedSubtasks = computed(() => subtasks.value.filter(s => s.completed).length);
const progress = computed(() => {
    if (subtasks.value.length === 0) return 0;
    return (completedSubtasks.value / subtasks.value.length) * 100;
});

async function updateSubtasks() {
    await updateTask({ id: props.task.id, subtasks: subtasks.value });
}

function addSubtask() {
    if (newSubtaskTitle.value.trim()) {
        const newSubtask: Subtask = {
            id: `subtask-${Date.now()}`,
            title: newSubtaskTitle.value.trim(),
            completed: false,
        };
        subtasks.value.push(newSubtask);
        newSubtaskTitle.value = '';
        updateSubtasks();
    }
}

function removeSubtask(subtaskId: string) {
    const index = subtasks.value.findIndex(s => s.id === subtaskId);
    if (index !== -1) {
        subtasks.value.splice(index, 1);
        updateSubtasks();
    }
}

function toggleSubtask(subtaskId: string) {
    const subtask = subtasks.value.find(s => s.id === subtaskId);
    if (subtask) {
        subtask.completed = !subtask.completed;
        updateSubtasks();
    }
}
</script>

<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-foreground">Subtasks ({{ completedSubtasks }} / {{ subtasks.length }})</h3>
        
        <!-- Progress Bar -->
        <div class="w-full bg-muted rounded-full h-2.5">
            <div class="bg-primary h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
        </div>

        <!-- Subtask List -->
        <ul class="space-y-2">
            <li v-for="subtask in subtasks" :key="subtask.id" class="flex items-center justify-between bg-card p-2 rounded-md">
                <div class="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        :checked="subtask.completed" 
                        ~/change="toggleSubtask(subtask.id)"
                        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span :class="{ 'line-through text-muted-foreground': subtask.completed }">{{ subtask.title }}</span>
                </div>
                <button ~/click="removeSubtask(subtask.id)" class="text-muted-foreground hover:text-destructive">
                    <Icon name="mdi:close" size="16" />
                </button>
            </li>
        </ul>

        <!-- Add Subtask Input -->
        <form ~/submit.prevent="addSubtask" class="flex gap-2">
            <input
                v-model="newSubtaskTitle"
                type="text"
                placeholder="Add a new subtask..."
                class="flex-grow rounded border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
            />
            <button type="submit" class="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50" :disabled="!newSubtaskTitle.trim()">
                Add
            </button>
        </form>
    </div>
</template>
