<script setup lang="ts">
const showAssetLibrary = ref(false);
const activeCategory = ref<
	"all" | "colors" | "fonts" | "components" | "images"
>("all");

const assets = ref({
	colors: [
		{ name: "Primary Blue", value: "#3b82f6" },
		{ name: "Secondary Purple", value: "#8b5cf6" },
		{ name: "Accent Pink", value: "#ec4899" },
	],
	fonts: [
		{ name: "Inter", family: "Inter, sans-serif" },
		{ name: "Playfair Display", family: "'Playfair Display', serif" },
	],
	components: [
		{ name: "Button Primary", type: "button" },
		{ name: "Card Default", type: "card" },
	],
});

const applyColor = (color: string) => {
	console.log("Apply color:", color);
};

const applyFont = (font: string) => {
	console.log("Apply font:", font);
};
</script>

<template>
	<div>
		<button
			class="fixed left-20 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition-transform hover:scale-110"
			@click="showAssetLibrary = !showAssetLibrary"
			title="Asset Library"
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
				<path d="m7.5 4.27 9 5.15" />
				<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
				<path d="m3.3 7 8.7 5 8.7-5" />
				<path d="M12 22V12" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="showAssetLibrary"
				class="fixed bottom-20 left-20 z-50 w-80 max-h-[60vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-amber-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Team Assets</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showAssetLibrary = false"
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

				<div class="flex border-b border-gray-200 dark:border-gray-700">
					<button
						v-for='cat in ["all", "colors", "fonts", "components"] as const'
						:key="cat"
						class="flex-1 py-2 text-xs font-medium capitalize"
						:class="activeCategory === cat
						? 'text-amber-600 border-b-2 border-amber-600'
						: 'text-gray-500'"
						@click="activeCategory = cat"
					>
						{{ cat }}
					</button>
				</div>

				<div class="max-h-[40vh] overflow-y-auto p-4">
					<!-- Colors -->
					<div
						v-if="activeCategory === 'all' || activeCategory === 'colors'"
						class="mb-4"
					>
						<h4 class="mb-2 text-xs font-medium text-gray-500">Brand Colors</h4>
						<div class="grid grid-cols-4 gap-2">
							<div
								v-for="color in assets.colors"
								:key="color.name"
								class="group relative aspect-square cursor-pointer rounded-lg"
								:style="{ backgroundColor: color.value }"
								@click="applyColor(color.value)"
							>
								<span
									class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-medium text-white drop-shadow-md"
								>
									{{ color.name }}
								</span>
							</div>
						</div>
					</div>

					<!-- Fonts -->
					<div v-if="activeCategory === 'all' || activeCategory === 'fonts'">
						<h4 class="mb-2 text-xs font-medium text-gray-500">Brand Fonts</h4>
						<div class="space-y-2">
							<button
								v-for="font in assets.fonts"
								:key="font.name"
								class="w-full rounded-lg border border-gray-200 p-3 text-left hover:border-amber-500 dark:border-gray-700"
								@click="applyFont(font.family)"
							>
								<p
									class="font-medium text-gray-900 dark:text-white"
									:style="{ fontFamily: font.family }"
								>
									{{ font.name }}
								</p>
								<p class="text-xs text-gray-500">{{ font.family }}</p>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
