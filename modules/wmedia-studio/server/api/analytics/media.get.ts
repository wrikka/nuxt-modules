export default defineEventHandler(async (_event) => {
	const stats = [
		{
			id: "1",
			name: "image1.png",
			type: "image",
			size: 1024 * 512,
			views: 89,
			downloads: 23,
			createdAt: new Date(),
		},
		{
			id: "2",
			name: "audio1.mp3",
			type: "audio",
			size: 1024 * 1024 * 5,
			views: 67,
			downloads: 15,
			createdAt: new Date(),
		},
	];

	return {
		stats,
	};
});
