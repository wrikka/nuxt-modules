<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";
import { ref, watch } from "vue";

const props = defineProps<{
	media: MediaItem;
}>();

const emit = defineEmits<{
	save: [media: Partial<MediaItem>];
	cancel: [];
}>();

const editedMedia = ref<Partial<MediaItem>>({
	name: props.media.name,
	tags: [...(props.media.tags || [])],
	metadata: { ...props.media.metadata },
});

const newMetadataKey = ref("");
const newMetadataValue = ref("");

const addMetadata = () => {
	if (newMetadataKey.value && newMetadataValue.value) {
		editedMedia.value.metadata = {
			...editedMedia.value.metadata,
			[newMetadataKey.value]: newMetadataValue.value,
		};
		newMetadataKey.value = "";
		newMetadataValue.value = "";
	}
};

const removeMetadata = (key: string) => {
	const newMetadata = { ...editedMedia.value.metadata };
	delete newMetadata[key];
	editedMedia.value.metadata = newMetadata;
};

const handleSave = () => {
	emit("save", editedMedia.value);
};

const handleCancel = () => {
	emit("cancel");
};
</script>

<template>
	<div class="media-editor rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
			Edit Media
		</h2>

		<div class="space-y-4">
			<div>
				<label
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Name</label>
				<input
					v-model="editedMedia.name"
					type="text"
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Tags</label>
				<TagManager
					:tags="editedMedia.tags || []"
					@update="(tags: string[]) => editedMedia.tags = tags"
				/>
			</div>

			<div>
				<label
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Metadata</label>
				<div
					v-if="editedMedia.metadata && Object.keys(editedMedia.metadata).length > 0"
					class="mb-3 space-y-2"
				>
					<div
						v-for="(value, key) in editedMedia.metadata"
						:key="key"
						class="flex items-center gap-2"
					>
						<input
							:value="key"
							type="text"
							disabled
							class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
						<input
							v-model="editedMedia.metadata[key]"
							type="text"
							class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
						<button
							@click="removeMetadata(key)"
							class="rounded-md p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
						>
							<i class="i-mdi-delete" />
						</button>
					</div>
				</div>
				<div class="flex gap-2">
					<input
						v-model="newMetadataKey"
						type="text"
						placeholder="Key"
						class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
					<input
						v-model="newMetadataValue"
						type="text"
						placeholder="Value"
						class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
					<button
						@click="addMetadata"
						class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
					>
						<i class="i-mdi-plus mr-1" />
						Add
					</button>
				</div>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<button
					@click="handleCancel"
					class="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				>
					Cancel
				</button>
				<button
					@click="handleSave"
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Save Changes
				</button>
			</div>
		</div>
	</div>
</template>
