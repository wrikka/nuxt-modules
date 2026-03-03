<script setup lang="ts">
import type { Task } from '~/shared/types/task';

defineProps<{ task: Task }>();
</script>

<template>
    <div class="space-y-6 p-6 bg-card rounded-lg border border-border">
        <TaskDetailStatus :task="task" />
        <TaskDetailAssignee :task="task" />
        <TaskDetailPriority :task="task" />
        <TaskDetailTags :task="task" />
    </div>
</template>
