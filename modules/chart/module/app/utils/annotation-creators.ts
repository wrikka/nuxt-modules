import type {
	AnnotationPosition,
	TextAnnotation,
	ArrowAnnotation,
	LineAnnotation,
	ShapeAnnotation,
	CalloutAnnotation,
} from "../types/annotations";

/**
 * Create text annotation object
 */
export const createTextAnnotation = (
	position: AnnotationPosition,
	content: string,
	options: Partial<
		Omit<TextAnnotation, "id" | "type" | "position" | "content">
	> = {},
): Omit<TextAnnotation, "id"> => ({
	type: "text",
	position,
	content,
	visible: true,
	zIndex: 1,
	style: {},
	...options,
});

/**
 * Create arrow annotation object
 */
export const createArrowAnnotation = (
	startPosition: AnnotationPosition,
	endPosition: AnnotationPosition,
	options: Partial<
		Omit<
			ArrowAnnotation,
			"id" | "type" | "position" | "startPosition" | "endPosition"
		>
	> = {},
): Omit<ArrowAnnotation, "id"> => ({
	type: "arrow",
	position: startPosition, // Primary position for reference
	startPosition,
	endPosition,
	visible: true,
	zIndex: 1,
	style: {},
	...options,
});

/**
 * Create line annotation object
 */
export const createLineAnnotation = (
	startPosition: AnnotationPosition,
	endPosition: AnnotationPosition,
	options: Partial<
		Omit<
			LineAnnotation,
			"id" | "type" | "position" | "startPosition" | "endPosition"
		>
	> = {},
): Omit<LineAnnotation, "id"> => ({
	type: "line",
	position: startPosition,
	startPosition,
	endPosition,
	visible: true,
	zIndex: 1,
	style: {},
	...options,
});

/**
 * Create shape annotation object
 */
export const createShapeAnnotation = (
	type: "rectangle" | "circle",
	position: AnnotationPosition,
	options: Partial<Omit<ShapeAnnotation, "id" | "type" | "position">> = {},
): Omit<ShapeAnnotation, "id"> => ({
	type,
	position,
	visible: true,
	zIndex: 1,
	style: {},
	...options,
});

/**
 * Create callout annotation object
 */
export const createCalloutAnnotation = (
	position: AnnotationPosition,
	content: string,
	options: Partial<
		Omit<CalloutAnnotation, "id" | "type" | "position" | "content">
	> = {},
): Omit<CalloutAnnotation, "id"> => ({
	type: "callout",
	position,
	content,
	visible: true,
	zIndex: 1,
	style: {},
	...options,
});
