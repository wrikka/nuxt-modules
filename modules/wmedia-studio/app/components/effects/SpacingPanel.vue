<script setup lang="ts">
const showSpacing = ref(false);
const marginTop = ref(0);
const marginRight = ref(0);
const marginBottom = ref(0);
const marginLeft = ref(0);
const paddingTop = ref(0);
const paddingRight = ref(0);
const paddingBottom = ref(0);
const paddingLeft = ref(0);
const linkMargins = ref(true);
const linkPaddings = ref(true);

const updateAllMargins = (value: number) => {
	if (linkMargins.value) {
		marginTop.value = value;
		marginRight.value = value;
		marginBottom.value = value;
		marginLeft.value = value;
	}
};

const updateAllPaddings = (value: number) => {
	if (linkPaddings.value) {
		paddingTop.value = value;
		paddingRight.value = value;
		paddingBottom.value = value;
		paddingLeft.value = value;
	}
};
</script>

<template>
	<div>
		<button
			class="fixed right-112 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-orange-400 ring-offset-2': showSpacing }"
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
				<rect x="4" y="4" width="16" height="16" rx="2" />
				<rect x="8" y="8" width="8" height="8" rx="1" />
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
				class="fixed right-112 bottom-20 z-50 w-72 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Spacing</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
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
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="p-4 space-y-4">
					<!-- Margin -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="text-orange-400 text-sm font-medium">Margin</label>
							<button
								class="p-1 rounded hover:bg-gray-800 text-gray-400 transition-colors"
								@click="linkMargins = !linkMargins"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									:class="linkMargins ? 'text-orange-400' : 'text-gray-500'"
								>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
								</svg>
							</button>
						</div>

						<!-- Margin Visual Box -->
						<div class="relative p-6 bg-gray-800 rounded-lg">
							<div class="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
								<input
									v-model.number="marginTop"
									type="number"
									class="w-12 bg-gray-900 text-center text-xs text-orange-400 rounded px-1 py-0.5"
								/>
							</div>
							<div class="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
								<input
									v-model.number="marginBottom"
									type="number"
									class="w-12 bg-gray-900 text-center text-xs text-orange-400 rounded px-1 py-0.5"
								/>
							</div>
							<div class="absolute left-1 top-1/2 -translate-y-1/2">
								<input
									v-model.number="marginLeft"
									type="number"
									class="w-12 bg-gray-900 text-center text-xs text-orange-400 rounded px-1 py-0.5"
								/>
							</div>
							<div class="absolute right-1 top-1/2 -translate-y-1/2">
								<input
									v-model.number="marginRight"
									type="number"
									class="w-12 bg-gray-900 text-center text-xs text-orange-400 rounded px-1 py-0.5"
								/>
							</div>

							<!-- Padding Box -->
							<div class="p-4 bg-gray-700 rounded">
								<div class="h-12 bg-orange-600 bg-opacity-30 rounded flex items-center justify-center">
									<span class="text-xs text-gray-400">Content</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Padding -->
					<div class="border-t border-gray-800 pt-4">
						<div class="flex items-center justify-between mb-2">
							<label class="text-blue-400 text-sm font-medium">Padding</label>
							<button
								class="p-1 rounded hover:bg-gray-800 text-gray-400 transition-colors"
								@click="linkPaddings = !linkPaddings"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									:class="linkPaddings ? 'text-blue-400' : 'text-gray-500'"
								>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
								</svg>
							</button>
						</div>

						<div class="grid grid-cols-2 gap-2">
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">Top</label>
								<input
									v-model.number="paddingTop"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block"
								>Right</label>
								<input
									v-model.number="paddingRight"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block"
								>Bottom</label>
								<input
									v-model.number="paddingBottom"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">Left</label>
								<input
									v-model.number="paddingLeft"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
