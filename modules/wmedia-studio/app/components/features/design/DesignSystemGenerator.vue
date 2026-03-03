<script setup lang="ts">
const isOpen = ref(false);
const isGenerating = ref(false);

const designSystem = ref({
	colors: [
		{ name: "Primary", hex: "#3B82F6", usage: "Buttons, links" },
		{ name: "Secondary", hex: "#8B5CF6", usage: "Accents" },
		{ name: "Background", hex: "#F3F4F6", usage: "Page background" },
		{ name: "Text", hex: "#1F2937", usage: "Body text" },
	],
	typography: [
		{ name: "Heading", font: "Inter", size: "32px", weight: "Bold" },
		{ name: "Subheading", font: "Inter", size: "24px", weight: "Semibold" },
		{ name: "Body", font: "Inter", size: "16px", weight: "Regular" },
		{ name: "Caption", font: "Inter", size: "14px", weight: "Medium" },
	],
	components: [
		{ name: "Primary Button", preview: "Click me" },
		{ name: "Card", preview: "Card content" },
		{ name: "Input", preview: "Placeholder" },
		{ name: "Badge", preview: "New" },
	],
});

const generateDesignSystem = () => {
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
	}, 2000);
};

const exportDesignSystem = () => {
	alert("Design system exported as JSON/CSS variables!");
};
</script>

<template>
	<div class="relative">
		<!-- Trigger Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
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
					d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
				/>
			</svg>
			<span class="text-sm font-medium">Design System</span>
		</button>

		<!-- Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[700px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								AI Design System Generator
							</h3>
						</div>
						<div class="flex gap-2">
							<button
								class="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
								@click="generateDesignSystem"
							>
								{{ isGenerating ? "Analyzing..." : "Regenerate" }}
							</button>
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
					<div class="p-4 overflow-y-auto max-h-[60vh]">
						<!-- Loading State -->
						<div
							v-if="isGenerating"
							class="flex flex-col items-center justify-center py-12"
						>
							<div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
							<p class="text-gray-600 dark:text-gray-400">
								AI is analyzing your design...
							</p>
						</div>

						<div v-else class="space-y-6">
							<!-- Colors -->
							<div>
								<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
									<span>🎨</span> Color Palette
								</h4>
								<div class="grid grid-cols-4 gap-3">
									<div
										v-for="color in designSystem.colors"
										:key="color.name"
										class="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
									>
										<div
											class="w-full h-12 rounded-lg mb-2 shadow-inner"
											:style="{ backgroundColor: color.hex }"
										/>
										<p class="text-sm font-medium">{{ color.name }}</p>
										<p class="text-xs text-gray-500">{{ color.hex }}</p>
										<p class="text-xs text-gray-400 mt-1">{{ color.usage }}</p>
									</div>
								</div>
							</div>

							<!-- Typography -->
							<div>
								<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
									<span>🔤</span> Typography Scale
								</h4>
								<div class="space-y-2">
									<div
										v-for="type in designSystem.typography"
										:key="type.name"
										class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
									>
										<span
											:style="{ fontSize: type.size, fontWeight: type.weight }"
											class="w-32"
										>
											Aa
										</span>
										<div class="flex-1">
											<p class="text-sm font-medium">{{ type.name }}</p>
											<p class="text-xs text-gray-500">
												{{ type.font }} • {{ type.size }} • {{ type.weight }}
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Components -->
							<div>
								<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
									<span>🧩</span> Component Library
								</h4>
								<div class="grid grid-cols-2 gap-3">
									<div
										v-for="comp in designSystem.components"
										:key="comp.name"
										class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
									>
										<p class="text-sm text-gray-500 mb-2">{{ comp.name }}</p>
										<div class="flex justify-center">
											<button
												v-if="comp.name.includes('Button')"
												class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
											>
												{{ comp.preview }}
											</button>
											<div
												v-else-if="comp.name.includes('Card')"
												class="p-3 bg-white dark:bg-gray-700 shadow rounded text-sm"
											>
												{{ comp.preview }}
											</div>
											<input
												v-else-if="comp.name.includes('Input')"
												type="text"
												:placeholder="comp.preview"
												class="px-3 py-1.5 border rounded text-sm"
											/>
											<span
												v-else
												class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
											>
												{{ comp.preview }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
						<p class="text-xs text-gray-500">
							Based on your current project design
						</p>
						<button
							class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
							@click="exportDesignSystem"
						>
							Export Design System
						</button>
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
