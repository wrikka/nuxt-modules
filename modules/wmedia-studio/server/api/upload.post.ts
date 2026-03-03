import type { UploadResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const method = event.method;

	if (method !== "POST") {
		throw createError({
			statusCode: 405,
			statusMessage: "Method Not Allowed",
		});
	}

	const formData = await readFormData(event);
	const file = formData.get("file") as File;

	if (!file) {
		throw createError({
			statusCode: 400,
			statusMessage: "File is required",
		});
	}

	const response: UploadResponse = {
		id: crypto.randomUUID(),
		url: URL.createObjectURL(file),
		filename: file.name,
		size: file.size,
		mimeType: file.type,
	};

	return { success: true, data: response };
});
