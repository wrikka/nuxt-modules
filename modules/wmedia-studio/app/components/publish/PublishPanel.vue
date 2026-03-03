<script setup lang="ts">
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const showPublishPanel = ref(false);
const publishMode = ref<"staging" | "production">("staging");
const isPublishing = ref(false);
const publishUrl = ref("");

const seoSettings = ref({
	title: "",
	description: "",
	keywords: "",
	ogImage: "",
	canonicalUrl: "",
	schemaType: "WebPage",
});

const performanceMetrics = ref({
	lcp: 0,
	fid: 0,
	cls: 0,
});

const publish = async () => {
	isPublishing.value = true;
	try {
		// TODO: Implement actual publish API
		await new Promise(resolve => setTimeout(resolve, 2000));
		publishUrl.value = `https://${
			publishMode.value === "production" ? "" : "staging."
		}mediastudio.app/p/${projectStore.currentProject?.id}`;
	} finally {
		isPublishing.value = false;
	}
};

const copyUrl = () => {
	navigator.clipboard.writeText(publishUrl.value);
};
</script>

<template>
	<div>
		<!-- Publish Toggle Button -->
		<button
			class="fixed right-4 bottom-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110"
			@click="showPublishPanel = !showPublishPanel"
			title="Publish"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 2v20" />
				<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
			</svg>
		</button>

		<!-- Publish Panel -->
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showPublishPanel"
				class="fixed bottom-36 right-4 z-50 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<!-- Header -->
				<div class="border-b border-gray-200 bg-green-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Publish</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showPublishPanel = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-4 space-y-4">
					<!-- Environment Toggle -->
					<div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
						<button
							class="flex-1 rounded-md py-2 text-sm font-medium transition-colors"
							:class="publishMode === 'staging'
							? 'bg-white text-green-600 shadow-sm dark:bg-gray-700'
							: 'text-gray-500 dark:text-gray-400'"
							@click="publishMode = 'staging'"
						>
							Staging
						</button>
						<button
							class="flex-1 rounded-md py-2 text-sm font-medium transition-colors"
							:class="publishMode === 'production'
							? 'bg-white text-green-600 shadow-sm dark:bg-gray-700'
							: 'text-gray-500 dark:text-gray-400'"
							@click="publishMode = 'production'"
						>
							Production
						</button>
					</div>

					<!-- SEO Settings -->
					<div class="space-y-3">
						<h4 class="text-sm font-medium text-gray-900 dark:text-white">
							SEO Settings
						</h4>
						<input
							v-model="seoSettings.title"
							type="text"
							placeholder="Page Title"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						/>
						<textarea
							v-model="seoSettings.description"
							placeholder="Meta Description"
							rows="2"
							class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						/>
					</div>

					<!-- Publish Button -->
					<button
						class="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
						:disabled="isPublishing"
						@click="publish"
					>
						<span v-if="isPublishing">Publishing...</span>
						<span v-else>Publish to {{ publishMode }}</span>
					</button>

					<!-- Published URL -->
					<div
						v-if="publishUrl"
						class="rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
					>
						<p class="mb-2 text-xs text-green-700 dark:text-green-300">
							Published successfully!
						</p>
						<div class="flex gap-2">
							<input
								v-model="publishUrl"
								readonly
								class="flex-1 rounded border border-green-200 bg-white px-2 py-1 text-xs dark:border-green-800 dark:bg-gray-800"
							/>
							<button
								class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
								@click="copyUrl"
							>
								Copy
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
