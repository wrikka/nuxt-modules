export default defineEventHandler(async (_event) => {
	const stats = [
		{
			id: "1",
			name: "Project A",
			type: "designer",
			views: 245,
			edits: 89,
			exports: 12,
			lastModified: new Date(),
		},
		{
			id: "2",
			name: "Audio Project",
			type: "audio-editor",
			views: 156,
			edits: 67,
			exports: 8,
			lastModified: new Date(),
		},
	];

	return {
		stats,
	};
});
