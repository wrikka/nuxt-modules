import { FFmpeg } from "@ffmpeg/ffmpeg";
import { copyFile, mkdir, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export default defineEventHandler(async (event) => {
	const formData = await readFormData(event);
	const file = formData.get("file") as File;

	if (!file) {
		throw createError({
			statusCode: 400,
			statusMessage: "No file provided",
		});
	}

	const tempDir = tmpdir();
	const inputPath = join(tempDir, `input-${Date.now()}-${file.name}`);

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(inputPath, buffer);

		const ffmpeg = new FFmpeg();

		await ffmpeg.load({
			coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
		});

		await ffmpeg.writeFile("input", buffer);

		await ffmpeg.exec([
			"-i",
			"input",
			"-f",
			"null",
			"-",
		]);

		const duration = 0;

		const audioUrl = `/uploads/audio/${Date.now()}-${file.name}`;

		const uploadDir = join(process.cwd(), "public", "uploads", "audio");

		await mkdir(uploadDir, { recursive: true });

		await copyFile(inputPath, join(uploadDir, `${Date.now()}-${file.name}`));

		await unlink(inputPath);

		return {
			data: {
				url: audioUrl,
				duration,
				name: file.name,
				size: file.size,
				type: file.type,
			},
		};
	} catch (error) {
		console.error("Audio upload error:", error);

		try {
			await unlink(inputPath);
		} catch {}

		throw createError({
			statusCode: 500,
			statusMessage: "Failed to process audio",
		});
	}
});
