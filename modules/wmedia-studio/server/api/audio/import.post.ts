import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export default defineEventHandler(async (event) => {
	try {
		const formData = await readMultipartFormData(event);
		if (!formData || formData.length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "No file uploaded",
			});
		}

		const file = formData[0];
		if (!file || !file.data || !file.filename) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid file data",
			});
		}

		const tempDir = tmpdir();
		const fileName = `${Date.now()}-${file.filename}`;
		const tempPath = join(tempDir, fileName);

		writeFileSync(tempPath, file.data);

		const audioBuffer = readFileSync(tempPath);
		const base64 = audioBuffer.toString("base64");

		unlinkSync(tempPath);

		return {
			success: true,
			fileName: file.filename,
			data: `data:${file.type || "audio/mpeg"};base64,${base64}`,
		};
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: error instanceof Error ? error.message : "Failed to import audio",
		});
	}
});
