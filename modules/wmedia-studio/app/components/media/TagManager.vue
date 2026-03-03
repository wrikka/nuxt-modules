<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
	tags: string[];
	availableTags?: string[];
}>();

const emit = defineEmits<{
	update: [tags: string[]];
}>();

const newTag = ref("");
const showTagInput = ref(false);

const allTags = computed(() => {
	const combined = [...props.tags];
	if (props.availableTags) {
		props.availableTags.forEach((tag) => {
			if (!combined.includes(tag)) {
				combined.push(tag);
			}
		});
	}
	return combined;
});

const addTag = () => {
	const tag = newTag.value.trim().toLowerCase();
	if (tag && !props.tags.includes(tag)) {
		emit("update", [...props.tags, tag]);
		newTag.value = "";
	}
};

const removeTag = (tag: string) => {
	emit("update", props.tags.filter((t) => t !== tag));
};

const selectTag = (tag: string) => {
	if (!props.tags.includes(tag)) {
		emit("update", [...props.tags, tag]);
	}
};
</script>

<template>
	<div class="tag-manager">
		<div class="flex flex-wrap gap-2">
			<span
				v-for="tag in tags"
				:key="tag"
				class="group relative flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
			>
				{{ tag }}
				<button
					@click="removeTag(tag)"
					class="ml-1 rounded-full p-0.5 text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-800"
				>
					<i class="i-mdi-close text-xs" />
				</button>
			</span>
			<button
				v-if="!showTagInput"
				@click="showTagInput = true"
				class="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
			>
				<i class="i-mdi-plus text-xs" />
				Add Tag
			</button>
		</div>

		<div v-if="showTagInput" class="mt-2 flex gap-2">
			<input
				v-model="newTag"
				type="text"
				placeholder="Enter tag name"
				class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				@keyup.enter="addTag"
				@keyup.esc="showTagInput = false"
			/>
			<button
				@click="addTag"
				class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
			>
				Add
			</button>
			<button
				@click="showTagInput = false"
				class="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			>
				Cancel
			</button>
		</div>

		<div v-if="availableTags && availableTags.length > 0" class="mt-3">
			<p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
				Suggested tags:
			</p>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="tag in availableTags.filter((t) => !tags.includes(t))"
					:key="tag"
					@click="selectTag(tag)"
					class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
				>
					{{ tag }}
				</button>
			</div>
		</div>
	</div>
</template>
