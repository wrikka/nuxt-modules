<script setup lang="ts">
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const showMagicMove = ref(false);

interface VariantState {
	id: string;
	name: string;
	properties: {
		x: number;
		y: number;
		scale: number;
		rotation: number;
		opacity: number;
		width: number;
		height: number;
	};
}

const variants = ref<VariantState[]>([
	{
		id: "1",
		name: "Default",
		properties: {
			x: 0,
			y: 0,
			scale: 1,
			rotation: 0,
			opacity: 1,
			width: 200,
			height: 100,
		},
	},
	{
		id: "2",
		name: "Hover",
		properties: {
			x: 0,
			y: -10,
			scale: 1.05,
			rotation: 0,
			opacity: 1,
			width: 200,
			height: 100,
		},
	},
]);

const selectedVariant = ref<string>("1");
const animationDuration = ref(0.3);
const animationEasing = ref("ease-out");

const addVariant = () => {
	const newVariant: VariantState = {
		id: crypto.randomUUID(),
		name: `Variant ${variants.value.length + 1}`,
		properties: { ...variants.value[0]!.properties },
	};
	variants.value.push(newVariant);
};

const duplicateVariant = (variant: VariantState) => {
	const newVariant: VariantState = {
		id: crypto.randomUUID(),
		name: `${variant.name} Copy`,
		properties: { ...variant.properties },
	};
	variants.value.push(newVariant);
};

const deleteVariant = (id: string) => {
	variants.value = variants.value.filter((v) => v.id !== id);
};

const previewAnimation = () => {
	console.log("Preview Magic Move animation");
};

const applyMagicMove = () => {
	console.log("Apply Magic Move to selected element");
};
</script>

<template>
	<div>
		<!-- Magic Move Toggle Button -->
		<button
			class="fixed right-20 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-pink-400 ring-offset-2': showMagicMove }"
			@click="showMagicMove = !showMagicMove"
			title="Magic Move"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3v18" />
				<path d="m6 9 12 6" />
				<path d="m6 15 12-6" />
			</svg>
		</button>

		<!-- Magic Move Panel -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="showMagicMove"
				class="fixed right-0 top-0 z-40 h-screen w-96 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<!-- Header -->
				<div class="border-b border-gray-200 bg-gradient-to-r from-pink-600 to-rose-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
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
								class="text-white"
							>
								<path d="M12 3v18" />
								<path d="m6 9 12 6" />
								<path d="m6 15 12-6" />
							</svg>
							<h2 class="font-bold text-white">Magic Move</h2>
						</div>
						<button
							class="text-white/80 hover:text-white"
							@click="showMagicMove = false"
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
					<p class="mt-1 text-xs text-white/80">
						Auto-animate between component variants
					</p>
				</div>

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Animation Settings -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
							Animation Settings
						</h3>
						<div class="space-y-3">
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>Duration (s)</label>
								<input
									v-model.number="animationDuration"
									type="range"
									min="0.1"
									max="2"
									step="0.1"
									class="w-full"
								/>
								<span class="text-xs text-gray-500">{{
										animationDuration
									}}s</span>
							</div>
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>Easing</label>
								<select
									v-model="animationEasing"
									class="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								>
									<option value="linear">Linear</option>
									<option value="ease">Ease</option>
									<option value="ease-in">Ease In</option>
									<option value="ease-out">Ease Out</option>
									<option value="ease-in-out">Ease In Out</option>
									<option value="spring">Spring</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Variants List -->
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">
							Variants ({{ variants.length }})
						</h3>
						<button
							class="flex items-center gap-1 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700"
							@click="addVariant"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14" />
								<path d="M12 5v14" />
							</svg>
							Add Variant
						</button>
					</div>

					<div class="space-y-3">
						<div
							v-for="variant in variants"
							:key="variant.id"
							class="group rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-pink-300 dark:border-gray-700 dark:bg-gray-800"
							:class="{
								'border-pink-500 ring-1 ring-pink-500':
									selectedVariant === variant.id,
							}"
							@click="selectedVariant = variant.id"
						>
							<div class="mb-2 flex items-center justify-between">
								<input
									v-model="variant.name"
									type="text"
									class="bg-transparent text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
								/>
								<div class="flex gap-1 opacity-0 group-hover:opacity-100">
									<button
										class="rounded p-1 text-gray-400 hover:text-pink-600"
										@click.stop="duplicateVariant(variant)"
										title="Duplicate"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
											<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
										</svg>
									</button>
									<button
										v-if="variants.length > 1"
										class="rounded p-1 text-gray-400 hover:text-red-600"
										@click.stop="deleteVariant(variant.id)"
										title="Delete"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										</svg>
									</button>
								</div>
							</div>

							<!-- Properties Mini Preview -->
							<div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
								<div>
									Pos: {{ variant.properties.x }}, {{ variant.properties.y }}
								</div>
								<div>Scale: {{ variant.properties.scale }}</div>
								<div>Rot: {{ variant.properties.rotation }}°</div>
								<div>Op: {{ variant.properties.opacity }}</div>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="mt-6 flex gap-2">
						<button
							class="flex-1 rounded-lg border border-pink-600 py-2.5 text-sm font-medium text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
							@click="previewAnimation"
						>
							Preview
						</button>
						<button
							class="flex-1 rounded-lg bg-pink-600 py-2.5 text-sm font-medium text-white hover:bg-pink-700"
							@click="applyMagicMove"
						>
							Apply
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
