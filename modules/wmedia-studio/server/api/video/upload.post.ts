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
	const outputPath = join(tempDir, `output-${Date.now()}.mp4`);
	const thumbnailPath = join(tempDir, `thumbnail-${Date.now()}.jpg`);

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
			"-ss",
			"00:00:01",
			"-vframes",
			"1",
			"-vf",
			"scale=320:-1",
			"thumbnail.jpg",
		]);

		const thumbnailData = await ffmpeg.readFile("thumbnail.jpg");
		await writeFile(thumbnailPath, thumbnailData);

		await ffmpeg.exec([
			"-i",
			"input",
			"-f",
			"null",
			"-",
		]);

		const duration = 0;

		const videoUrl = `/uploads/videos/${Date.now()}-${file.name}`;
		const thumbnailUrl = `/uploads/thumbnails/${Date.now()}-thumbnail.jpg`;

		const uploadDir = join(process.cwd(), "public", "uploads", "videos");
		const thumbnailDir = join(process.cwd(), "public", "uploads", "thumbnails");

		await mkdir(uploadDir, { recursive: true });
		await mkdir(thumbnailDir, { recursive: true });

		await copyFile(inputPath, join(uploadDir, `${Date.now()}-${file.name}`));
		await copyFile(thumbnailPath, join(thumbnailDir, `${Date.now()}-thumbnail.jpg`));

		await unlink(inputPath);
		await unlink(thumbnailPath);

		return {
			data: {
				url: videoUrl,
				thumbnailUrl,
				duration,
				name: file.name,
				size: file.size,
				type: file.type,
			},
		};
	} catch (error) {
		console.error("Video upload error:", error);

		try {
			await unlink(inputPath);
		} catch {}
		try {
			await unlink(outputPath);
		} catch {}
		try {
			await unlink(thumbnailPath);
		} catch {}

		throw createError({
			statusCode: 500,
			statusMessage: "Failed to process video",
		});
	}
});
