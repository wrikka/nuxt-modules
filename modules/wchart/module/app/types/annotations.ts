import type { DataPoint } from './chart';

/**
 * Annotation types
 */
export type AnnotationType =
	| "text"
	| "arrow"
	| "line"
	| "rectangle"
	| "circle"
	| "image"
	| "callout"
	| "badge";

/**
 * Position types
 */
export type PositionType =
	| "absolute" // Fixed coordinates
	| "relative" // Relative to data points
	| "percentage"; // Percentage of chart area

/**
 * Annotation position
 */
export interface AnnotationPosition {
	type: PositionType;
	x: number | string; // number for absolute/percentage, string for data value
	y: number | string;
	xOffset?: number;
	yOffset?: number;
}

/**
 * Base annotation interface
 */
export interface BaseAnnotation {
	id: string;
	type: AnnotationType;
	position: AnnotationPosition;
	visible: boolean;
	zIndex: number;
	style: Record<string, any>;
}

/**
 * Text annotation
 */
export interface TextAnnotation extends BaseAnnotation {
	type: "text";
	content: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: string;
	color?: string;
	backgroundColor?: string;
	borderRadius?: number;
	padding?: number;
}

/**
 * Arrow annotation
 */
export interface ArrowAnnotation extends BaseAnnotation {
	type: "arrow";
	startPosition: AnnotationPosition;
	endPosition: AnnotationPosition;
	color?: string;
	strokeWidth?: number;
	arrowHead?: boolean;
	arrowHeadSize?: number;
}

/**
 * Line annotation
 */
export interface LineAnnotation extends BaseAnnotation {
	type: "line";
	startPosition: AnnotationPosition;
	endPosition: AnnotationPosition;
	color?: string;
	strokeWidth?: number;
	dashArray?: string;
}

/**
 * Shape annotation
 */
export interface ShapeAnnotation extends BaseAnnotation {
	type: "rectangle" | "circle";
	width?: number;
	height?: number;
	radius?: number;
	fillColor?: string;
	strokeColor?: string;
	strokeWidth?: number;
}

/**
 * Image annotation
 */
export interface ImageAnnotation extends BaseAnnotation {
	type: "image";
	src: string;
	width?: number;
	height?: number;
	alt?: string;
}

/**
 * Callout annotation
 */
export interface CalloutAnnotation extends BaseAnnotation {
	type: "callout";
	content: string;
	pointerPosition?: "top" | "bottom" | "left" | "right";
	backgroundColor?: string;
	textColor?: string;
}

/**
 * Badge annotation
 */
export interface BadgeAnnotation extends BaseAnnotation {
	type: "badge";
	content: string;
	backgroundColor?: string;
	textColor?: string;
	borderRadius?: number;
}

/**
 * Union type for all annotations
 */
export type Annotation =
	| TextAnnotation
	| ArrowAnnotation
	| LineAnnotation
	| ShapeAnnotation
	| ImageAnnotation
	| CalloutAnnotation
	| BadgeAnnotation;
