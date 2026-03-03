<script setup lang="ts">
const isOpen = ref(false);
const selectedCategory = ref("all");

const categories = [
	{ id: "all", name: "All Templates", icon: "📦" },
	{ id: "social", name: "Social Media", icon: "📱" },
	{ id: "web", name: "Web Design", icon: "🌐" },
	{ id: "print", name: "Print", icon: "📄" },
	{ id: "video", name: "Video", icon: "🎬" },
];

const templates = ref([
	{
		id: 1,
		name: "Instagram Post",
		category: "social",
		thumbnail: "📸",
		author: "Media Studio",
		likes: 2341,
		isOfficial: true,
	},
	{
		id: 2,
		name: "Landing Page",
		category: "web",
		thumbnail: "🚀",
		author: "Sarah Design",
		likes: 1892,
		isOfficial: false,
	},
	{
		id: 3,
		name: "Business Card",
		category: "print",
		thumbnail: "💼",
		author: "Media Studio",
		likes: 1567,
		isOfficial: true,
	},
	{
		id: 4,
		name: "YouTube Thumbnail",
		category: "video",
		thumbnail: "🎥",
		author: "Creator Hub",
		likes: 3421,
		isOfficial: false,
	},
	{
		id: 5,
		name: "TikTok Video",
		category: "video",
		thumbnail: "🎵",
		author: "Media Studio",
		likes: 2156,
		isOfficial: true,
	},
	{
		id: 6,
		name: "Portfolio Site",
		category: "web",
		thumbnail: "🎨",
		author: "Alex Design",
		likes: 1234,
		isOfficial: false,
	},
]);

const filteredTemplates = computed(() => {
	if (selectedCategory.value === "all") return templates.value;
	return templates.value.filter(t => t.category === selectedCategory.value);
});

const applyTemplate = (template: typeof templates.value[0]) => {
	alert(`Applied template: ${template.name}`);
	isOpen.value = false;
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
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
					d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
				/>
			</svg>
			<span class="text-sm font-medium">Templates</span>
		</button>

		<!-- Template Marketplace Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[900px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-cyan-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Template Marketplace
							</h3>
						</div>
						<div class="flex items-center gap-4">
							<input
								type="text"
								placeholder="Search templates..."
								class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm w-48"
							/>
							<button
								class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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
					</div>

					<!-- Content -->
					<div class="flex flex-1 overflow-hidden">
						<!-- Sidebar Categories -->
						<div class="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
							<p class="text-xs text-gray-500 mb-3">Categories</p>
							<div class="space-y-1">
								<button
									v-for="cat in categories"
									:key="cat.id"
									:class="[
										'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors',
										selectedCategory === cat.id
											? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
											: 'hover:bg-gray-100 dark:hover:bg-gray-700',
									]"
									@click="selectedCategory = cat.id"
								>
									<span>{{ cat.icon }}</span>
									<span>{{ cat.name }}</span>
								</button>
							</div>
						</div>

						<!-- Templates Grid -->
						<div class="flex-1 p-4 overflow-y-auto">
							<div class="flex items-center justify-between mb-4">
								<p class="text-sm text-gray-600 dark:text-gray-400">
									{{ filteredTemplates.length }} templates found
								</p>
								<div class="flex gap-2">
									<button class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
										Popular
									</button>
									<button class="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
										Newest
									</button>
								</div>
							</div>

							<div class="grid grid-cols-3 gap-4">
								<div
									v-for="template in filteredTemplates"
									:key="template.id"
									class="group relative bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
								>
									<!-- Preview -->
									<div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-5xl">
										{{ template.thumbnail }}
									</div>

									<!-- Badge -->
									<div
										v-if="template.isOfficial"
										class="absolute top-2 left-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full"
									>
										Official
									</div>

									<!-- Actions -->
									<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<button
											class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700"
											@click="applyTemplate(template)"
										>
											Use Template
										</button>
									</div>

									<!-- Info -->
									<div class="p-3">
										<div class="flex items-start justify-between">
											<div>
												<p class="font-medium text-sm">{{ template.name }}</p>
												<p class="text-xs text-gray-500">
													by {{ template.author }}
												</p>
											</div>
											<div class="flex items-center gap-1 text-xs text-gray-400">
												<svg
													class="w-3 h-3"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
												</svg>
												{{ template.likes }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
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
