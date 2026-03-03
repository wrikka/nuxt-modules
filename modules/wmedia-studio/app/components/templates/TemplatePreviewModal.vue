<script setup lang="ts">
import type { Template } from "#shared/types";
import { ref } from "vue";

const props = defineProps<{
	template: Template | null;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "use"): void;
	(e: "customize"): void;
	(e: "preview"): void;
}>();

const activeTab = ref<"preview" | "details" | "layers">("preview");
const isFullscreen = ref(false);

const mockLayers = [
	{ id: "1", name: "Background", type: "rectangle", visible: true },
	{ id: "2", name: "Logo Placeholder", type: "image", visible: true },
	{ id: "3", name: "Headline Text", type: "text", visible: true },
	{ id: "4", name: "Subheading", type: "text", visible: true },
	{ id: "5", name: "CTA Button", type: "group", visible: true },
];
</script>

<template>
	<Teleport to="body">
		<div
			v-if="template"
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
				:class="isFullscreen ? 'w-[95vw] h-[95vh]' : 'w-full max-w-5xl'"
			>
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-4">
						<h2 class="text-xl font-bold text-gray-900 dark:text-white">
							{{ template.name }}
						</h2>
						<span
							v-if="template.isPremium"
							class="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-semibold"
						>
							Premium
						</span>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
							@click="isFullscreen = !isFullscreen"
						>
							<i
								:class="isFullscreen ? 'i-mdi-fullscreen-exit' : 'i-mdi-fullscreen'"
								class="text-xl"
							/>
						</button>
						<button
							class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
							@click="$emit('close')"
						>
							<i class="i-mdi-close text-xl" />
						</button>
					</div>
				</div>

				<!-- Tabs -->
				<div class="flex border-b border-gray-200 dark:border-gray-700 px-6">
					<button
						v-for='tab in [{ id: "preview", label: "Preview" }, {
							id: "details",
							label: "Details",
						}, { id: "layers", label: "Layers" }]'
						:key="tab.id"
						class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
						:class="[
							activeTab === tab.id
								? 'border-blue-500 text-blue-600 dark:text-blue-400'
								: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
						]"
						@click="activeTab = tab.id as any"
					>
						{{ tab.label }}
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-hidden flex">
					<!-- Preview Tab -->
					<div v-if="activeTab === 'preview'" class="flex-1 p-6 overflow-auto">
						<div class="flex items-center justify-center min-h-full">
							<img
								:src="template.thumbnail"
								:alt="template.name"
								class="max-w-full max-h-[60vh] rounded-lg shadow-lg"
							/>
						</div>
					</div>

					<!-- Details Tab -->
					<div
						v-else-if="activeTab === 'details'"
						class="flex-1 p-6 overflow-auto"
					>
						<div class="grid grid-cols-2 gap-6">
							<div class="space-y-4">
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Description</label>
									<p class="text-gray-900 dark:text-white mt-1">
										{{ template.description }}
									</p>
								</div>
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Category</label>
									<p class="text-gray-900 dark:text-white mt-1 capitalize">
										{{ template.category }}
									</p>
								</div>
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Tags</label>
									<div class="flex flex-wrap gap-2 mt-1">
										<span
											v-for="tag in template.tags"
											:key="tag"
											class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
										>
											{{ tag }}
										</span>
									</div>
								</div>
							</div>
							<div class="space-y-4">
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Dimensions</label>
									<p class="text-gray-900 dark:text-white mt-1">
										1080 x 1080 px
									</p>
								</div>
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Format</label>
									<p class="text-gray-900 dark:text-white mt-1">Square (1:1)</p>
								</div>
								<div>
									<label
										class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
									>Rating</label>
									<div class="flex items-center gap-1 mt-1">
										<span class="text-yellow-500">★</span>
										<span class="text-gray-900 dark:text-white">{{
											template.rating
										}}</span>
										<span class="text-gray-500 dark:text-gray-400"
										>({{ template.usageCount }} uses)</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Layers Tab -->
					<div
						v-else-if="activeTab === 'layers'"
						class="flex-1 p-6 overflow-auto"
					>
						<div class="space-y-2">
							<div
								v-for="layer in mockLayers"
								:key="layer.id"
								class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
							>
								<i
									:class="[
										layer.type === 'rectangle'
											? 'i-mdi-rectangle'
											: layer.type === 'image'
											? 'i-mdi-image'
											: layer.type === 'text'
											? 'i-mdi-format-text'
											: 'i-mdi-folder',
										'text-gray-500 dark:text-gray-400',
									]"
								/>
								<span class="flex-1 text-sm text-gray-900 dark:text-white">{{
									layer.name
								}}</span>
								<i
									:class="[
										layer.visible ? 'i-mdi-eye' : 'i-mdi-eye-off',
										'text-gray-400 dark:text-gray-500',
									]"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
					<div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
						<span><i class="i-mdi-clock-outline mr-1" /> 5 min to
							customize</span>
						<span><i class="i-mdi-layers mr-1" /> {{ mockLayers.length }}
							layers</span>
					</div>
					<div class="flex items-center gap-3">
						<button
							class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							@click="$emit('customize')"
						>
							Customize First
						</button>
						<button
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
							@click="$emit('use')"
						>
							Use Template
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
