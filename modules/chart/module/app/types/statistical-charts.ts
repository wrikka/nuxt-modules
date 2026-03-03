export interface StemAndLeafData {
	title?: string;
	stems: Array<{
		stem: number;
		leaves: number[];
	}>;
}

export interface QQData {
	title?: string;
	observed: number[];
	expected: number[];
	distribution?: "normal" | "uniform" | "exponential";
}

export interface ScatterMatrixData {
	title?: string;
	variables: string[];
	data: Array<Record<string, number>>;
	correlations?: Array<Array<number>>;
}
