export interface SubtitleEntry {
	id: string;
	startTime: number;
	endTime: number;
	text: string;
	style?: SubtitleStyle;
}

export interface SubtitleStyle {
	fontFamily?: string;
	fontSize?: number;
	color?: string;
	backgroundColor?: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	alignment?: "left" | "center" | "right";
	position?: "top" | "bottom" | "middle";
}

export interface SubtitleState {
	entries: SubtitleEntry[];
	style: SubtitleStyle;
	isVisible: boolean;
	currentIndex: number;
}

export type SubtitleFormat = "srt" | "vtt" | "ass" | "json";

export const useSubtitleExport = () => {
	const defaultStyle: SubtitleStyle = {
		fontFamily: "Arial",
		fontSize: 24,
		color: "#ffffff",
		backgroundColor: "rgba(0,0,0,0.5)",
		bold: false,
		italic: false,
		underline: false,
		alignment: "center",
		position: "bottom",
	};

	const state = reactive<SubtitleState>({
		entries: [],
		style: { ...defaultStyle },
		isVisible: true,
		currentIndex: 0,
	});

	const formatTimeSRT = (ms: number): string => {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = Math.floor((ms % 1000) / 10);

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(2, "0")}`;
	};

	const formatTimeVTT = (ms: number): string => {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = Math.floor(ms % 1000);

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
	};

	const exportToSRT = (): string => {
		return state.entries
			.map((entry, index) => {
				const start = formatTimeSRT(entry.startTime);
				const end = formatTimeSRT(entry.endTime);
				return `${index + 1}\n${start} --> ${end}\n${entry.text}\n`;
			})
			.join("\n");
	};

	const exportToVTT = (): string => {
		const header = "WEBVTT\n\n";
		const body = state.entries
			.map(entry => {
				const start = formatTimeVTT(entry.startTime);
				const end = formatTimeVTT(entry.endTime);
				return `${start} --> ${end}\n${entry.text}\n`;
			})
			.join("\n");
		return header + body;
	};

	const exportToASS = (): string => {
		const header = `[Script Info]
Title: WRecorder Subtitles
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${state.style.fontFamily},${state.style.fontSize},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,${state.style.bold ? 1 : 0},${state.style.italic ? 1 : 0},${state.style.underline ? 1 : 0},0,100,100,0,0,1,2,0,${state.style.alignment === "left" ? 1 : state.style.alignment === "center" ? 2 : 3},10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

		const body = state.entries
			.map(entry => {
				const start = formatTimeASS(entry.startTime);
				const end = formatTimeASS(entry.endTime);
				return `Dialogue: 0,${start},${end},Default,,0,0,0,,${entry.text}`;
			})
			.join("\n");

		return header + body;
	};

	const formatTimeASS = (ms: number): string => {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const centiseconds = Math.floor((ms % 1000) / 10);

		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
	};

	const exportToJSON = (): string => {
		return JSON.stringify({
			entries: state.entries,
			style: state.style,
			exportedAt: new Date().toISOString(),
		}, null, 2);
	};

	const exportSubtitles = (format: SubtitleFormat): string => {
		switch (format) {
			case "srt":
				return exportToSRT();
			case "vtt":
				return exportToVTT();
			case "ass":
				return exportToASS();
			case "json":
				return exportToJSON();
			default:
				return exportToSRT();
		}
	};

	const downloadSubtitles = (format: SubtitleFormat, filename?: string) => {
		const content = exportSubtitles(format);
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement("a");
		a.href = url;
		a.download = filename || `subtitles.${format}`;
		a.click();
		
		URL.revokeObjectURL(url);
	};

	const addEntry = (startTime: number, endTime: number, text: string): string => {
		const id = `sub-${Date.now()}`;
		const entry: SubtitleEntry = {
			id,
			startTime,
			endTime,
			text,
			style: { ...state.style },
		};
		state.entries.push(entry);
		sortEntries();
		return id;
	};

	const updateEntry = (id: string, updates: Partial<SubtitleEntry>) => {
		const index = state.entries.findIndex(e => e.id === id);
		if (index !== -1) {
			state.entries[index] = { ...state.entries[index], ...updates };
			sortEntries();
		}
	};

	const deleteEntry = (id: string) => {
		state.entries = state.entries.filter(e => e.id !== id);
	};

	const sortEntries = () => {
		state.entries.sort((a, b) => a.startTime - b.startTime);
	};

	const clearAll = () => {
		state.entries = [];
		state.currentIndex = 0;
	};

	const getCurrentEntry = (currentTime: number): SubtitleEntry | undefined => {
		return state.entries.find(
			e => currentTime >= e.startTime && currentTime <= e.endTime
		);
	};

	const importFromSRT = (srtContent: string) => {
		const entries: SubtitleEntry[] = [];
		const blocks = srtContent.trim().split(/\n\s*\n/);

		for (const block of blocks) {
			const lines = block.trim().split("\n");
			if (lines.length < 3) continue;

			const timeLine = lines[1];
			const text = lines.slice(2).join("\n");

			const match = timeLine.match(
				/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
			);

			if (match) {
				const startTime =
					parseInt(match[1]) * 3600000 +
					parseInt(match[2]) * 60000 +
					parseInt(match[3]) * 1000 +
					parseInt(match[4]);
				const endTime =
					parseInt(match[5]) * 3600000 +
					parseInt(match[6]) * 60000 +
					parseInt(match[7]) * 1000 +
					parseInt(match[8]);

				entries.push({
					id: `sub-${Date.now()}-${entries.length}`,
					startTime,
					endTime,
					text,
				});
			}
		}

		state.entries = entries;
	};

	const setStyle = (style: Partial<SubtitleStyle>) => {
		Object.assign(state.style, style);
	};

	const resetStyle = () => {
		state.style = { ...defaultStyle };
	};

	const generateFromTranscription = (
		transcription: Array<{ start: number; end: number; text: string }>
	) => {
		state.entries = transcription.map((t, i) => ({
			id: `sub-${Date.now()}-${i}`,
			startTime: t.start,
			endTime: t.end,
			text: t.text,
			style: { ...state.style },
		}));
	};

	return {
		state: readonly(state),
		entries: computed(() => state.entries),
		currentStyle: computed(() => state.style),
		addEntry,
		updateEntry,
		deleteEntry,
		clearAll,
		getCurrentEntry,
		exportSubtitles,
		downloadSubtitles,
		importFromSRT,
		setStyle,
		resetStyle,
		generateFromTranscription,
	};
};
