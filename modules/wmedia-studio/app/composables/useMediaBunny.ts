import {
	ALL_FORMATS,
	BufferTarget,
	Input,
	Mp3OutputFormat,
	Mp4OutputFormat,
	Output,
	QUALITY_HIGH,
	QUALITY_LOW,
	QUALITY_MEDIUM,
	UrlSource,
	WavOutputFormat,
	WebMOutputFormat,
} from "mediabunny";
import { ref } from "vue";

export interface MediaMetadata {
	duration: number;
	width?: number;
	height?: number;
	sampleRate?: number;
	numberOfChannels?: number;
	codec?: string;
	format?: string;
}

export interface AudioExportOptions {
	format: "wav" | "mp3";
	quality?: "low" | "medium" | "high";
	bitrate?: number;
}

export interface VideoExportOptions {
	format: "mp4" | "webm";
	quality?: "low" | "medium" | "high";
	bitrate?: number;
	fps?: number;
	resolution?: { width: number; height: number };
}

export const useMediaBunny = () => {
	const isProcessing = ref(false);
	const progress = ref(0);

	const getQuality = (quality?: "low" | "medium" | "high") => {
		switch (quality) {
			case "low":
				return QUALITY_LOW;
			case "medium":
				return QUALITY_MEDIUM;
			case "high":
			default:
				return QUALITY_HIGH;
		}
	};

	const readMediaMetadata = async (file: File): Promise<MediaMetadata> => {
		const url = URL.createObjectURL(file);
		const input = new Input({
			source: new UrlSource(url),
			formats: ALL_FORMATS,
		});

		const metadata: MediaMetadata = {
			duration: await input.computeDuration(),
		};

		const videoTrack = await input.getPrimaryVideoTrack();
		if (videoTrack) {
			metadata.width = videoTrack.displayWidth;
			metadata.height = videoTrack.displayHeight;
			metadata.codec = videoTrack.codec ?? undefined;
		}

		const audioTrack = await input.getPrimaryAudioTrack();
		if (audioTrack) {
			metadata.sampleRate = audioTrack.sampleRate;
			metadata.numberOfChannels = audioTrack.numberOfChannels;
			metadata.codec = audioTrack.codec ?? undefined;
		}

		URL.revokeObjectURL(url);
		return metadata;
	};

	const exportAudio = async (
		audioBuffer: AudioBuffer,
		options: AudioExportOptions = { format: "wav" },
	): Promise<Blob> => {
		isProcessing.value = true;
		progress.value = 0;

		try {
			const output = new Output({
				format: options.format === "wav" ? new WavOutputFormat() : new Mp3OutputFormat(),
				target: new BufferTarget(),
			});

			const numChannels = audioBuffer.numberOfChannels;
			const _sampleRate = audioBuffer.sampleRate;

			const channels: Float32Array[] = [];
			for (let i = 0; i < numChannels; i++) {
				channels.push(audioBuffer.getChannelData(i));
			}

			const audioSource = new (await import("mediabunny")).AudioBufferSource({
				codec: options.format === "wav" ? "pcm-s16" : "mp3",
				bitrate: options.bitrate || getQuality(options.quality),
			} as any);

			output.addAudioTrack(audioSource);
			await output.start();

			const blockSize = 1152;

			for (let i = 0; i < audioBuffer.length; i += blockSize) {
				const blockSamples: Float32Array[] = [];
				for (let ch = 0; ch < numChannels; ch++) {
					const channelData = channels[ch];
					if (!channelData) continue;
					const block = channelData.subarray(i, i + blockSize);
					blockSamples.push(block);
				}

				(audioSource as any).write(blockSamples);
				progress.value = Math.min(100, Math.floor((i / audioBuffer.length) * 100));
			}

			await output.finalize();
			const { buffer } = output.target;
			if (!buffer) throw new Error("No buffer generated");

			return new Blob([buffer], { type: options.format === "wav" ? "audio/wav" : "audio/mp3" });
		} finally {
			isProcessing.value = false;
			progress.value = 0;
		}
	};

	const exportVideo = async (
		canvas: HTMLCanvasElement,
		options: VideoExportOptions = { format: "mp4" },
	): Promise<Blob> => {
		isProcessing.value = true;
		progress.value = 0;

		try {
			const output = new Output({
				format: options.format === "mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
				target: new BufferTarget(),
			});

			const { CanvasSource } = await import("mediabunny");
			const videoSource = new CanvasSource(canvas, {
				codec: options.format === "mp4" ? "avc" : "vp9",
				bitrate: options.bitrate || getQuality(options.quality),
			});

			output.addVideoTrack(videoSource);
			await output.start();

			progress.value = 50;

			await output.finalize();
			const { buffer } = output.target;
			if (!buffer) throw new Error("No buffer generated");

			return new Blob([buffer], { type: options.format === "mp4" ? "video/mp4" : "video/webm" });
		} finally {
			isProcessing.value = false;
			progress.value = 0;
		}
	};

	const convertMedia = async (file: File, targetFormat: string): Promise<Blob> => {
		isProcessing.value = true;
		progress.value = 0;

		try {
			const url = URL.createObjectURL(file);
			const input = new Input({
				source: new UrlSource(url),
				formats: ALL_FORMATS,
			});

			const _duration = await input.computeDuration();
			progress.value = 20;

			const output = new Output({
				format: targetFormat === "mp4"
					? new Mp4OutputFormat()
					: targetFormat === "webm"
					? new WebMOutputFormat()
					: new WavOutputFormat(),
				target: new BufferTarget(),
			});

			const videoTrack = await input.getPrimaryVideoTrack();
			if (videoTrack) {
				const { VideoSampleSink } = await import("mediabunny");
				const sink = new VideoSampleSink(videoTrack);

				const videoSource = new (await import("mediabunny")).VideoSampleSource({
					codec: targetFormat === "mp4" ? "avc" : "vp9",
					bitrate: QUALITY_HIGH,
				} as any);

				output.addVideoTrack(videoSource);
				await output.start();

				let frameCount = 0;
				for await (const frame of sink.samples()) {
					(videoSource as any).write(frame);
					frameCount++;
					if (frameCount % 10 === 0) {
						progress.value = Math.min(90, 20 + Math.floor((frameCount / 100) * 70));
					}
				}
			}

			const audioTrack = await input.getPrimaryAudioTrack();
			if (audioTrack) {
				const { AudioSampleSink } = await import("mediabunny");
				const sink = new AudioSampleSink(audioTrack);

				const audioSource = new (await import("mediabunny")).AudioSampleSource({
					codec: targetFormat === "mp3" ? "mp3" : "aac",
					bitrate: QUALITY_HIGH,
				} as any);

				output.addAudioTrack(audioSource);
				await output.start();

				let sampleCount = 0;
				for await (const sample of sink.samples()) {
					(audioSource as any).write(sample);
					sampleCount++;
					if (sampleCount % 100 === 0) {
						progress.value = Math.min(90, 20 + Math.floor((sampleCount / 1000) * 70));
					}
				}
			}

			await output.finalize();
			const { buffer } = output.target;
			if (!buffer) throw new Error("No buffer generated");

			URL.revokeObjectURL(url);
			return new Blob([buffer], { type: `media/${targetFormat}` });
		} finally {
			isProcessing.value = false;
			progress.value = 0;
		}
	};

	return {
		isProcessing,
		progress,
		readMediaMetadata,
		exportAudio,
		exportVideo,
		convertMedia,
	};
};
