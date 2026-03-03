<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "close"): void;
}>();

const shareUrl = ref("https://media.studio/t/template-xyz-123");
const isCopied = ref(false);
const expiryDays = ref(7);
const allowPreview = ref(true);
const requirePassword = ref(false);
const password = ref("");

const copyLink = async () => {
	await navigator.clipboard.writeText(shareUrl.value);
	isCopied.value = true;
	setTimeout(() => isCopied.value = false, 2000);
};

const regenerateLink = () => {
	shareUrl.value = `https://media.studio/t/${
		Math.random().toString(36).substring(7)
	}`;
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Share Template
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="p-6 space-y-6">
					<!-- Link -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Shareable Link</label>
						<div class="flex gap-2">
							<input
								v-model="shareUrl"
								readonly
								class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
							/>
							<button
								class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
								@click="copyLink"
							>
								<i :class="isCopied ? 'i-mdi-check' : 'i-mdi-content-copy'" />
								{{ isCopied ? "Copied!" : "Copy" }}
							</button>
						</div>
					</div>

					<!-- Settings -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Allow preview before download</span>
							<input
								v-model="allowPreview"
								type="checkbox"
								class="w-4 h-4 rounded"
							/>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Password protection</span>
							<input
								v-model="requirePassword"
								type="checkbox"
								class="w-4 h-4 rounded"
							/>
						</div>

						<div v-if="requirePassword" class="mt-2">
							<input
								v-model="password"
								type="password"
								placeholder="Enter password"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label class="block text-sm text-gray-700 dark:text-gray-300 mb-2"
							>Link expires after</label>
							<select
								v-model="expiryDays"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option :value="1">1 day</option>
								<option :value="7">7 days</option>
								<option :value="30">30 days</option>
								<option :value="0">Never</option>
							</select>
						</div>
					</div>

					<!-- Social Share -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
						>Share to</label>
						<div class="flex gap-3">
							<button class="flex-1 p-3 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20">
								<i class="i-mdi-facebook text-xl" />
							</button>
							<button class="flex-1 p-3 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20">
								<i class="i-mdi-twitter text-xl" />
							</button>
							<button class="flex-1 p-3 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20">
								<i class="i-mdi-linkedin text-xl" />
							</button>
							<button class="flex-1 p-3 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20">
								<i class="i-mdi-whatsapp text-xl" />
							</button>
						</div>
					</div>

					<button
						class="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm"
						@click="regenerateLink"
					>
						<i class="i-mdi-refresh mr-1" />
						Generate New Link
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
