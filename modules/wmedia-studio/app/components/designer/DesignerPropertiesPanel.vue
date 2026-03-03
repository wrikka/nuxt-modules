<script setup lang="ts">
import ArtboardPresets from "./ArtboardPresets.vue";
import BlendModeEditor from "./BlendModeEditor.vue";
import ChartGenerator from "./ChartGenerator.vue";
import type { ChartConfig } from "./ChartGenerator.vue";
import ColorPicker from "./ColorPicker.vue";
import CommentsPanel from "./CommentsPanel.vue";
import ComponentPanel from "./ComponentPanel.vue";
import CropTool from "./CropTool.vue";
import DesignTokensPanel from "./DesignTokensPanel.vue";
import type { TokenCategory } from "./DesignTokensPanel.vue";
import DistributePanel from "./DistributePanel.vue";
import ExportPresets from "./ExportPresets.vue";
import GradientEditor from "./GradientEditor.vue";
import ImageFilters from "./ImageFilters.vue";
import LottiePanel from "./LottiePanel.vue";
import type { LottieAnimation } from "./LottiePanel.vue";
import MultiArtboardPanel from "./MultiArtboardPanel.vue";
import PatternSelector from "./PatternSelector.vue";
import QRCodeGenerator from "./QRCodeGenerator.vue";
import type { QRCodeConfig } from "./QRCodeGenerator.vue";
import RotationFlipPanel from "./RotationFlipPanel.vue";
import ShadowEditor from "./ShadowEditor.vue";
import ShapeLibrary from "./ShapeLibrary.vue";
import SmartGuidesPanel from "./SmartGuidesPanel.vue";
import SpacingDisplay from "./SpacingDisplay.vue";
import type { SpacingMeasurement } from "./SpacingDisplay.vue";
import StrokeStyleEditor from "./StrokeStyleEditor.vue";
import TextStylesPanel from "./TextStylesPanel.vue";
import Transform3DPanel from "./Transform3DPanel.vue";
import type { Transform3D } from "./Transform3DPanel.vue";
import VersionHistory from "./VersionHistory.vue";

import type { DesignerSelectedObject } from "#shared/types/element";

interface Props {
	selected: DesignerSelectedObject | null;
}

const props = withDefaults(defineProps<Props>(), {
	selected: null,
});

// Type definitions for model states
interface ShadowModel {
	enabled: boolean;
	color: string;
	blur: number;
	offsetX: number;
	offsetY: number;
}

interface StrokeModel {
	dashArray: number[] | null;
	lineCap: "butt" | "round" | "square";
	cornerRadius: number;
}

interface BlendModel {
	opacity: number;
	blendMode: string;
}

const emit = defineEmits<{
	update: [property: string, value: unknown];
	addShape: [shapeType: string];
	applyTextStyle: [style: { fontSize: number; fontWeight: string }];
	applyCrop: [crop: { x: number; y: number; width: number; height: number }];
	rotate: [angle: number];
	flip: [direction: "horizontal" | "vertical"];
	distribute: [direction: "horizontal" | "vertical", method: string];
	applyArtboardPreset: [preset: { width: number; height: number }];
	applyPattern: [pattern: string, color: string];
	export: [preset: { id: string; name: string; format: string }];
	addComment: [comment: { x: number; y: number; text: string }];
	resolveComment: [commentId: string];
	deleteComment: [commentId: string];
}>();

// Tab definitions with strict typing
type TabId = "properties" | "styles" | "tools" | "advanced";

interface TabItem {
	id: TabId;
	label: string;
	icon: string;
}

const TABS: TabItem[] = [
	{ id: "properties", label: "Props", icon: "⚡" },
	{ id: "styles", label: "Styles", icon: "🎨" },
	{ id: "tools", label: "Tools", icon: "🛠️" },
	{ id: "advanced", label: "Advanced", icon: "⚙️" },
];

const activeTab = ref<TabId>("properties");

const asNumber = (v: string | number): number => {
	if (typeof v === "number") return v;
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

const emitUpdate = (
	property: keyof DesignerSelectedObject,
	value: DesignerSelectedObject[keyof DesignerSelectedObject],
): void => {
	emit("update", property as string, value);
};

const selectedWidth = computed(() => props.selected?.width ?? 100);
const selectedHeight = computed(() => props.selected?.height ?? 100);

const isTextObject = computed(() => props.selected?.objectType === "textbox");
const isImageObject = computed(() => props.selected?.objectType === "image");
const colorModel = ref("#3B82F6");

const gradientModel = ref({
	type: "linear" as "linear" | "radial",
	angle: 90,
	stops: [
		{ position: 0, color: "#3B82F6" },
		{ position: 100, color: "#8B5CF6" },
	],
});

const shadowModel = ref<ShadowModel>({
	enabled: false,
	color: "rgba(0, 0, 0, 0.3)",
	blur: 10,
	offsetX: 0,
	offsetY: 4,
});

// Sync shadow model with selected prop
watch(() => props.selected?.shadow, (shadow) => {
	shadowModel.value.enabled = !!shadow;
}, { immediate: true });

const strokeModel = ref<StrokeModel>({
	dashArray: null,
	lineCap: "butt",
	cornerRadius: 0,
});

// Sync stroke model with selected prop
watch(() => props.selected, (selected) => {
	if (selected) {
		strokeModel.value.dashArray = selected.strokeDashArray ?? null;
		strokeModel.value.lineCap = selected.strokeLineCap ?? "butt";
		strokeModel.value.cornerRadius = selected.rx ?? 0;
	}
}, { immediate: true, deep: true });

const blendModel = ref<BlendModel>({
	opacity: 100,
	blendMode: "normal",
});

// Sync blend model with selected prop
watch(() => props.selected, (selected) => {
	if (selected) {
		blendModel.value.opacity = selected.opacity ?? 100;
		blendModel.value.blendMode = selected.blendMode || "normal";
	}
}, { immediate: true, deep: true });

const DEFAULT_IMAGE_FILTERS: Required<DesignerSelectedObject>["imageFilters"] =
	{
		blur: 0,
		brightness: 100,
		contrast: 100,
		saturation: 100,
		hueRotate: 0,
		sepia: 0,
		grayscale: 0,
		invert: 0,
	};

const imageFiltersModel = ref<Required<DesignerSelectedObject>["imageFilters"]>(
	{ ...DEFAULT_IMAGE_FILTERS },
);

// Sync image filters with selected prop
watch(() => props.selected?.imageFilters, (filters) => {
	imageFiltersModel.value = filters
		? { ...DEFAULT_IMAGE_FILTERS, ...filters }
		: { ...DEFAULT_IMAGE_FILTERS };
}, { immediate: true, deep: true });

const cropModel = ref({
	enabled: false,
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	aspectRatio: null as number | null,
});

const rotationModel = ref<{ angle: number }>({ angle: 0 });

// Sync rotation model with selected prop
watch(() => props.selected?.angle, (angle) => {
	rotationModel.value.angle = angle || 0;
}, { immediate: true });

const smartGuidesModel = ref({
	enabled: true,
	snapToObjects: true,
	snapToGuides: true,
	snapToGrid: false,
	showDistances: true,
});

const spacingModel = ref<SpacingMeasurement[]>([]);

const artboardPresetsModel = ref({
	selectedCategory: "social",
});

const patternModel = ref<{
	selectedPattern: string | null;
	color: string;
	opacity: number;
	size: number;
}>({
	selectedPattern: "none",
	color: "#3B82F6",
	opacity: 10,
	size: 20,
});

const lottieModel = ref<LottieAnimation | null>(null);

const qrCodeModel = ref<QRCodeConfig>({
	data: "https://example.com",
	size: 200,
	color: "#000000",
	backgroundColor: "#FFFFFF",
	errorCorrection: "M",
});

const chartModel = ref<ChartConfig>({
	type: "bar",
	width: 600,
	height: 400,
	title: "Chart Title",
	showLegend: true,
	showGrid: true,
	data: {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [],
	},
});

const transform3DModel = ref<Transform3D>({
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	translateX: 0,
	translateY: 0,
	translateZ: 0,
	scale: 1,
	perspective: 1000,
});

const tokenCategories = ref<TokenCategory[]>([
	{
		id: "colors",
		name: "Colors",
		tokens: [
			{
				id: "primary",
				name: "Primary",
				type: "color",
				value: "#3B82F6",
				category: "colors",
			},
			{
				id: "secondary",
				name: "Secondary",
				type: "color",
				value: "#8B5CF6",
				category: "colors",
			},
			{
				id: "success",
				name: "Success",
				type: "color",
				value: "#10B981",
				category: "colors",
			},
			{
				id: "danger",
				name: "Danger",
				type: "color",
				value: "#EF4444",
				category: "colors",
			},
		],
	},
	{
		id: "typography",
		name: "Typography",
		tokens: [
			{
				id: "heading-1",
				name: "Heading 1",
				type: "typography",
				value: "2.25rem",
				category: "typography",
			},
			{
				id: "heading-2",
				name: "Heading 2",
				type: "typography",
				value: "1.875rem",
				category: "typography",
			},
			{
				id: "body",
				name: "Body",
				type: "typography",
				value: "1rem",
				category: "typography",
			},
		],
	},
	{
		id: "spacing",
		name: "Spacing",
		tokens: [
			{
				id: "xs",
				name: "Extra Small",
				type: "spacing",
				value: 4,
				category: "spacing",
			},
			{
				id: "sm",
				name: "Small",
				type: "spacing",
				value: 8,
				category: "spacing",
			},
			{
				id: "md",
				name: "Medium",
				type: "spacing",
				value: 16,
				category: "spacing",
			},
			{
				id: "lg",
				name: "Large",
				type: "spacing",
				value: 24,
				category: "spacing",
			},
		],
	},
]);

const selectedTokenId = ref<string | null>(null);

// Handlers
const handleShadowChange = () => {
	if (shadowModel.value.enabled) {
		emitUpdate(
			"shadow",
			JSON.stringify({
				color: shadowModel.value.color,
				blur: shadowModel.value.blur,
				offsetX: shadowModel.value.offsetX,
				offsetY: shadowModel.value.offsetY,
			}),
		);
	} else {
		emitUpdate("shadow", undefined);
	}
};

const handleTextStyleSelect = (
	style: { fontSize: number; fontWeight: string },
) => {
	emit("applyTextStyle", style);
	emitUpdate("fontSize", style.fontSize);
	emitUpdate("fontWeight", style.fontWeight);
};

const handleShapeSelect = (
	shape: { id: string; name: string; category: string; svg: string },
) => {
	emit("addShape", shape.id);
};

const handleCropApply = () => {
	emit("applyCrop", {
		x: cropModel.value.x,
		y: cropModel.value.y,
		width: cropModel.value.width,
		height: cropModel.value.height,
	});
};

const handleRotate = (angle: number) => {
	emit("rotate", angle);
	rotationModel.value.angle = (rotationModel.value.angle + angle) % 360;
};

const handleFlip = (direction: "horizontal" | "vertical") => {
	emit("flip", direction);
};

const handleDistribute = (
	direction: "horizontal" | "vertical",
	method: string,
) => {
	emit("distribute", direction, method);
};

const handleArtboardPreset = (preset: { width: number; height: number }) => {
	emit("applyArtboardPreset", preset);
};

const handlePatternApply = (pattern: string, color: string) => {
	emit("applyPattern", pattern, color);
};

const handleExport = (preset: { id: string; name: string; format: string }) => {
	emit("export", preset);
};

const handleAddComment = (position: { x: number; y: number }) => {
	emit("addComment", { ...position, text: "" });
};

const handleResolveComment = (commentId: string) => {
	emit("resolveComment", commentId);
};

const handleDeleteComment = (commentId: string) => {
	emit("deleteComment", commentId);
};
</script>

<template>
	<div class="w-80 bg-white dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 flex flex-col h-full">
		<!-- Header with Tabs -->
		<div class="border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-3">
				<h2 class="text-sm font-semibold text-gray-900 dark:text-white">
					Designer Tools
				</h2>
			</div>
			<div class="flex border-t border-gray-200 dark:border-gray-600">
				<button
					v-for="tab in TABS"
					:key="tab.id"
					class="flex-1 px-2 py-2 text-xs font-medium transition-colors border-b-2 flex items-center justify-center gap-1"
					:class="activeTab === tab.id
					? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
					: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
					@click="activeTab = tab.id"
				>
					<span>{{ tab.icon }}</span>
					<span>{{ tab.label }}</span>
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div class="flex-1 overflow-y-auto">
			<!-- PROPERTIES TAB -->
			<div v-if="activeTab === 'properties'" class="p-4 space-y-4">
				<div
					v-if="!props.selected"
					class="text-sm text-gray-500 dark:text-gray-400 text-center py-8"
				>
					Select an element to edit properties
				</div>
				<div v-else class="space-y-4">
					<!-- Position & Size -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>X Position</label>
							<input
								type="number"
								:value="props.selected.left"
								class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@input="emitUpdate(
									'left',
									asNumber(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Y Position</label>
							<input
								type="number"
								:value="props.selected.top"
								class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@input="emitUpdate(
									'top',
									asNumber(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Width</label>
							<input
								type="number"
								:value="props.selected.width"
								class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@input="emitUpdate(
									'width',
									asNumber(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Height</label>
							<input
								type="number"
								:value="props.selected.height"
								class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@input="emitUpdate(
									'height',
									asNumber(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<!-- Feature 10: Rotation & Flip -->
					<RotationFlipPanel
						:angle="rotationModel.angle"
						@rotate="handleRotate"
						@flip="handleFlip"
					/>

					<!-- Feature 11: Distribute Objects -->
					<DistributePanel @distribute="handleDistribute" />

					<!-- Feature 12: Smart Guides -->
					<SmartGuidesPanel
						v-model:enabled="smartGuidesModel.enabled"
						v-model:snap-to-objects="smartGuidesModel.snapToObjects"
						v-model:snap-to-guides="smartGuidesModel.snapToGuides"
						v-model:snap-to-grid="smartGuidesModel.snapToGrid"
						v-model:show-distances="smartGuidesModel.showDistances"
						:guides="[]"
					/>

					<!-- Feature 20: Spacing Display -->
					<SpacingDisplay
						:measurements="spacingModel"
						v-model:enabled="smartGuidesModel.showDistances"
						v-model:show-dimensions="smartGuidesModel.showDistances"
						@clear="spacingModel = []"
					/>
				</div>
			</div>

			<!-- STYLES TAB -->
			<div v-if="activeTab === 'styles'" class="p-4 space-y-4">
				<!-- Feature 1: Color Picker -->
				<ColorPicker
					v-model="colorModel"
					@update:model-value="emitUpdate('fill', $event)"
				/>

				<!-- Feature 2: Gradient Editor -->
				<GradientEditor
					:model-value="gradientModel"
					@update-model-value="gradientModel = $event"
				/>

				<!-- Feature 3: Shadow Editor -->
				<ShadowEditor
					:model-value="shadowModel"
					@update:model-value="shadowModel = $event"
				/>

				<!-- Feature 4: Stroke Styles -->
				<StrokeStyleEditor
					:stroke-dash-array="strokeModel.dashArray"
					:stroke-line-cap="strokeModel.lineCap"
					:rx="strokeModel.cornerRadius"
					:ry="strokeModel.cornerRadius"
					@update:stroke-dash-array="strokeModel.dashArray = $event"
					@update:stroke-line-cap="strokeModel.lineCap = $event as 'butt' | 'round' | 'square'"
					@update:rx="strokeModel.cornerRadius = $event"
					@update:ry="strokeModel.cornerRadius = $event"
				/>

				<!-- Feature 5: Blend Modes -->
				<BlendModeEditor
					v-model:opacity="blendModel.opacity"
					v-model:blend-mode="blendModel.blendMode"
				/>

				<!-- Feature 6: Text Styles (shown for text objects) -->
				<TextStylesPanel v-if="isTextObject" @select="handleTextStyleSelect" />

				<!-- Feature 8: Image Filters (shown for images) -->
				<ImageFilters
					v-if="isImageObject"
					:model-value="imageFiltersModel"
					@update:model-value="imageFiltersModel = $event"
					@reset="imageFiltersModel = {
						blur: 0,
						brightness: 100,
						contrast: 100,
						saturation: 100,
						hueRotate: 0,
						sepia: 0,
						grayscale: 0,
						invert: 0,
					}"
				/>

				<!-- Feature 14: Background Patterns -->
				<PatternSelector
					:selected-pattern="patternModel.selectedPattern"
					:color="patternModel.color"
					:opacity="patternModel.opacity / 100"
					:size="patternModel.size"
					@update:selected-pattern="patternModel.selectedPattern = $event"
					@update:color="patternModel.color = $event"
					@update:opacity="patternModel.opacity = $event * 100"
					@update:size="patternModel.size = $event"
				/>

				<!-- Feature 25: Design Tokens -->
				<DesignTokensPanel
					:categories="tokenCategories"
					:selected-token-id="selectedTokenId ?? ''"
					@select="selectedTokenId = $event"
					@create="handleTokenCreate"
					@update="handleTokenUpdate"
					@delete="handleTokenDelete"
					@duplicate="handleTokenDuplicate"
					@import="handleTokenImport"
					@export="handleTokenExport"
				/>
			</div>

			<!-- TOOLS TAB -->
			<div v-if="activeTab === 'tools'" class="p-4 space-y-4">
				<!-- Feature 7: Shape Library -->
				<ShapeLibrary @select="handleShapeSelect" />

				<!-- Feature 9: Crop Tool -->
				<CropTool
					:model-value="cropModel"
					:image-width="selectedWidth"
					:image-height="selectedHeight"
					@update:model-value="cropModel = $event"
					@apply="handleCropApply"
				/>

				<!-- Feature 13: Artboard Presets -->
				<ArtboardPresets
					:categories="[
						{
							id: 'social',
							name: 'Social Media',
							presets: [
								{
									id: 'instagram-square',
									name: 'Instagram Post',
									width: 1080,
									height: 1080,
								},
								{
									id: 'instagram-story',
									name: 'Instagram Story',
									width: 1080,
									height: 1920,
								},
								{
									id: 'facebook-post',
									name: 'Facebook Post',
									width: 1200,
									height: 630,
								},
								{
									id: 'twitter-post',
									name: 'Twitter/X Post',
									width: 1200,
									height: 675,
								},
							],
						},
						{
							id: 'web',
							name: 'Web',
							presets: [
								{ id: 'desktop', name: 'Desktop', width: 1920, height: 1080 },
								{ id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
								{ id: 'mobile', name: 'Mobile', width: 375, height: 667 },
							],
						},
					]"
					:selected-category="artboardPresetsModel.selectedCategory"
					@select-category="artboardPresetsModel.selectedCategory = $event"
					@select-preset="handleArtboardPreset"
				/>

				<!-- Feature 19: Export Presets -->
				<ExportPresets
					:selected-preset-id="null"
					@select="handleExport"
					@custom="/* handle custom export */"
				/>

				<!-- Feature 22: QR Code Generator -->
				<QRCodeGenerator
					:config="qrCodeModel"
					@update:config="qrCodeModel = $event"
					@generate="/* handle QR generation */"
				/>

				<!-- Feature 23: Chart Generator -->
				<ChartGenerator
					:config="chartModel"
					@update:config="chartModel = $event"
					@generate="/* handle chart generation */"
				/>
			</div>

			<!-- ADVANCED TAB -->
			<div v-if="activeTab === 'advanced'" class="p-4 space-y-4">
				<!-- Feature 15: Component System -->
				<ComponentPanel
					:masters="[]"
					:instances="[]"
					:selected-master-id="null"
					@select-master="/* handle select master */"
					@create-master="/* handle create master */"
					@create-instance="/* handle create instance */"
					@detach-instance="/* handle detach */"
					@update-instance="/* handle update instance */"
					@delete-master="/* handle delete master */"
				/>

				<!-- Feature 16: Version History -->
				<VersionHistory
					:versions="[]"
					:current-version-id="null"
					@select="/* handle version select */"
					@restore="/* handle restore */"
					@rename="/* handle rename */"
					@delete="/* handle delete */"
					@create="/* handle create version */"
				/>

				<!-- Feature 17: Comments -->
				<CommentsPanel
					:comments="[]"
					:current-user="'user-1'"
					:is-adding-comment="false"
					@add="handleAddComment"
					@reply="/* handle reply */"
					@resolve="handleResolveComment"
					@delete="handleDeleteComment"
					@select="/* handle select */"
					@toggle-adding-mode="/* handle toggle */"
				/>

				<!-- Feature 18: Multi Artboard -->
				<MultiArtboardPanel
					:artboards="[]"
					:active-artboard-id="null"
					@select="/* handle artboard select */"
					@add="/* handle add artboard */"
					@duplicate="/* handle duplicate */"
					@rename="/* handle rename */"
					@delete="/* handle delete */"
				/>

				<!-- Feature 21: Lottie Panel -->
				<LottiePanel
					:selected-animation="lottieModel"
					:available-animations="[]"
					@upload="/* handle lottie upload */"
					@select="lottieModel = $event"
				/>

				<!-- Feature 24: 3D Transform -->
				<Transform3DPanel
					:transform="transform3DModel"
					:preview-size="100"
					@update:transform="transform3DModel = $event"
					@reset="transform3DModel = {
						rotateX: 0,
						rotateY: 0,
						rotateZ: 0,
						translateX: 0,
						translateY: 0,
						translateZ: 0,
						scale: 1,
						perspective: 1000,
					}"
					@apply="/* handle 3D transform apply */"
				/>
			</div>
		</div>
	</div>
</template>
