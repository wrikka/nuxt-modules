import { ref, computed, reactive, readonly } from "vue";
import type { DataPoint } from '@/module/app/types/chart-basic';
import type {
	AnnotationType,
	PositionType,
	AnnotationPosition,
	Annotation,
	TextAnnotation,
	ArrowAnnotation,
	LineAnnotation,
	ShapeAnnotation,
	CalloutAnnotation,
} from "../types/annotations";
import { getPixelPosition as getPixelPositionUtil } from "../utils/annotation-utils";
import {
	createTextAnnotation as createTextAnnotationUtil,
	createArrowAnnotation as createArrowAnnotationUtil,
	createLineAnnotation as createLineAnnotationUtil,
	createShapeAnnotation as createShapeAnnotationUtil,
	createCalloutAnnotation as createCalloutAnnotationUtil,
} from "../utils/annotation-creators";

/**
 * Annotation state
 */
interface AnnotationState {
	annotations: Annotation[];
	selectedAnnotation: string | null;
	isEditing: boolean;
}

/**
 * Composable for chart annotations
 */
export function useChartAnnotations(
	options: {
		enableDrag?: boolean;
		enableResize?: boolean;
		snapToGrid?: boolean;
		gridSize?: number;
	} = {},
) {
	const {
		enableDrag = true,
		enableResize = true,
		snapToGrid = false,
		gridSize = 10,
	} = options;

	const state = reactive<AnnotationState>({
		annotations: [],
		selectedAnnotation: null,
		isEditing: false,
	});

	/**
	 * Get all visible annotations sorted by z-index
	 */
	const visibleAnnotations = computed(() => {
		return state.annotations
			.filter((annotation) => annotation.visible)
			.sort((a, b) => a.zIndex - b.zIndex);
	});

	/**
	 * Get annotation by ID
	 */
	const getAnnotation = (id: string): Annotation | undefined => {
		return state.annotations.find((annotation) => annotation.id === id);
	};

	/**
	 * Add new annotation
	 */
	const addAnnotation = (annotation: Omit<Annotation, "id">): string => {
		const id = `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newAnnotation: Annotation = { ...annotation, id } as Annotation;
		state.annotations.push(newAnnotation);
		return id;
	};

	/**
	 * Update annotation
	 */
	const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
		const index = state.annotations.findIndex(
			(annotation) => annotation.id === id,
		);
		if (index !== -1) {
			state.annotations[index] = { ...state.annotations[index], ...updates } as Annotation;
		}
	};

	/**
	 * Remove annotation
	 */
	const removeAnnotation = (id: string) => {
		const index = state.annotations.findIndex(
			(annotation) => annotation.id === id,
		);
		if (index !== -1) {
			state.annotations.splice(index, 1);
			if (state.selectedAnnotation === id) {
				state.selectedAnnotation = null;
			}
		}
	};

	/**
	 * Clear all annotations
	 */
	const clearAnnotations = () => {
		state.annotations = [];
		state.selectedAnnotation = null;
	};

	/**
	 * Select annotation
	 */
	const selectAnnotation = (id: string | null) => {
		state.selectedAnnotation = id;
	};

	/**
	 * Toggle annotation visibility
	 */
	const toggleAnnotation = (id: string) => {
		const annotation = getAnnotation(id);
		if (annotation) {
			updateAnnotation(id, { visible: !annotation.visible });
		}
	};

	/**
	 * Move annotation to front
	 */
	const bringToFront = (id: string) => {
		const maxZIndex = Math.max(...state.annotations.map((a) => a.zIndex), 0);
		updateAnnotation(id, { zIndex: maxZIndex + 1 });
	};

	/**
	 * Move annotation to back
	 */
	const sendToBack = (id: string) => {
		const minZIndex = Math.min(...state.annotations.map((a) => a.zIndex), 0);
		updateAnnotation(id, { zIndex: minZIndex - 1 });
	};

	/**
	 * Convert annotation position to pixel coordinates
	 */
	const getPixelPosition = (
		position: AnnotationPosition,
		chartBounds: {
			width: number;
			height: number;
			xMin: number;
			xMax: number;
			yMin: number;
			yMax: number;
		},
		dataPoints?: DataPoint[],
	): { x: number; y: number } => {
		return getPixelPositionUtil(
			position,
			chartBounds,
			dataPoints,
			snapToGrid,
			gridSize,
		);
	};

	/**
	 * Create text annotation
	 */
	const createTextAnnotation = (
		position: AnnotationPosition,
		content: string,
		options: Partial<
			Omit<TextAnnotation, "id" | "type" | "position" | "content">
		> = {},
	): string => {
		const annotation = createTextAnnotationUtil(position, content, options);
		return addAnnotation(annotation);
	};

	/**
	 * Create arrow annotation
	 */
	const createArrowAnnotation = (
		startPosition: AnnotationPosition,
		endPosition: AnnotationPosition,
		options: Partial<
			Omit<
				ArrowAnnotation,
				"id" | "type" | "position" | "startPosition" | "endPosition"
			>
		> = {},
	): string => {
		const annotation = createArrowAnnotationUtil(
			startPosition,
			endPosition,
			options,
		);
		return addAnnotation(annotation);
	};

	/**
	 * Create line annotation
	 */
	const createLineAnnotation = (
		startPosition: AnnotationPosition,
		endPosition: AnnotationPosition,
		options: Partial<
			Omit<
				LineAnnotation,
				"id" | "type" | "position" | "startPosition" | "endPosition"
			>
		> = {},
	): string => {
		const annotation = createLineAnnotationUtil(
			startPosition,
			endPosition,
			options,
		);
		return addAnnotation(annotation);
	};

	/**
	 * Create shape annotation
	 */
	const createShapeAnnotation = (
		type: "rectangle" | "circle",
		position: AnnotationPosition,
		options: Partial<Omit<ShapeAnnotation, "id" | "type" | "position">> = {},
	): string => {
		const annotation = createShapeAnnotationUtil(type, position, options);
		return addAnnotation(annotation);
	};

	/**
	 * Create callout annotation
	 */
	const createCalloutAnnotation = (
		position: AnnotationPosition,
		content: string,
		options: Partial<
			Omit<CalloutAnnotation, "id" | "type" | "position" | "content">
		> = {},
	): string => {
		const annotation = createCalloutAnnotationUtil(position, content, options);
		return addAnnotation(annotation);
	};

	/**
	 * Export annotations
	 */
	const exportAnnotations = (): Annotation[] => {
		return [...state.annotations];
	};

	const importAnnotations = (annotations: Annotation[]) => {
		state.annotations = annotations.map(
			(annotation) =>
				({
					...annotation,
					id:
						annotation.id ||
						`annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				}) as Annotation,
		);
	};

	/**
	 * Get annotation statistics
	 */
	const getAnnotationStats = () => {
		const typeCounts = state.annotations.reduce(
			(acc, annotation) => {
				acc[annotation.type] = (acc[annotation.type] || 0) + 1;
				return acc;
			},
			{} as Record<AnnotationType, number>,
		);

		return {
			total: state.annotations.length,
			visible: state.annotations.filter((a) => a.visible).length,
			byType: typeCounts,
		};
	};

	return {
		// State
		annotations: readonly(state.annotations as any),
		visibleAnnotations,
		selectedAnnotation: computed(() => state.selectedAnnotation),
		isEditing: computed(() => state.isEditing),

		// Basic methods
		addAnnotation,
		updateAnnotation,
		removeAnnotation,
		clearAnnotations,
		selectAnnotation,
		toggleAnnotation,
		bringToFront,
		sendToBack,

		// Position utilities
		getPixelPosition,

		// Creation helpers
		createTextAnnotation,
		createArrowAnnotation,
		createLineAnnotation,
		createShapeAnnotation,
		createCalloutAnnotation,

		// Import/export
		exportAnnotations,
		importAnnotations,

		// Statistics
		getAnnotationStats,
	};
}
