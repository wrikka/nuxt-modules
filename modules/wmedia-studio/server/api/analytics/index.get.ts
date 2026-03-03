import { useDb } from "../../utils/db";

export default defineEventHandler(async (_event) => {
	const db = useDb();

	// Get counts
	const allProjects = await db.query.projects.findMany();
	const allMedia = await db.query.mediaItems.findMany();
	const allVideoProjects = await db.query.videoProjects.findMany();
	const allAudioProjects = await db.query.audioProjects.findMany();

	const totalProjects = allProjects.length + allVideoProjects.length + allAudioProjects.length;
	const totalMedia = allMedia.length;

	// Calculate total storage
	const totalStorage = allMedia.reduce((sum, item) => sum + item.size, 0);

	// Count by type
	const projectsByType: Record<string, number> = {
		designer: allProjects.filter((p) => p.type === "designer").length,
		"audio-editor": allAudioProjects.length,
		"video-editor": allVideoProjects.length,
		"video-recording": allProjects.filter((p) => p.type === "video-recording").length,
	};

	const mediaByType: Record<string, number> = {
		image: allMedia.filter((m) => m.type === "image").length,
		audio: allMedia.filter((m) => m.type === "audio").length,
		video: allMedia.filter((m) => m.type === "video").length,
		document: allMedia.filter((m) => m.type === "document").length,
	};

	const analytics = {
		totalProjects,
		totalMedia,
		totalStorage,
		activeUsers: 1, // Simplified for now
		projectsByType,
		mediaByType,
		storageUsage: [],
		userActivity: [],
	};

	return {
		analytics,
	};
});
