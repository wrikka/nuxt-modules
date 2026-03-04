<script setup lang="ts">
const props = defineProps<{
	recordingId: string;
}>();

const emit = defineEmits<{
	upload: [url: string];
}>();

const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref<"idle" | "uploading" | "success" | "error">("idle");
const uploadedUrl = ref("");
const shareLink = ref("");
const expirationDays = ref(7);
const isPublic = ref(true);

const expirationOptions = [
	{ value: 1, label: "1 day" },
	{ value: 7, label: "7 days" },
	{ value: 30, label: "30 days" },
	{ value: 365, label: "1 year" },
	{ value: 0, label: "Never" },
];

const mockUpload = async () => {
	isUploading.value = true;
	uploadStatus.value = "uploading";
	uploadProgress.value = 0;

	// Simulate upload progress
	const interval = setInterval(() => {
		uploadProgress.value += Math.random() * 15;
		if (uploadProgress.value >= 100) {
			uploadProgress.value = 100;
			clearInterval(interval);
		}
	}, 300);

	// Simulate upload completion
	await new Promise((resolve) => setTimeout(resolve, 3000));
	clearInterval(interval);
	uploadProgress.value = 100;

	// Generate mock share link
	const randomId = Math.random().toString(36).substring(2, 10);
	uploadedUrl.value = `https://r2.mediasudio.app/recordings/${randomId}.webm`;
	shareLink.value = `https://mediastudio.app/share/${randomId}`;
	uploadStatus.value = "success";
	isUploading.value = false;

	emit("upload", uploadedUrl.value);
};

const copyShareLink = () => {
	navigator.clipboard.writeText(shareLink.value);
};

const copyDirectUrl = () => {
	navigator.clipboard.writeText(uploadedUrl.value);
};

const getExpirationDate = () => {
	if (expirationDays.value === 0) return "Never expires";
	const date = new Date();
	date.setDate(date.getDate() + expirationDays.value);
	return `Expires ${date.toLocaleDateString()}`;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			Cloud Upload & Share
		</h3>

		<!-- Settings -->
		<div class="space-y-3">
			<label class="flex items-center gap-2">
				<input
					v-model="isPublic"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Public (anyone with link can view)</span>
			</label>

			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
				>Link Expiration</label>
				<select
					v-model="expirationDays"
					class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
				>
					<option
						v-for="opt in expirationOptions"
						:key="opt.value"
						:value="opt.value"
					>
						{{ opt.label }}
					</option>
				</select>
				<p class="text-xs text-gray-500 mt-1">{{ getExpirationDate() }}</p>
			</div>
		</div>

		<!-- Upload Button -->
		<button
			v-if="uploadStatus !== 'success'"
			class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
			:disabled="isUploading"
			@click="mockUpload"
		>
			<Icon
				:name="isUploading ? 'mdi:cloud-upload' : 'mdi:cloud-upload-outline'"
				class="w-5 h-5 inline mr-2"
			/>
			{{
				isUploading
				? `Uploading... ${Math.round(uploadProgress)}%`
				: "Upload to Cloud"
			}}
		</button>

		<!-- Progress -->
		<div
			v-if="isUploading"
			class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
		>
			<div
				class="bg-purple-600 h-2 rounded-full transition-all duration-300"
				:style="{ width: `${uploadProgress}%` }"
			/>
		</div>

		<!-- Success State -->
		<div v-if="uploadStatus === 'success'" class="space-y-4">
			<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
					<Icon name="mdi:check-circle" class="w-5 h-5" />
					<span class="font-medium">Upload Complete!</span>
				</div>
			</div>

			<!-- Share Link -->
			<div class="space-y-2">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Share Link</label>
				<div class="flex gap-2">
					<input
						v-model="shareLink"
						readonly
						type="text"
						class="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					/>
					<button
						class="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
						@click="copyShareLink"
					>
						<Icon name="mdi:content-copy" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Direct URL -->
			<div class="space-y-2">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Direct URL</label>
				<div class="flex gap-2">
					<input
						v-model="uploadedUrl"
						readonly
						type="text"
						class="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					/>
					<button
						class="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
						@click="copyDirectUrl"
					>
						<Icon name="mdi:content-copy" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Social Share -->
			<div class="flex gap-2">
				<button class="flex-1 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm font-medium">
					<Icon name="mdi:twitter" class="w-4 h-4 inline mr-1" />
					Tweet
				</button>
				<button class="flex-1 py-2 bg-[#4267B2] text-white rounded-lg text-sm font-medium">
					<Icon name="mdi:facebook" class="w-4 h-4 inline mr-1" />
					Share
				</button>
				<button class="flex-1 py-2 bg-[#0088cc] text-white rounded-lg text-sm font-medium">
					<Icon name="mdi:telegram" class="w-4 h-4 inline mr-1" />
					Send
				</button>
			</div>

			<button
				class="w-full py-2 text-purple-600 dark:text-purple-400 text-sm"
				@click='uploadStatus = "idle";
				uploadProgress = 0;'
			>
				Upload Another
			</button>
		</div>
	</div>
</template>
