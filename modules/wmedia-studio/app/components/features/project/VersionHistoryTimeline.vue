<script setup lang="ts">
const isOpen = ref(false);

const versions = ref([
	{
		id: "v1",
		name: "Initial design",
		author: "You",
		time: "2 hours ago",
		thumbnail: "🎨",
	},
	{
		id: "v2",
		name: "Added hero section",
		author: "You",
		time: "1 hour ago",
		thumbnail: "🖼️",
	},
	{
		id: "v3",
		name: "Changed color scheme",
		author: "You",
		time: "30 minutes ago",
		thumbnail: "🌈",
	},
	{
		id: "v4",
		name: "Typography updates",
		author: "You",
		time: "5 minutes ago",
		thumbnail: "📝",
		current: true,
	},
]);

const restoreVersion = (version: any) => {
	alert(`Restoring to: ${version.name}`);
};
</script>

<template>
	<div>
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
			@click="isOpen = true"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="text-sm">History</span>
		</button>

		<!-- History Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[600px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Version History
							</h3>
						</div>
						<button
							class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							@click="isOpen = false"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<!-- Timeline -->
					<div class="p-4 overflow-y-auto max-h-[60vh]">
						<div class="relative">
							<!-- Timeline line -->
							<div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

							<!-- Version items -->
							<div class="space-y-4">
								<div
									v-for="(version, index) in [...versions].reverse()"
									:key="version.id"
									class="relative flex items-start gap-4"
								>
									<!-- Dot -->
									<div
										:class="[
											'relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-xl',
											version.current
												? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900'
												: 'bg-gray-100 dark:bg-gray-700',
										]"
									>
										{{ version.thumbnail }}
									</div>

									<!-- Content -->
									<div class="flex-1 pt-1">
										<div class="flex items-center gap-2 mb-1">
											<span class="font-medium text-gray-900 dark:text-white">{{
												version.name
											}}</span>
											<span
												v-if="version.current"
												class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
											>
												Current
											</span>
										</div>
										<div class="text-sm text-gray-500">
											{{ version.author }} • {{ version.time }}
										</div>

										<!-- Actions -->
										<div v-if="!version.current" class="flex gap-2 mt-2">
											<button
												class="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
												@click="restoreVersion(version)"
											>
												Restore
											</button>
											<button class="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
												Preview
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
						<p class="text-xs text-gray-500 text-center">
							Versions are automatically saved every 5 minutes or when you
							manually save
						</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
