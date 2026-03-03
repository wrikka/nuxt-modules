import { mediaItems } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const query = getQuery(event);
		const type = query.type as string | undefined;
		const folderId = query.folderId as string | undefined;
		const search = query.search as string | undefined;

		let allMedia = await db.query.mediaItems.findMany({
			orderBy: (items, { desc }) => desc(items.createdAt),
		});

		if (type) {
			allMedia = allMedia.filter((m) => m.type === type);
		}

		if (folderId) {
			allMedia = allMedia.filter((m) => m.folderId === folderId);
		}

		if (search) {
			const searchLower = search.toLowerCase();
			allMedia = allMedia.filter((m) =>
				m.name.toLowerCase().includes(searchLower)
				|| m.tags?.some((t: string) => t.toLowerCase().includes(searchLower))
			);
		}

		return {
			success: true,
			data: allMedia,
		};
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();

		const item = {
			id: crypto.randomUUID(),
			name: body.name,
			type: body.type,
			url: body.url,
			thumbnail: body.thumbnail,
			size: body.size,
			mimeType: body.mimeType,
			width: body.width,
			height: body.height,
			duration: body.duration,
			tags: body.tags || [],
			folderId: body.folderId,
			uploadedBy: body.uploadedBy || "anonymous",
			metadata: body.metadata || null,
			createdAt: now,
			updatedAt: now,
		};

		await db.insert(mediaItems).values(item);

		return {
			success: true,
			data: {
				...item,
				tags: body.tags || [],
				metadata: body.metadata,
			},
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
