<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	share: [type: "link" | "email" | "embed"];
}>();

const props = defineProps<{
	isOpen: boolean;
	projectId: string;
}>();

const shareUrl = computed(() => {
	if (typeof window === "undefined") return "";
	return `${window.location.origin}/projects/${props.projectId}`;
});

const copied = ref(false);

const copyLink = async () => {
	try {
		await navigator.clipboard.writeText(shareUrl.value);
		copied.value = true;
		setTimeout(() => copied.value = false, 2000);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};
</script>

<template>
	<Modal :show="isOpen" size="md" @close="$emit('close')">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
				Share Project
			</h2>

			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Share Link</label>
					<div class="flex gap-2">
						<input
							type="text"
							:value="shareUrl"
							readonly
							class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
						/>
						<Button variant="primary" size="sm" @click="copyLink">
							{{ copied ? "Copied!" : "Copy" }}
						</Button>
					</div>
				</div>

				<div class="flex gap-2 pt-4">
					<Button
						variant="secondary"
						class="flex-1"
						@click="$emit('share', 'link')"
					>
						Get Link
					</Button>
					<Button
						variant="secondary"
						class="flex-1"
						@click="$emit('share', 'email')"
					>
						Email
					</Button>
					<Button
						variant="secondary"
						class="flex-1"
						@click="$emit('share', 'embed')"
					>
						Embed
					</Button>
				</div>
			</div>
		</div>
	</Modal>
</template>
