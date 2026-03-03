export default {
	async setup() {
		// Auto-import queryContent function on server
		const queryContent = async (path: string) => {
			const { queryContent } = await import("../../composables/useContent");
			return queryContent(path);
		};

		return {
			provide: {
				queryContent,
			},
		};
	},
};
