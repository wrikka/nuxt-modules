<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "create", variants: Variant[]): void;
	(e: "close"): void;
}>();

interface Variant {
	id: string;
	name: string;
	thumbnail: string;
	colorScheme: string;
	layout: string;
}

const testName = ref("");
const duration = ref(7);

const variants = ref<Variant[]>([
	{
		id: "v1",
		name: "Version A - Blue Theme",
		thumbnail: "https://picsum.photos/400/300?random=80",
		colorScheme: "Blue & White",
		layout: "Centered",
	},
	{
		id: "v2",
		name: "Version B - Warm Theme",
		thumbnail: "https://picsum.photos/400/300?random=81",
		colorScheme: "Orange & Cream",
		layout: "Left-aligned",
	},
]);

const addVariant = () => {
	const id = `v${variants.value.length + 1}`;
	variants.value.push({
		id,
		name: `Version ${String.fromCharCode(65 + variants.value.length)}`,
		thumbnail: `https://picsum.photos/400/300?random=${
			80 + variants.value.length
		}`,
		colorScheme: "Custom",
		layout: "Standard",
	});
};

const removeVariant = (id: string) => {
	variants.value = variants.value.filter(v => v.id !== id);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						A/B Testing
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6 space-y-6">
					<!-- Test Name -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Test Name</label>
						<input
							v-model="testName"
							type="text"
							placeholder="e.g., Summer Sale Campaign Test"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
						/>
					</div>

					<!-- Variants -->
					<div>
						<div class="flex items-center justify-between mb-3">
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Test Variants</label>
							<button
								class="text-sm text-blue-600 hover:underline"
								@click="addVariant"
							>
								+ Add Variant
							</button>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div
								v-for="variant in variants"
								:key="variant.id"
								class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
							>
								<div class="aspect-video relative">
									<img
										:src="variant.thumbnail"
										class="w-full h-full object-cover"
									/>
									<button
										v-if="variants.length > 2"
										class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
										@click="removeVariant(variant.id)"
									>
										<i class="i-mdi-close text-sm" />
									</button>
								</div>
								<div class="p-3">
									<input
										v-model="variant.name"
										class="w-full font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
									/>
									<div class="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
										<span>{{ variant.colorScheme }}</span>
										<span>·</span>
										<span>{{ variant.layout }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Settings -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Test Duration</label>
						<div class="flex items-center gap-4">
							<input
								v-model="duration"
								type="range"
								min="3"
								max="30"
								class="flex-1"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300 w-20">{{
									duration
								}} days</span>
						</div>
					</div>

					<!-- Metrics -->
					<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<h4 class="font-medium text-gray-900 dark:text-white mb-3">
							Metrics to Track
						</h4>
						<div class="flex flex-wrap gap-2">
							<span
								class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
							>Click-through Rate</span>
							<span
								class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
							>Engagement</span>
							<span
								class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
							>Conversion</span>
							<span
								class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-400"
							>+ Add Custom</span>
						</div>
					</div>
				</div>

				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						:disabled="!testName || variants.length < 2"
						class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium"
						@click="$emit('create', variants)"
					>
						<i class="i-mdi-flask mr-2" />
						Start A/B Test
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
