export default defineEventHandler(async (event) => {
	const period = getQuery(event).period || "weekly";
	const stats = [
		{
			projectId: "1",
			projectName: "Project A",
			storage: 1024 * 1024 * 100,
			bandwidth: 1024 * 1024 * 500,
			exports: 5,
			period,
		},
	];

	return {
		stats,
	};
});
