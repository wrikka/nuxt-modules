export interface HeatmapData {
	data: number[][];
	xLabels: string[];
	yLabels: string[];
	colors?: string[];
}

export interface CandlestickPoint {
	x: string | number | Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}

export interface CandlestickData {
	title?: string;
	data: CandlestickPoint[];
}
