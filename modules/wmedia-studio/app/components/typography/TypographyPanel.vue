<script setup lang="ts">
const showTypography = ref(false);

const typography = ref({
	fontFamily: "Inter",
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 1.5,
	letterSpacing: 0,
	textAlign: "left",
	textTransform: "none",
	textDecoration: "none",
});

const fontWeights = [
	{ label: "Thin", value: 100 },
	{ label: "Light", value: 300 },
	{ label: "Regular", value: 400 },
	{ label: "Medium", value: 500 },
	{ label: "Semibold", value: 600 },
	{ label: "Bold", value: 700 },
];

const fonts = [
	"Inter",
	"Roboto",
	"Playfair Display",
	"Montserrat",
	"Open Sans",
];
</script>

<template>
	<div>
		<button
			class="fixed left-32 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-sky-400 ring-offset-2': showTypography }"
			@click="showTypography = !showTypography"
			title="Typography"
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
				<path d="M4 7V4h16v3" />
				<path d="M9 20h6" />
				<path d="M12 4v16" />
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
				v-if="showTypography"
				class="fixed left-0 top-0 z-40 h-screen w-80 overflow-hidden border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-sky-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Typography</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showTypography = false"
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
						<p
							class="text-center"
							:style="{
								fontFamily: typography.fontFamily,
								fontSize: `${typography.fontSize}px`,
								fontWeight: typography.fontWeight,
								lineHeight: typography.lineHeight,
								letterSpacing: `${typography.letterSpacing}px`,
								textAlign: typography.textAlign as any,
								textTransform: typography.textTransform as any,
								textDecoration: typography.textDecoration as any,
							}"
						>
							The quick brown fox
						</p>
					</div>

					<!-- Font Family -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Font Family</label>
						<select
							v-model="typography.fontFamily"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
						>
							<option v-for="font in fonts" :key="font" :value="font">
								{{ font }}
							</option>
						</select>
					</div>

					<!-- Font Size -->
					<div class="mb-4">
						<div class="mb-1 flex items-center justify-between">
							<label
								class="text-xs font-medium text-gray-700 dark:text-gray-300"
							>Size: {{ typography.fontSize }}px</label>
						</div>
						<input
							v-model.number="typography.fontSize"
							type="range"
							min="8"
							max="72"
							class="w-full"
						/>
					</div>

					<!-- Font Weight -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Weight</label>
						<div class="grid grid-cols-3 gap-2">
							<button
								v-for="weight in fontWeights"
								:key="weight.value"
								class="rounded-lg border py-2 text-xs"
								:class="typography.fontWeight === weight.value
								? 'border-sky-500 bg-sky-50 text-sky-700'
								: 'border-gray-200 dark:border-gray-700'"
								@click="typography.fontWeight = weight.value"
							>
								{{ weight.label }}
							</button>
						</div>
					</div>

					<!-- Line Height -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Line Height: {{ typography.lineHeight }}</label>
						<input
							v-model.number="typography.lineHeight"
							type="range"
							min="0.8"
							max="2.5"
							step="0.1"
							class="w-full"
						/>
					</div>

					<!-- Letter Spacing -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Letter Spacing: {{ typography.letterSpacing }}px</label>
						<input
							v-model.number="typography.letterSpacing"
							type="range"
							min="-2"
							max="10"
							step="0.5"
							class="w-full"
						/>
					</div>

					<!-- Text Align -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Align</label>
						<div class="flex rounded-lg border border-gray-200 dark:border-gray-700">
							<button
								v-for='align in ["left", "center", "right", "justify"]'
								:key="align"
								class="flex-1 py-2 text-xs capitalize"
								:class="typography.textAlign === align
								? 'bg-sky-600 text-white'
								: 'hover:bg-gray-50 dark:hover:bg-gray-800'"
								@click="typography.textAlign = align"
							>
								{{ align }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
