// Base chart types

export type ChartType =
	| "bar"
	| "line"
	| "pie"
	| "area"
	| "scatter"
	| "histogram"
	| "radar"
	| "heatmap"
	| "treemap"
	| "funnel"
	| "gauge"
	| "candlestick"
	| "boxplot"
	| "waterfall"
	| "sunburst"
	| "polarArea"
	| "network"
	| "bubble"
	| "calendarHeatmap"
	| "sparkline"
	| "pyramid"
	| "lollipop"
	| "dumbbell"
	| "bullet"
	| "timeline"
	| "gantt"
	| "wordCloud"
	| "violin"
	| "density"
	| "contour"
	| "stream"
	| "bump"
	| "marimekko"
	| "nightingale"
	| "chord"
	| "sankey"
	| "pictogram"
	| "combo"
	| "pareto"
	| "step"
	| "range"
	| "errorBar"
	| "forest"
	| "dot"
	| "stemAndLeaf"
	| "qq"
	| "scatterMatrix"
	| "cluster"
	| "partition"
	| "parallelCoordinates"
	| "circlePacking"
	| "packedCircles"
	| "forceDirected"
	| "arcDiagram"
	| "alluvial"
	| "slope"
	| "connectedScatter"
	| "multiLevelPie"
	| "hexbin"
	| "voronoi"
	| "ternary"
	| "hive"
	| "matrix"
	| "adjacency"
	| "cluster"
	| "dendrogram"
	| "radialTree"
	| "icicle"
	| "flame"
	| "partition"
	| "zoomableSunburst"
	| "collapsibleTree"
	| "indentedTree"
	| "treeMapZoom"
	| "circlePackingZoom"
	| "network3d"
	| "graph3d"
	| "force3d"
	| "chord3d";

export interface DataPoint {
	x: string | number | Date;
	y: number | number[];
	label?: string;
	color?: string;
}

export interface ChartSeries {
	name: string;
	data: DataPoint[];
	type?: ChartType;
	color?: string;
	links?: any[];
	layout?: any;
}

export interface ChartData {
	title?: string;
	series: ChartSeries[];
	orientation?: "horizontal" | "vertical";
	stacked?: boolean;
}

export interface ChartConfig {
	width?: number;
	height?: number;
	responsive?: boolean;
	theme?: "light" | "dark";
	colors?: string[];
	legend?: boolean;
	tooltip?: boolean;
	animation?: boolean;
	type?: ChartType;
	showLegend?: boolean;
	showGrid?: boolean;
	animated?: boolean;
}
