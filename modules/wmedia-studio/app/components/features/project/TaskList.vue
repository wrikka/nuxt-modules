<script setup lang="ts">
const tasks = ref([
	{ id: 1, name: "Review design", done: false },
	{ id: 2, name: "Export assets", done: true },
	{ id: 3, name: "Send to client", done: false },
]);
const newTask = ref("");
const addTask = () => {
	if (newTask.value) {
		tasks.value.push({ id: Date.now(), name: newTask.value, done: false });
		newTask.value = "";
	}
};
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Task List</h4>
		<div class="flex gap-1 mb-2">
			<input
				v-model="newTask"
				placeholder="Add task..."
				class="flex-1 p-1 border rounded text-xs"
				@keyup.enter="addTask"
			>
			<button
				class="px-2 py-1 bg-blue-600 text-white rounded text-xs"
				@click="addTask"
			>
				+
			</button>
		</div>
		<div class="space-y-1">
			<label
				v-for="t in tasks"
				:key="t.id"
				class="flex items-center gap-2 text-xs p-1 hover:bg-gray-50 rounded"
			>
				<input v-model="t.done" type="checkbox">
				<span :class="{ 'line-through text-gray-400': t.done }">{{
					t.name
				}}</span>
			</label>
		</div>
	</div>
</template>
