<script setup lang="ts">
const showVariants = ref(false);

interface ComponentVariant {
	id: string;
	name: string;
	state: "default" | "hover" | "active" | "disabled" | "focus" | "loading";
	styles: {
		backgroundColor?: string;
		color?: string;
		borderColor?: string;
		borderWidth?: number;
		borderRadius?: number;
		opacity?: number;
		scale?: number;
		shadow?: string;
	};
}

const variants = ref<ComponentVariant[]>([
	{
		id: "1",
		name: "Default",
		state: "default",
		styles: { backgroundColor: "#3b82f6", color: "#ffffff" },
	},
	{
		id: "2",
		name: "Hover",
		state: "hover",
		styles: { backgroundColor: "#2563eb", color: "#ffffff", scale: 1.02 },
	},
	{
		id: "3",
		name: "Active",
		state: "active",
		styles: { backgroundColor: "#1d4ed8", color: "#ffffff", scale: 0.98 },
	},
	{
		id: "4",
		name: "Disabled",
		state: "disabled",
		styles: { backgroundColor: "#9ca3af", color: "#ffffff", opacity: 0.6 },
	},
]);

const selectedVariant = ref<string>("1");
const previewState = ref<string>("default");

const addVariant = () => {
	const states: ComponentVariant["state"][] = [
		"default",
		"hover",
		"active",
		"disabled",
		"focus",
		"loading",
	];
	const unusedState =
		states.find((s) => !variants.value.some((v) => v.state === s)) || "focus";
	variants.value.push({
		id: crypto.randomUUID(),
		name: unusedState.charAt(0).toUpperCase() + unusedState.slice(1),
		state: unusedState,
		styles: { ...variants.value[0]!.styles }, // Fix undefined error with non-null assertion
	});
};

const stateIcons: Record<string, string> = {
	default: "○",
	hover: "↗",
	active: "●",
	disabled: "⊘",
	focus: "◎",
	loading: "⟳",
};

const applyVariant = () => {
	console.log("Apply variant to selected component");
};
</script>

<template>
	<div>
		<button
			class="fixed left-4 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-orange-400 ring-offset-2': showVariants }"
			@click="showVariants = !showVariants"
			title="Component Variants"
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
				<rect width="20" height="8" x="2" y="2" rx="2" />
				<rect width="20" height="8" x="2" y="14" rx="2" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="showVariants"
				class="fixed left-0 top-0 z-40 h-screen w-80 overflow-hidden border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-orange-600 to-amber-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Variants</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showVariants = false"
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

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Preview -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<div class="mb-3 flex items-center justify-between">
							<span class="text-xs font-medium text-gray-500">Preview</span>
							<select
								v-model="previewState"
								class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
							>
								<option v-for="v in variants" :key="v.id" :value="v.state">
									{{ v.name }}
								</option>
							</select>
						</div>
						<div class="flex justify-center py-4">
							<button
								class="rounded-lg px-6 py-3 font-medium transition-all duration-200"
								:style="variants.find((v) => v.state === previewState)?.styles"
								:disabled="previewState === 'disabled'"
							>
								Button
							</button>
						</div>
					</div>

					<!-- Variants List -->
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">
							States ({{ variants.length }})
						</h3>
						<button
							class="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700"
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
							Add
						</button>
					</div>

					<div class="space-y-2">
						<div
							v-for="variant in variants"
							:key="variant.id"
							class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-orange-300 dark:border-gray-700"
							:class="{
								'border-orange-500 bg-orange-50 dark:bg-orange-900/20':
									selectedVariant === variant.id,
							}"
							@click="selectedVariant = variant.id"
						>
							<div class="flex items-center gap-3">
								<span
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg dark:bg-gray-700"
								>
									{{ stateIcons[variant.state] }}
								</span>
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<input
											v-model="variant.name"
											type="text"
											class="bg-transparent text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
											@click.stop
										/>
										<span
											class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700"
										>{{ variant.state }}</span>
									</div>
								</div>
							</div>

							<!-- Quick Style Editor -->
							<div
								v-if="selectedVariant === variant.id"
								class="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700"
							>
								<div class="grid grid-cols-2 gap-2">
									<div>
										<label class="mb-1 block text-[10px] text-gray-500"
										>Background</label>
										<input
											v-model="variant.styles.backgroundColor"
											type="color"
											class="h-8 w-full rounded"
										/>
									</div>
									<div>
										<label class="mb-1 block text-[10px] text-gray-500"
										>Text</label>
										<input
											v-model="variant.styles.color"
											type="color"
											class="h-8 w-full rounded"
										/>
									</div>
								</div>
								<div>
									<label class="mb-1 block text-[10px] text-gray-500">Scale: {{
											variant.styles.scale ?? 1
										}}</label>
									<input
										v-model.number="variant.styles.scale"
										type="range"
										min="0.5"
										max="1.5"
										step="0.01"
										class="w-full"
									/>
								</div>
								<div>
									<label class="mb-1 block text-[10px] text-gray-500">Opacity:
										{{ variant.styles.opacity ?? 1 }}</label>
									<input
										v-model.number="variant.styles.opacity"
										type="range"
										min="0"
										max="1"
										step="0.1"
										class="w-full"
									/>
								</div>
							</div>
						</div>
					</div>

					<button
						class="mt-6 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700"
						@click="applyVariant"
					>
						Apply to Selected
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
