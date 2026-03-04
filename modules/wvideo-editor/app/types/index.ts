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

export interface RecordingExportOptions {
	format: "mp4" | "webm" | "mov" | "gif";
	quality: "low" | "medium" | "high" | "ultra";
	resolution: { width: number; height: number };
	fps: number;
}

export interface VideoExportPreset {
	name: string;
	format: RecordingExportOptions["format"];
	quality: RecordingExportOptions["quality"];
	resolution: { width: number; height: number };
	fps: number;
	description?: string;
}

export interface ExportProgress {
	stage: "preparing" | "encoding" | "processing" | "completed";
	percentage: number;
	eta?: number;
}
