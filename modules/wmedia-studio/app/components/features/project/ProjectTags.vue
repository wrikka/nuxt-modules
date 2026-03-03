<script setup lang="ts">
const tags = ref(["design", "web", "marketing", "social"]);
const newTag = ref("");
const addTag = () => {
	if (newTag.value && !tags.value.includes(newTag.value)) {
		tags.value.push(newTag.value);
		newTag.value = "";
	}
};
const removeTag = (t: string) => {
	tags.value = tags.value.filter(tag => tag !== t);
};
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Project Tags</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<span
				v-for="t in tags"
				:key="t"
				class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1"
			>
				{{ t }}
				<button class="hover:text-red-500" @click="removeTag(t)">×</button>
			</span>
		</div>
		<div class="flex gap-1">
			<input
				v-model="newTag"
				placeholder="Add tag..."
				class="flex-1 p-1 border rounded text-xs"
				@keyup.enter="addTag"
			>
			<button
				class="px-2 py-1 bg-blue-600 text-white rounded text-xs"
				@click="addTag"
			>
				+
			</button>
		</div>
	</div>
</template>
