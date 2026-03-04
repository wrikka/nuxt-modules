<script setup lang="ts">
const emit = defineEmits<{ close: []; save: [metadata: any] }>();
const metadata = ref({
	title: "My Video",
	description: "Video description here...",
	author: "Media Studio",
	tags: ["video", "editing"],
	category: "Education",
	license: "Standard",
	copyright: "2024",
	location: "",
	created: new Date().toISOString().split("T")[0],
});

const categories = [
	"Education",
	"Entertainment",
	"Music",
	"Sports",
	"Gaming",
	"Technology",
];
const licenses = ["Standard", "Creative Commons", "Public Domain", "Copyright"];

const save = () => emit("save", metadata.value);
</script>

<template>
	<div class="video-metadata bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:information" class="w-5 h-5 text-blue-500" />
				Video Metadata
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-3">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Title</label>
				<input
					v-model="metadata.title"
					type="text"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				/>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Description</label>
				<textarea
					v-model="metadata.description"
					class="w-full h-20 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm resize-none border-0"
				/>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
					>Author</label>
					<input
						v-model="metadata.author"
						type="text"
						class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					/>
				</div>
				<div>
					<label
						class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
					>Created Date</label>
					<input
						v-model="metadata.created"
						type="date"
						class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
					>Category</label>
					<select
						v-model="metadata.category"
						class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option v-for="c in categories" :key="c">{{ c }}</option>
					</select>
				</div>
				<div>
					<label
						class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
					>License</label>
					<select
						v-model="metadata.license"
						class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option v-for="l in licenses" :key="l">{{ l }}</option>
					</select>
				</div>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Tags (comma separated)</label>
				<input
					v-model="metadata.tags"
					type="text"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				/>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Location</label>
				<input
					v-model="metadata.location"
					type="text"
					placeholder="City, Country"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				/>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Copyright</label>
				<input
					v-model="metadata.copyright"
					type="text"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				/>
			</div>
		</div>
		<button
			class="mt-4 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="save"
		>
			Save Metadata
		</button>
	</div>
</template>
