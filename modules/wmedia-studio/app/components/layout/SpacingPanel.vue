<script setup lang="ts">
const showSpacing = ref(false);

const spacing = ref({
	marginTop: 0,
	marginRight: 0,
	marginBottom: 0,
	marginLeft: 0,
	paddingTop: 16,
	paddingRight: 16,
	paddingBottom: 16,
	paddingLeft: 16,
});

const linked = ref({
	margin: false,
	padding: true,
});

const updateAllMargins = (value: number) => {
	spacing.value.marginTop = value;
	spacing.value.marginRight = value;
	spacing.value.marginBottom = value;
	spacing.value.marginLeft = value;
};

const updateAllPadding = (value: number) => {
	spacing.value.paddingTop = value;
	spacing.value.paddingRight = value;
	spacing.value.paddingBottom = value;
	spacing.value.paddingLeft = value;
};
</script>

<template>
	<div>
		<button
			class="fixed right-20 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-500 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-slate-400 ring-offset-2': showSpacing }"
			@click="showSpacing = !showSpacing"
			title="Spacing"
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
				<rect width="18" height="18" x="3" y="3" rx="2" />
				<path d="M9 3v18" />
				<path d="M15 3v18" />
				<path d="M3 9h18" />
				<path d="M3 15h18" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showSpacing"
				class="fixed bottom-20 right-20 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-slate-500 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Spacing</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showSpacing = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
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

				<div class="p-4">
					<!-- Visual Box Model -->
					<div class="mb-6 flex justify-center">
						<div class="relative rounded bg-orange-100 p-8 dark:bg-orange-900/20">
							<span class="absolute left-2 top-1 text-[10px] text-orange-600"
							>margin</span>
							<div class="rounded bg-blue-100 p-6 dark:bg-blue-900/20">
								<span class="absolute left-10 top-9 text-[10px] text-blue-600"
								>padding</span>
								<div class="h-16 w-16 rounded bg-white shadow-sm" />
							</div>
						</div>
					</div>

					<!-- Margin -->
					<div class="mb-4">
						<div class="mb-2 flex items-center justify-between">
							<label class="text-sm font-medium text-gray-900 dark:text-white"
							>Margin</label>
							<label class="flex items-center gap-1 text-xs">
								<input
									v-model="linked.margin"
									type="checkbox"
									class="rounded"
								/>
								<span class="text-gray-500">Link</span>
							</label>
						</div>
						<div v-if="linked.margin" class="flex items-center gap-2">
							<input
								type="number"
								:value="spacing.marginTop"
								@input="updateAllMargins(
									Number(($event.target as HTMLInputElement).value),
								)"
								class="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<span class="text-xs text-gray-500">px</span>
						</div>
						<div v-else class="grid grid-cols-2 gap-2">
							<input
								v-model.number="spacing.marginTop"
								type="number"
								placeholder="Top"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.marginRight"
								type="number"
								placeholder="Right"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.marginBottom"
								type="number"
								placeholder="Bottom"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.marginLeft"
								type="number"
								placeholder="Left"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
						</div>
					</div>

					<!-- Padding -->
					<div>
						<div class="mb-2 flex items-center justify-between">
							<label class="text-sm font-medium text-gray-900 dark:text-white"
							>Padding</label>
							<label class="flex items-center gap-1 text-xs">
								<input
									v-model="linked.padding"
									type="checkbox"
									class="rounded"
								/>
								<span class="text-gray-500">Link</span>
							</label>
						</div>
						<div v-if="linked.padding" class="flex items-center gap-2">
							<input
								type="number"
								:value="spacing.paddingTop"
								@input="updateAllPadding(
									Number(($event.target as HTMLInputElement).value),
								)"
								class="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<span class="text-xs text-gray-500">px</span>
						</div>
						<div v-else class="grid grid-cols-2 gap-2">
							<input
								v-model.number="spacing.paddingTop"
								type="number"
								placeholder="Top"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.paddingRight"
								type="number"
								placeholder="Right"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.paddingBottom"
								type="number"
								placeholder="Bottom"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
							<input
								v-model.number="spacing.paddingLeft"
								type="number"
								placeholder="Left"
								class="rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-slate-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-600">
						Apply Spacing
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
