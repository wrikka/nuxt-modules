export default defineEventHandler(async (_event) => {
	const insights = [
		{
			id: "1",
			type: "tip",
			title: "Optimize Your Storage",
			description: "You're using 25% of your storage. Consider archiving old projects to free up space.",
			action: "View Archived Projects",
			priority: "medium",
			createdAt: new Date(),
		},
		{
			id: "2",
			type: "info",
			title: "New Features Available",
			description: "Check out the new AI-powered image enhancement features in the designer.",
			action: "Learn More",
			priority: "low",
			createdAt: new Date(),
		},
	];

	return {
		insights,
	};
});
