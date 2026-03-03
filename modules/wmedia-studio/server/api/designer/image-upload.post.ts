import { readMultipartFormData } from "h3";

export default defineEventHandler(async (event) => {
	try {
		const formData = await readMultipartFormData(event);
		if (!formData) {
			throw createError({
				statusCode: 400,
				statusMessage: "No file uploaded",
			});
		}

		const file = formData.find((item) => item.name === "file");
		if (!file) {
			throw createError({
				statusCode: 400,
				statusMessage: "No file found",
			});
		}

		const filename = file.filename || `image-${Date.now()}`;
		const ext = filename.split(".").pop()?.toLowerCase();
		const allowedExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

		if (!ext || !allowedExts.includes(ext)) {
			throw createError({
				statusCode: 400,
				statusMessage: `Invalid file type. Allowed: ${allowedExts.join(", ")}`,
			});
		}

		const maxSize = 10 * 1024 * 1024;
		if (file.data.length > maxSize) {
			throw createError({
				statusCode: 400,
				statusMessage: "File too large. Maximum size: 10MB",
			});
		}

		const assetsDir = "public/assets/images";
		const fs = await import("fs/promises");
		const path = await import("path");

		try {
			await fs.mkdir(assetsDir, { recursive: true });
		} catch (err) {
			console.error("Failed to create assets directory:", err);
		}

		const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;
		const filepath = path.join(process.cwd(), assetsDir, uniqueFilename);

		await fs.writeFile(filepath, file.data);

		const url = `/assets/images/${uniqueFilename}`;

		return {
			success: true,
			url,
			filename: uniqueFilename,
			size: file.data.length,
			type: file.type,
		};
	} catch (error) {
		console.error("Image upload error:", error);
		throw createError({
			statusCode: 500,
			statusMessage: error instanceof Error ? error.message : "Failed to upload image",
		});
	}
});
