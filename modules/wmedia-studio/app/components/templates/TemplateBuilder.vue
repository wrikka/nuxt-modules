<script setup lang="ts">
import type { Template } from "#shared/types";

const emit = defineEmits<{
	(e: "close"): void;
	(e: "save", template: Partial<Template>): void;
}>();

interface BuilderElement {
	id: string;
	type: "text" | "image" | "shape" | "background" | "icon";
	name: string;
	icon: string;
}

const canvasWidth = ref(1080);
const canvasHeight = ref(1080);
const canvasBackground = ref("#ffffff");
const templateName = ref("Untitled Template");
const selectedCategory = ref<Template["category"]>("social-media");
const selectedElements = ref<string[]>([]);
const isDragging = ref(false);

const availableElements: BuilderElement[] = [
	{
		id: "header-text",
		type: "text",
		name: "Header Text",
		icon: "i-mdi-format-header-1",
	},
	{
		id: "body-text",
		type: "text",
		name: "Body Text",
		icon: "i-mdi-format-align-left",
	},
	{
		id: "cta-text",
		type: "text",
		name: "Call-to-Action",
		icon: "i-mdi-hand-pointing-right",
	},
	{
		id: "placeholder-image",
		type: "image",
		name: "Image Placeholder",
		icon: "i-mdi-image",
	},
	{
		id: "logo-area",
		type: "image",
		name: "Logo Area",
		icon: "i-mdi-vector-square",
	},
	{
		id: "rectangle",
		type: "shape",
		name: "Rectangle",
		icon: "i-mdi-rectangle",
	},
	{ id: "circle", type: "shape", name: "Circle", icon: "i-mdi-circle" },
	{ id: "line", type: "shape", name: "Line", icon: "i-mdi-minus" },
	{
		id: "solid-bg",
		type: "background",
		name: "Solid Background",
		icon: "i-mdi-format-color-fill",
	},
	{
		id: "gradient-bg",
		type: "background",
		name: "Gradient Background",
		icon: "i-mdi-gradient",
	},
	{
		id: "pattern-bg",
		type: "background",
		name: "Pattern Background",
		icon: "i-mdi-texture",
	},
	{
		id: "social-icons",
		type: "icon",
		name: "Social Icons",
		icon: "i-mdi-share-variant",
	},
	{
		id: "contact-icons",
		type: "icon",
		name: "Contact Icons",
		icon: "i-mdi-card-account-details",
	},
	{ id: "decorative", type: "icon", name: "Decorative", icon: "i-mdi-star" },
];

const elementCategories = [
	{ id: "text", name: "Text", icon: "i-mdi-format-text" },
	{ id: "image", name: "Images", icon: "i-mdi-image" },
	{ id: "shape", name: "Shapes", icon: "i-mdi-shapes" },
	{ id: "background", name: "Backgrounds", icon: "i-mdi-wallpaper" },
	{ id: "icon", name: "Icons", icon: "i-mdi-emoticon" },
];

const activeCategory = ref("text");

const filteredElements = computed(() => {
	return availableElements.filter(el => el.type === activeCategory.value);
});

const toggleElement = (elementId: string) => {
	const index = selectedElements.value.indexOf(elementId);
	if (index > -1) {
		selectedElements.value.splice(index, 1);
	} else {
		selectedElements.value.push(elementId);
	}
};

const canvasStyle = computed(() => ({
	width: `${canvasWidth.value}px`,
	height: `${canvasHeight.value}px`,
	backgroundColor: canvasBackground.value,
}));

const saveTemplate = () => {
	emit("save", {
		name: templateName.value,
		category: selectedCategory.value,
		width: canvasWidth.value,
		height: canvasHeight.value,
		backgroundColor: canvasBackground.value,
		elements: selectedElements.value,
	});
};

const presetSizes = [
	{ name: "Instagram Post", w: 1080, h: 1080 },
	{ name: "Instagram Story", w: 1080, h: 1920 },
	{ name: "YouTube Thumbnail", w: 1280, h: 720 },
	{ name: "A4 Paper", w: 2480, h: 3508 },
	{ name: "Business Card", w: 1050, h: 600 },
];

const applyPreset = (w: number, h: number) => {
	canvasWidth.value = w;
	canvasHeight.value = h;
};

const zoomLevel = ref(50);

const zoomStyle = computed(() => ({
	transform: `scale(${zoomLevel.value / 100})`,
	transformOrigin: "top left",
}));
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-4">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							Template Builder
						</h2>
						<input
							v-model="templateName"
							type="text"
							class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
							placeholder="Template name"
						/>
					</div>
					<div class="flex items-center gap-3">
						<select
							v-model="selectedCategory"
							class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
						>
							<option value="social-media">Social Media</option>
							<option value="poster">Poster</option>
							<option value="flyer">Flyer</option>
							<option value="business-card">Business Card</option>
							<option value="presentation">Presentation</option>
							<option value="banner">Banner</option>
						</select>
						<button
							class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
							@click="saveTemplate"
						>
							<i class="i-mdi-content-save mr-1" />
							Save Template
						</button>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Main Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left Sidebar - Elements -->
					<div class="w-72 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
						<div class="p-4 border-b border-gray-200 dark:border-gray-700">
							<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
								Elements
							</h3>
							<div class="grid grid-cols-5 gap-1">
								<button
									v-for="cat in elementCategories"
									:key="cat.id"
									class="p-2 rounded-lg transition-colors"
									:class="activeCategory === cat.id
									? 'bg-blue-600 text-white'
									: 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'"
									:title="cat.name"
									@click="activeCategory = cat.id"
								>
									<i :class="cat.icon" />
								</button>
							</div>
						</div>

						<div class="flex-1 overflow-y-auto p-4">
							<div class="space-y-2">
								<button
									v-for="element in filteredElements"
									:key="element.id"
									class="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
									:class="selectedElements.includes(element.id)
									? 'ring-2 ring-blue-500 border-blue-500'
									: ''"
									@click="toggleElement(element.id)"
								>
									<i :class="element.icon" class="text-gray-500" />
									<span class="text-sm text-gray-700 dark:text-gray-300">{{
										element.name
									}}</span>
									<i
										v-if="selectedElements.includes(element.id)"
										class="i-mdi-check-circle text-green-500 ml-auto"
									/>
								</button>
							</div>
						</div>

						<!-- Quick Size Presets -->
						<div class="p-4 border-t border-gray-200 dark:border-gray-700">
							<h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
								Quick Size
							</h4>
							<div class="grid grid-cols-2 gap-2">
								<button
									v-for="preset in presetSizes"
									:key="preset.name"
									class="px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
									@click="applyPreset(preset.w, preset.h)"
								>
									{{ preset.name }}
								</button>
							</div>
						</div>
					</div>

					<!-- Center - Canvas -->
					<div class="flex-1 bg-gray-200 dark:bg-gray-900 overflow-auto p-8">
						<div class="flex items-center justify-center min-h-full">
							<div
								class="relative bg-white shadow-2xl transition-all"
								:style="[canvasStyle, zoomStyle]"
							>
								<!-- Grid -->
								<div
									class="absolute inset-0 pointer-events-none"
									style="background-image:
	linear-gradient(#00000005 1px, transparent 1px),
	linear-gradient(90deg, #00000005 1px, transparent 1px); background-size: 20px 20px"
								/>

								<!-- Placeholder Elements -->
								<div class="absolute inset-8 flex flex-col items-center justify-center text-center">
									<template
										v-for="element in availableElements.filter(e =>
											selectedElements.includes(e.id)
										)"
										:key="element.id"
									>
										<div
											v-if="element.type === 'text'"
											class="w-full p-4 mb-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50"
										>
											<i
												:class="element.icon"
												class="text-blue-500 mb-2 block"
											/>
											<span class="text-sm text-blue-600 font-medium">{{
												element.name
											}}</span>
										</div>
										<div
											v-else-if="element.type === 'image'"
											class="w-32 h-32 mb-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50/50 flex items-center justify-center"
										>
											<i
												:class="element.icon"
												class="text-green-500 text-2xl"
											/>
										</div>
										<div
											v-else-if="element.type === 'shape'"
											class="w-24 h-24 mb-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50/50 flex items-center justify-center"
										>
											<i
												:class="element.icon"
												class="text-purple-500 text-2xl"
											/>
										</div>
									</template>

									<div
										v-if="selectedElements.length === 0"
										class="text-gray-400"
									>
										<i class="i-mdi-shape-plus text-4xl mb-4 block" />
										<p>
											Select elements from the sidebar to build your template
										</p>
									</div>
								</div>

								<!-- Dimensions Label -->
								<div class="absolute -bottom-8 left-0 right-0 text-center text-sm text-gray-500">
									{{ canvasWidth }} × {{ canvasHeight }} px
								</div>
							</div>
						</div>
					</div>

					<!-- Right Sidebar - Properties -->
					<div class="w-72 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
							Canvas Properties
						</h3>

						<div class="space-y-4">
							<div>
								<label
									class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
								>Width (px)</label>
								<input
									v-model.number="canvasWidth"
									type="number"
									min="100"
									max="8000"
									class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
								/>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
								>Height (px)</label>
								<input
									v-model.number="canvasHeight"
									type="number"
									min="100"
									max="8000"
									class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
								/>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
								>Background</label>
								<div class="flex gap-2">
									<input
										v-model="canvasBackground"
										type="color"
										class="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
									/>
									<input
										v-model="canvasBackground"
										type="text"
										class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
									/>
								</div>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
								>Zoom</label>
								<input
									v-model.number="zoomLevel"
									type="range"
									min="10"
									max="200"
									class="w-full"
								/>
								<span class="text-xs text-gray-500">{{ zoomLevel }}%</span>
							</div>
						</div>

						<!-- Selected Elements Summary -->
						<div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
							<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
								Selected ({{ selectedElements.length }})
							</h4>
							<div class="space-y-1">
								<div
									v-for="elementId in selectedElements"
									:key="elementId"
									class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg text-sm"
								>
									<span class="text-gray-700 dark:text-gray-300">
										{{ availableElements.find(e => e.id === elementId)?.name }}
									</span>
									<button
										class="text-red-500 hover:text-red-600"
										@click="toggleElement(elementId)"
									>
										<i class="i-mdi-close" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
