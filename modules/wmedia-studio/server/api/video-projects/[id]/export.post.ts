import type { VideoProject } from "#shared/types";
import { spawn } from "child_process";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");
	const body = await readBody(event);

	// TODO: Replace with actual project data fetching from a database
	const project: VideoProject = {
		id: projectId || "",
		name: "Untitled Video Project",
		description: "",
		width: 1920,
		height: 1080,
		fps: 30,
		duration: 10, // 10 seconds duration for testing
		tracks: [],
		clips: [],
		mediaAssets: [],
		captions: [],
		settings: {
			backgroundColor: "#000000",
			audioVolume: 100,
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const { resolution = "1080p", quality = "high", format = "mp4" } = body;

	const resolutions: Record<string, { width: number; height: number }> = {
		"4k": { width: 3840, height: 2160 },
		"1080p": { width: 1920, height: 1080 },
		"720p": { width: 1280, height: 720 },
		"480p": { width: 854, height: 480 },
	};

	const bitrates: Record<string, string> = {
		low: "1M",
		medium: "3M",
		high: "5M",
		ultra: "10M",
	};

	const selectedResolution = resolutions[resolution] ?? resolutions["1080p"]!;
	const selectedBitrate = bitrates[quality] ?? bitrates["high"]!;
	const outputFilename = `exports/${projectId}-${Date.now()}.${format}`;

	const ffmpegArgs = [
		"-f",
		"lavfi",
		"-i",
		`color=c=${project.settings.backgroundColor}:s=${selectedResolution.width}x${selectedResolution.height}:d=${project.duration}`,
		"-c:v",
		"libx264",
		"-tune",
		"stillimage",
		"-pix_fmt",
		"yuv420p",
		"-b:v",
		selectedBitrate,
		"-y", // Overwrite output file if it exists
		outputFilename,
	];

	try {
		await new Promise((resolve, reject) => {
			// Ensure FFmpeg is installed and accessible in the system's PATH
			const ffmpeg = spawn("ffmpeg", ffmpegArgs);

			ffmpeg.stdout.on("data", (data) => {
				console.log(`stdout: ${data}`);
			});

			ffmpeg.stderr.on("data", (data) => {
				console.error(`stderr: ${data}`);
			});

			ffmpeg.on("close", (code) => {
				if (code === 0) {
					console.log("FFmpeg process completed successfully.");
					resolve(true);
				} else {
					console.error(`FFmpeg process exited with code ${code}`);
					reject(new Error(`FFmpeg process exited with code ${code}`));
				}
			});

			ffmpeg.on("error", (err) => {
				console.error("Failed to start FFmpeg process.", err);
				reject(err);
			});
		});

		return {
			data: {
				url: `/${outputFilename}`,
				message: "Export started successfully.",
			},
		};
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "Video export failed.",
			message: error instanceof Error ? error.message : "An unknown error occurred",
		});
	}
});
