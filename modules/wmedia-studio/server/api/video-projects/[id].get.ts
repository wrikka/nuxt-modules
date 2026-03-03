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

	const db = useDb();
	const project = await db.query.videoProjects.findFirst({
		where: eq(videoProjects.id, id),
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Video project not found",
		});
	}

	return {
		data: {
			...project,
			tracks: project.tracks,
			clips: project.clips,
			mediaAssets: project.mediaAssets,
			captions: project.captions,
			settings: {
				backgroundColor: project.settingsBackgroundColor,
				audioVolume: project.settingsAudioVolume,
			},
		},
	};
});
