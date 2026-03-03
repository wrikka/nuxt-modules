import { videoProjects } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const db = useDb();
	const now = new Date();

	const project = {
		id: body.id || `video-${Date.now()}`,
		name: body.name,
		description: body.description,
		width: body.width || 1920,
		height: body.height || 1080,
		fps: body.fps || 30,
		duration: 0,
		tracks: [],
		clips: [],
		mediaAssets: [],
		captions: [],
		settingsBackgroundColor: body.settings?.backgroundColor || "#000000",
		settingsAudioVolume: body.settings?.audioVolume ?? 100,
		createdAt: now,
		updatedAt: now,
	};

	await db.insert(videoProjects).values(project);

	return {
		data: {
			projectId: project.id,
		},
	};
});
