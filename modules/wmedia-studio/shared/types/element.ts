export type ElementType = "text" | "image" | "video" | "shape" | "icon" | "chart" | "qr" | "group" | "smart-component";

export interface BaseElement {
	id: string;
	type: ElementType;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
	locked: boolean;
	visible: boolean;
	zIndex: number;
	horizontalConstraint?: "start" | "center" | "end" | "stretch";
	verticalConstraint?: "start" | "center" | "end" | "stretch";
}

export interface TextElement extends BaseElement {
	type: "text";
	content: string;
	fontFamily: string;
	fontSize: number;
	fontWeight: number;
	fontStyle: "normal" | "italic";
	textAlign: "left" | "center" | "right";
	color: string;
	lineHeight: number;
	letterSpacing: number;
}

export interface ImageElement extends BaseElement {
	type: "image";
	src: string;
	alt?: string;
	filters: ImageFilters;
}

export interface VideoElement extends BaseElement {
	type: "video";
	src: string;
	duration: number;
	currentTime: number;
	autoplay: boolean;
	loop: boolean;
	muted: boolean;
}

export interface ShapeElement extends BaseElement {
	type: "shape";
	shape: "rectangle" | "circle" | "triangle" | "star" | "line";
	fill: string;
	stroke: string;
	strokeWidth: number;
	borderRadius?: number;
}

export interface IconElement extends BaseElement {
	type: "icon";
	icon: string;
	color: string;
	size: number;
}

export interface ChartElement extends BaseElement {
	type: "chart";
	chartType: "bar" | "line" | "pie" | "doughnut";
	data: ChartData;
	options: ChartOptions;
}

export interface QRElement extends BaseElement {
	type: "qr";
	data: string;
	size: number;
	color: string;
	backgroundColor: string;
}

export interface GroupElement extends BaseElement {
	type: "group";
	elements: string[];
	layoutMode?: "none" | "horizontal" | "vertical";
	padding?: number;
	gap?: number;
	primaryAlign?: "start" | "center" | "end" | "space-between";
	counterAlign?: "start" | "center" | "end";
}

export interface SmartComponentElement extends BaseElement {
	type: "smart-component";
	masterId: string;
	propertyValues: Record<string, unknown>;
}

export type Element =
	| TextElement
	| ImageElement
	| VideoElement
	| ShapeElement
	| IconElement
	| ChartElement
	| QRElement
	| GroupElement
	| SmartComponentElement;

export interface ImageFilters {
	brightness: number;
	contrast: number;
	saturation: number;
	blur: number;
	grayscale: boolean;
	sepia: boolean;
}

export interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor: string[];
		borderColor: string[];
	}[];
}

export interface ChartOptions {
	responsive: boolean;
	maintainAspectRatio: boolean;
	plugins: {
		legend: {
			display: boolean;
			position: "top" | "bottom" | "left" | "right";
		};
	};
}

// Designer-specific element type for properties panel
export interface DesignerSelectedObject {
	id: string;
	objectType: string;
	left: number;
	top: number;
	width: number;
	height: number;
	angle: number;
	opacity: number;
	hasFill: boolean;
	fill: string;
	fillType?: "solid" | "gradient";
	gradientType?: "linear" | "radial";
	gradientColors?: string[];
	hasStroke: boolean;
	text?: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: string;
	lineHeight?: number;
	letterSpacing?: number;
	stroke?: string;
	strokeWidth?: number;
	strokeDashArray?: number[];
	strokeLineCap?: "butt" | "round" | "square";
	rx?: number;
	ry?: number;
	shadow?: string;
	visible?: boolean;
	locked?: boolean;
	blendMode?: string;
	imageFilters?: {
		blur: number;
		brightness: number;
		contrast: number;
		saturation: number;
		hueRotate: number;
		sepia: number;
		grayscale: number;
		invert: number;
	};
}
