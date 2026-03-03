<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
	isOpen: boolean;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "use", templateId: string): void;
	(e: "favorite", templateId: string): void;
}>();

const previewMode = ref<"desktop" | "tablet" | "mobile">("desktop");
const zoomLevel = ref(100);
const showGrid = ref(false);
const isFullscreen = ref(false);

const zoomedStyle = computed(() => ({
	transform: `scale(${zoomLevel.value / 100})`,
	transformOrigin: "center center",
}));

const deviceSizes = {
	desktop: { width: "100%", height: "auto" },
	tablet: { width: "768px", height: "1024px" },
	mobile: { width: "375px", height: "812px" },
};

const relatedTemplates = ref<Template[]>([
	{
		id: "related-1",
		name: "Similar Style",
		thumbnail: "https://picsum.photos/200/150?random=1",
		category: "social-media",
		tags: [],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#ffffff",
		isPremium: false,
		usageCount: 1234,
		rating: 4.5,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
]);
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
				@click.self="emit('close')"
			>
				<div
					class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col"
					:class="{ 'inset-0 rounded-none': isFullscreen }"
				>
					<!-- Header -->
					<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-4">
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								{{ template!.name }}
							</h2>
							<span
								v-if="template!.isPremium"
								class="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium"
							>
								Premium
							</span>
						</div>
						<div class="flex items-center gap-2">
							<!-- Device Toggle -->
							<div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
								<button
									v-for='device in ["desktop", "tablet", "mobile"]'
									:key="device"
									class="px-3 py-1 rounded text-sm capitalize transition-colors"
									:class="previewMode === device
									? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-900'"
									@click="previewMode = device as any"
								>
									<i
										:class="`i-mdi-${device === 'mobile' ? 'cellphone' : device}`"
									/>
								</button>
							</div>

							<!-- Zoom -->
							<input
								v-model="zoomLevel"
								type="range"
								min="25"
								max="200"
								class="w-24 mx-2"
							/>

							<button
								class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
								:class="showGrid ? 'bg-gray-100 dark:bg-gray-700' : ''"
								@click="showGrid = !showGrid"
							>
								<i class="i-mdi-grid text-gray-600 dark:text-gray-400" />
							</button>

							<button
								class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
								@click="isFullscreen = !isFullscreen"
							>
								<i
									class="i-mdi-fullscreen text-gray-600 dark:text-gray-400"
									:class="isFullscreen ? 'i-mdi-fullscreen-exit' : ''"
								/>
							</button>

							<button
								class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
								@click="emit('close')"
							>
								<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
							</button>
						</div>
					</div>

					<!-- Preview Area -->
					<div class="flex-1 flex overflow-hidden">
						<!-- Main Canvas -->
						<div class="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto p-8">
							<div class="flex items-center justify-center min-h-full">
								<div
									class="relative bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300"
									:style="[
										deviceSizes[previewMode],
										zoomedStyle,
									]"
								>
									<img
										:src="template!.thumbnail"
										:alt="template!.name"
										class="w-full h-full object-cover"
									/>
									<div
										v-if="showGrid"
										class="absolute inset-0 pointer-events-none"
										style="background-image:
	linear-gradient(#00000010 1px, transparent 1px),
	linear-gradient(90deg, #00000010 1px, transparent 1px); background-size: 20px 20px"
									/>
								</div>
							</div>
						</div>

						<!-- Sidebar Info -->
						<div class="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
							<div class="p-6 space-y-6">
								<!-- Template Stats -->
								<div class="grid grid-cols-2 gap-4">
									<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<div class="text-2xl font-bold text-gray-900 dark:text-white">
											{{ template!.usageCount.toLocaleString() }}
										</div>
										<div class="text-sm text-gray-500 dark:text-gray-400">
											Uses
										</div>
									</div>
									<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<div class="text-2xl font-bold text-yellow-500">
											{{ template!.rating }}
										</div>
										<div class="text-sm text-gray-500 dark:text-gray-400">
											Rating
										</div>
									</div>
								</div>

								<!-- Description -->
								<div>
									<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
										Description
									</h3>
									<p class="text-sm text-gray-600 dark:text-gray-300">
										{{ template!.description || "No description available" }}
									</p>
								</div>

								<!-- Tags -->
								<div>
									<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
										Tags
									</h3>
									<div class="flex flex-wrap gap-2">
										<span
											v-for="tag in template!.tags"
											:key="tag"
											class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
										>
											{{ tag }}
										</span>
									</div>
								</div>

								<!-- Dimensions -->
								<div>
									<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
										Dimensions
									</h3>
									<p class="text-sm text-gray-600 dark:text-gray-300">
										{{ template!.width }} × {{ template!.height }} px
									</p>
								</div>

								<!-- Actions -->
								<div class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
									<button
										class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
										@click="emit('use', template!.id)"
									>
										<i class="i-mdi-play" />
										Use This Template
									</button>
									<button
										class="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
										@click="emit('favorite', template!.id)"
									>
										<i class="i-mdi-heart-outline" />
										Add to Favorites
									</button>
								</div>

								<!-- Related Templates -->
								<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
									<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
										You Might Also Like
									</h3>
									<div class="space-y-3">
										<div
											v-for="related in relatedTemplates"
											:key="related.id"
											class="flex gap-3 cursor-pointer group"
											@click="emit('use', related.id)"
										>
											<img
												:src="related.thumbnail"
												class="w-16 h-12 object-cover rounded-lg group-hover:ring-2 ring-blue-500 transition-all"
											/>
											<div>
												<div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-500">
													{{ related.name }}
												</div>
												<div class="text-xs text-gray-500">
													{{ related.usageCount.toLocaleString() }} uses
												</div>
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
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
