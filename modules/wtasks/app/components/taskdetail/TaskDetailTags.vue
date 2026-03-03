<script setup lang="ts">
import type { Task, TaskTag } from '~/shared/types/task';

const props = defineProps<{ task: Task }>();

const { updateTask } = useTaskApi();

const newTag = ref('');
const tags = ref<TaskTag[]>(props.task.tags || []);

// A simple color palette for new tags
const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#60a5fa', '#818cf8', '#c084fc'];

async function updateTags() {
    await updateTask({ id: props.task.id, tags: tags.value });
}

function addTag() {
    if (newTag.value.trim()) {
        const newTagObject: TaskTag = {
            name: newTag.value.trim(),
            color: colors[Math.floor(Math.random() * colors.length)] || '#818cf8',
        };
        tags.value.push(newTagObject);
        newTag.value = '';
        updateTags();
    }
}

function removeTag(tagName: string) {
    const index = tags.value.findIndex(t => t.name === tagName);
    if (index !== -1) {
        tags.value.splice(index, 1);
        updateTags();
    }
}
</script>

<template>
    <div class="space-y-3">
        <h3 class="text-gray-400">Tags</h3>
        <div class="flex flex-wrap gap-2">
            <span 
                v-for="tag in tags" 
                :key="tag.name" 
                class="flex items-center text-xs font-medium rounded-full px-2 py-1"
                :style="{ backgroundColor: tag.color, color: '#fff' }"
            >
                {{ tag.name }}
                <button ~/click="removeTag(tag.name)" class="ml-1.5 opacity-70 hover:opacity-100">
                    <Icon name="mdi:close-circle" size="12" />
                </button>
            </span>
        </div>
        <form ~/submit.prevent="addTag" class="flex gap-2 items-center">
            <input
                v-model="newTag"
                type="text"
                placeholder="Add a tag..."
                class="flex-grow rounded border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
            />
            <button type="submit" class="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50" :disabled="!newTag.trim()">
                Add
            </button>
        </form>
    </div>
</template>
