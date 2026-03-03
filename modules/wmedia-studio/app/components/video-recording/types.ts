export type RecordingSource = "screen" | "camera" | "both";

export interface Recording {
	id: string;
	blob: Blob;
	url: string;
	duration: number;
	timestamp: number;
	name: string;
	source?: string;
}
