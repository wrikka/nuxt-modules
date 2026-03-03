import { eq } from "drizzle-orm";
import { videoProjects } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required",
		});
	}

	const body = await readBody(event);
	const db = useDb();

	// Check if project exists
	const existing = await db.query.videoProjects.findFirst({
		where: eq(videoProjects.id, id),
	});

	if (!existing) {
		throw createError({
			statusCode: 404,
			statusMessage: "Video project not found",
		});
	}

	const now = new Date();

	// Build update object dynamically
	const updateData: Record<string, unknown> = {
		updatedAt: now,
	};

	if (body.name !== undefined) updateData.name = body.name;
	if (body.description !== undefined) updateData.description = body.description;
	if (body.width !== undefined) updateData.width = body.width;
	if (body.height !== undefined) updateData.height = body.height;
	if (body.fps !== undefined) updateData.fps = body.fps;
	if (body.duration !== undefined) updateData.duration = body.duration;
	if (body.tracks !== undefined) updateData.tracks = body.tracks;
	if (body.clips !== undefined) updateData.clips = body.clips;
	if (body.mediaAssets !== undefined) updateData.mediaAssets = body.mediaAssets;
	if (body.captions !== undefined) updateData.captions = body.captions;
	if (body.settings?.backgroundColor !== undefined) updateData.settingsBackgroundColor = body.settings.backgroundColor;
	if (body.settings?.audioVolume !== undefined) updateData.settingsAudioVolume = body.settings.audioVolume;

	await db.update(videoProjects).set(updateData).where(eq(videoProjects.id, id));

	// Fetch updated project
	const updated = await db.query.videoProjects.findFirst({
		where: eq(videoProjects.id, id),
	});

	return {
		data: updated
			? {
				...updated,
				tracks: updated.tracks,
				clips: updated.clips,
				mediaAssets: updated.mediaAssets,
				captions: updated.captions,
				settings: {
					backgroundColor: updated.settingsBackgroundColor,
					audioVolume: updated.settingsAudioVolume,
				},
			}
			: null,
	};
});
