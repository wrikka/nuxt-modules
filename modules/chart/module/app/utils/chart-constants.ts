// Chart constants and default configurations

export const DEFAULT_COLORS = [
	"#1f77b4",
	"#ff7f0e",
	"#2ca02c",
	"#d62728",
	"#9467bd",
	"#8c564b",
	"#e377c2",
	"#7f7f7f",
	"#bcbd22",
	"#17becf",
	"#aec7e8",
	"#ffbb78",
	"#98df8a",
	"#ff9896",
	"#c5b0d5",
];

export const DEFAULT_CHART_DIMENSIONS = {
	width: 800,
	height: 600,
	margin: {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20,
	},
};

export const DEFAULT_ANIMATION = {
	duration: 1000,
	easing: "ease-in-out",
	delay: 0,
};

export const DEFAULT_GRID = {
	show: true,
	color: "#e0e0e0",
	strokeWidth: 1,
	opacity: 0.5,
};

export const DEFAULT_LEGEND = {
	show: true,
	position: "top-right" as const,
	fontSize: 12,
	fontFamily: "Arial, sans-serif",
};

export const DEFAULT_AXIS = {
	show: true,
	color: "#333333",
	fontSize: 12,
	fontFamily: "Arial, sans-serif",
	tickSize: 5,
	tickPadding: 5,
};

export const DEFAULT_TOOLTIP = {
	show: true,
	backgroundColor: "rgba(255, 255, 255, 0.9)",
	borderColor: "#cccccc",
	borderWidth: 1,
	fontSize: 12,
	fontFamily: "Arial, sans-serif",
};

// Chart-specific defaults
export const BAR_CHART_DEFAULTS = {
	orientation: "vertical" as const,
	stacked: false,
	barWidth: 0.8,
	barGap: 0.1,
};

export const LINE_CHART_DEFAULTS = {
	smooth: false,
	area: false,
	strokeWidth: 2,
	dotSize: 4,
};

export const PIE_CHART_DEFAULTS = {
	innerRadius: 0,
	outerRadius: 100,
	padAngle: 0,
	cornerRadius: 0,
};

export const SCATTER_PLOT_DEFAULTS = {
	dotSize: 6,
	opacity: 0.8,
	trendLine: false,
};

export const HISTOGRAM_DEFAULTS = {
	bins: 10,
	normalized: false,
	cumulative: false,
};

export const RADAR_CHART_DEFAULTS = {
	levels: 5,
	maxValue: "auto" as const,
	labelFactor: 1.25,
	wrapWidth: 60,
};

// Color palettes for different themes
export const COLOR_PALETTES = {
	default: DEFAULT_COLORS,
	blues: [
		"#deebf7",
		"#c6dbef",
		"#9ecae1",
		"#6baed6",
		"#4292c6",
		"#2171b5",
		"#08519c",
		"#08306b",
	],
	greens: [
		"#e5f5e0",
		"#c7e9c0",
		"#a1d99b",
		"#74c476",
		"#41ab5d",
		"#238b45",
		"#006d2c",
		"#00441b",
	],
	reds: [
		"#fee0d2",
		"#fcbba1",
		"#fc9272",
		"#fb6a4a",
		"#ef3b2c",
		"#cb181d",
		"#a50f15",
		"#67000d",
	],
	purples: [
		"#f2f0f7",
		"#dadaeb",
		"#bcbddc",
		"#9e9ac8",
		"#807dba",
		"#6a51a3",
		"#54278f",
		"#3f007d",
	],
};

// Chart type mappings
export const CHART_TYPE_LABELS = {
	bar: "Bar Chart",
	line: "Line Chart",
	pie: "Pie Chart",
	area: "Area Chart",
	scatter: "Scatter Plot",
	histogram: "Histogram",
	radar: "Radar Chart",
	heatmap: "Heatmap",
	treemap: "Treemap",
	funnel: "Funnel Chart",
	gauge: "Gauge Chart",
	candlestick: "Candlestick Chart",
	boxplot: "Box Plot",
	waterfall: "Waterfall Chart",
	sunburst: "Sunburst Chart",
} as const;
