import type { PublishRequest, PublishResponse, SocialMediaPlatform } from "#shared/types";

const platforms: SocialMediaPlatform[] = [
	{
		id: "facebook",
		name: "Facebook",
		icon: "📘",
		supportedFormats: ["png", "jpg", "mp4"],
		maxFileSize: 4 * 1024 * 1024,
		dimensions: { width: 1200, height: 630 },
	},
	{
		id: "instagram",
		name: "Instagram",
		icon: "📷",
		supportedFormats: ["png", "jpg", "mp4"],
		maxFileSize: 4 * 1024 * 1024,
		dimensions: { width: 1080, height: 1080 },
	},
	{
		id: "twitter",
		name: "Twitter",
		icon: "🐦",
		supportedFormats: ["png", "jpg", "mp4"],
		maxFileSize: 5 * 1024 * 1024,
		dimensions: { width: 1200, height: 675 },
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: "💼",
		supportedFormats: ["png", "jpg"],
		maxFileSize: 5 * 1024 * 1024,
		dimensions: { width: 1200, height: 627 },
	},
];

export default defineEventHandler(async (event) => {
	const method = event.method;

	if (method === "GET") {
		return { success: true, data: platforms };
	}

	if (method === "POST") {
		const body: PublishRequest = await readBody(event);

		const response: PublishResponse = {
			id: crypto.randomUUID(),
			platform: body.platform,
			status: "pending",
			publishedAt: body.scheduleAt || new Date(),
		};

		return { success: true, data: response };
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
