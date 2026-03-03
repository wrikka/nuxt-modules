<script setup lang="ts">
const showTypography = ref(false);
const fontFamily = ref("Inter");
const fontSize = ref(16);
const fontWeight = ref(400);
const lineHeight = ref(1.5);
const letterSpacing = ref(0);
const textAlign = ref<"left" | "center" | "right" | "justify">("left");
const textTransform = ref<"none" | "uppercase" | "lowercase" | "capitalize">(
	"none",
);
const textDecoration = ref<"none" | "underline" | "line-through" | "overline">(
	"none",
);

const fonts = [
	"Inter",
	"Roboto",
	"Open Sans",
	"Poppins",
	"Montserrat",
	"Playfair Display",
	"Fira Code",
];
const weights = [
	{ value: 100, name: "Thin" },
	{ value: 200, name: "Extra Light" },
	{ value: 300, name: "Light" },
	{ value: 400, name: "Regular" },
	{ value: 500, name: "Medium" },
	{ value: 600, name: "Semi Bold" },
	{ value: 700, name: "Bold" },
	{ value: 800, name: "Extra Bold" },
	{ value: 900, name: "Black" },
];
</script>

<template>
	<div>
		<button
			class="fixed right-76 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-rose-400 ring-offset-2': showTypography }"
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
				<polyline points="4 7 4 4 20 4 20 7" />
				<line x1="9" y1="20" x2="15" y2="20" />
				<line x1="12" y1="4" x2="12" y2="20" />
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
				v-if="showTypography"
				class="fixed right-76 bottom-20 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Typography</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showTypography = false"
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

				<div class="p-4 space-y-4 max-h-96 overflow-y-auto">
					<!-- Font Family -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block">Font Family</label>
						<select
							v-model="fontFamily"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
						>
							<option v-for="font in fonts" :key="font" :value="font">
								{{ font }}
							</option>
						</select>
					</div>

					<!-- Font Size -->
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Font Size</label>
							<span class="text-white text-xs">{{ fontSize }}px</span>
						</div>
						<input
							v-model.number="fontSize"
							type="range"
							min="8"
							max="72"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
						>
					</div>

					<!-- Font Weight -->
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Font Weight</label>
							<span class="text-white text-xs">{{
								weights.find(w => w.value === fontWeight)?.name
							}}</span>
						</div>
						<input
							v-model.number="fontWeight"
							type="range"
							min="100"
							max="900"
							step="100"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
						>
					</div>

					<!-- Line Height -->
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Line Height</label>
							<span class="text-white text-xs">{{ lineHeight }}</span>
						</div>
						<input
							v-model.number="lineHeight"
							type="range"
							min="0.8"
							max="3"
							step="0.1"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
						>
					</div>

					<!-- Letter Spacing -->
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Letter Spacing</label>
							<span class="text-white text-xs">{{ letterSpacing }}px</span>
						</div>
						<input
							v-model.number="letterSpacing"
							type="range"
							min="-2"
							max="10"
							step="0.5"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
						>
					</div>

					<!-- Text Align -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block">Text Align</label>
						<div class="flex rounded-lg bg-gray-800 p-1">
							<button
								v-for='align in ["left", "center", "right", "justify"] as const'
								:key="align"
								class="flex-1 p-1.5 rounded transition-colors"
								:class="textAlign === align
								? 'bg-rose-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="textAlign = align"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<line v-if="align === 'left'" x1="3" y1="6" x2="21" y2="6" />
									<line
										v-if="align === 'left'"
										x1="3"
										y1="12"
										x2="15"
										y2="12"
									/>
									<line
										v-if="align === 'left'"
										x1="3"
										y1="18"
										x2="18"
										y2="18"
									/>
									<line
										v-if="align === 'center'"
										x1="3"
										y1="6"
										x2="21"
										y2="6"
									/>
									<line
										v-if="align === 'center'"
										x1="6"
										y1="12"
										x2="18"
										y2="12"
									/>
									<line
										v-if="align === 'center'"
										x1="4"
										y1="18"
										x2="20"
										y2="18"
									/>
									<line v-if="align === 'right'" x1="3" y1="6" x2="21" y2="6" />
									<line
										v-if="align === 'right'"
										x1="9"
										y1="12"
										x2="21"
										y2="12"
									/>
									<line
										v-if="align === 'right'"
										x1="6"
										y1="18"
										x2="21"
										y2="18"
									/>
									<line
										v-if="align === 'justify'"
										x1="3"
										y1="6"
										x2="21"
										y2="6"
									/>
									<line
										v-if="align === 'justify'"
										x1="3"
										y1="12"
										x2="21"
										y2="12"
									/>
									<line
										v-if="align === 'justify'"
										x1="3"
										y1="18"
										x2="21"
										y2="18"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Text Transform -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block"
						>Text Transform</label>
						<div class="flex rounded-lg bg-gray-800 p-1">
							<button
								v-for='t in ["none", "uppercase", "lowercase", "capitalize"] as const'
								:key="t"
								class="flex-1 px-2 py-1.5 text-xs rounded transition-colors capitalize"
								:class="textTransform === t
								? 'bg-rose-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="textTransform = t"
							>
								{{ t }}
							</button>
						</div>
					</div>

					<!-- Text Decoration -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block"
						>Text Decoration</label>
						<div class="flex rounded-lg bg-gray-800 p-1">
							<button
								v-for='d in ["none", "underline", "line-through", "overline"] as const'
								:key="d"
								class="flex-1 px-2 py-1.5 text-xs rounded transition-colors capitalize"
								:class="textDecoration === d
								? 'bg-rose-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="textDecoration = d"
							>
								{{ d === "line-through" ? "Strike" : d }}
							</button>
						</div>
					</div>

					<!-- Preview -->
					<div class="border-t border-gray-800 pt-4">
						<label class="text-gray-400 text-xs mb-2 block">Preview</label>
						<div class="p-4 rounded-lg bg-gray-800">
							<p
								class="text-white"
								:style="{
									fontFamily,
									fontSize: `${fontSize}px`,
									fontWeight,
									lineHeight,
									letterSpacing: `${letterSpacing}px`,
									textAlign,
									textTransform,
									textDecoration,
								}"
							>
								The quick brown fox jumps over the lazy dog.
							</p>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
