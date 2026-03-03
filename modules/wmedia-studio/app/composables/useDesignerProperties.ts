import type { DesignerSelectedObject } from "#shared/types/element";
import type { TokenCategory } from "../components/designer/DesignTokensPanel.vue";
import type { SpacingMeasurement } from "../components/designer/SpacingDisplay.vue";
import type { LottieAnimation } from "../components/designer/LottiePanel.vue";
import type { QRCodeConfig } from "../components/designer/QRCodeGenerator.vue";
import type { ChartConfig } from "../components/designer/ChartGenerator.vue";
import type { Transform3D } from "../components/designer/Transform3DPanel.vue";

export interface ShadowModel {
	enabled: boolean;
	color: string;
	blur: number;
	offsetX: number;
	offsetY: number;
}

export interface StrokeModel {
	dashArray: number[] | null;
	lineCap: "butt" | "round" | "square";
	cornerRadius: number;
}

export interface BlendModel {
	opacity: number;
	blendMode: string;
}

export interface CropModel {
	enabled: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	aspectRatio: number | null;
}

export interface SmartGuidesModel {
	enabled: boolean;
	snapToObjects: boolean;
	snapToGuides: boolean;
	snapToGrid: boolean;
	showDistances: boolean;
}

export interface PatternModel {
	selectedPattern: string | null;
	color: string;
	opacity: number;
	size: number;
}

export const useDesignerProperties = (selected: Ref<DesignerSelectedObject | null>) => {
	// Model States
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

	const strokeModel = ref<StrokeModel>({
		dashArray: null,
		lineCap: "butt",
		cornerRadius: 0,
	});

	const blendModel = ref<BlendModel>({
		opacity: 100,
		blendMode: "normal",
	});

	const DEFAULT_IMAGE_FILTERS: Required<DesignerSelectedObject>["imageFilters"] = {
		blur: 0,
		brightness: 100,
		contrast: 100,
		saturation: 100,
		hueRotate: 0,
		sepia: 0,
		grayscale: 0,
		invert: 0,
	};

	const imageFiltersModel = ref<Required<DesignerSelectedObject>["imageFilters"]>({ ...DEFAULT_IMAGE_FILTERS });

	const cropModel = ref<CropModel>({
		enabled: false,
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		aspectRatio: null,
	});

	const rotationModel = ref<{ angle: number }>({ angle: 0 });

	const smartGuidesModel = ref<SmartGuidesModel>({
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

	const patternModel = ref<PatternModel>({
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
				{ id: "primary", name: "Primary", type: "color", value: "#3B82F6", category: "colors" },
				{ id: "secondary", name: "Secondary", type: "color", value: "#8B5CF6", category: "colors" },
				{ id: "success", name: "Success", type: "color", value: "#10B981", category: "colors" },
				{ id: "danger", name: "Danger", type: "color", value: "#EF4444", category: "colors" },
			],
		},
		{
			id: "typography",
			name: "Typography",
			tokens: [
				{ id: "heading-1", name: "Heading 1", type: "typography", value: "2.25rem", category: "typography" },
				{ id: "heading-2", name: "Heading 2", type: "typography", value: "1.875rem", category: "typography" },
				{ id: "body", name: "Body", type: "typography", value: "1rem", category: "typography" },
			],
		},
		{
			id: "spacing",
			name: "Spacing",
			tokens: [
				{ id: "xs", name: "Extra Small", type: "spacing", value: 4, category: "spacing" },
				{ id: "sm", name: "Small", type: "spacing", value: 8, category: "spacing" },
				{ id: "md", name: "Medium", type: "spacing", value: 16, category: "spacing" },
				{ id: "lg", name: "Large", type: "spacing", value: 24, category: "spacing" },
			],
		},
	]);

	const selectedTokenId = ref<string | null>(null);

	// Sync watchers
	watch(() => selected.value?.shadow, (shadow) => {
		shadowModel.value.enabled = !!shadow;
	}, { immediate: true });

	watch(() => selected.value, (sel) => {
		if (sel) {
			strokeModel.value.dashArray = sel.strokeDashArray ?? null;
			strokeModel.value.lineCap = sel.strokeLineCap ?? "butt";
			strokeModel.value.cornerRadius = sel.rx ?? 0;
			blendModel.value.opacity = sel.opacity ?? 100;
			blendModel.value.blendMode = sel.blendMode || "normal";
		}
	}, { immediate: true, deep: true });

	watch(() => selected.value?.imageFilters, (filters) => {
		imageFiltersModel.value = filters ? { ...DEFAULT_IMAGE_FILTERS, ...filters } : { ...DEFAULT_IMAGE_FILTERS };
	}, { immediate: true, deep: true });

	watch(() => selected.value?.angle, (angle) => {
		rotationModel.value.angle = angle || 0;
	}, { immediate: true });

	return {
		colorModel,
		gradientModel,
		shadowModel,
		strokeModel,
		blendModel,
		imageFiltersModel,
		cropModel,
		rotationModel,
		smartGuidesModel,
		spacingModel,
		artboardPresetsModel,
		patternModel,
		lottieModel,
		qrCodeModel,
		chartModel,
		transform3DModel,
		tokenCategories,
		selectedTokenId,
		DEFAULT_IMAGE_FILTERS,
	};
};
