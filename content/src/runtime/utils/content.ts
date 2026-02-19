// Stub for Nuxt #content module
export function queryContent(_path?: string) {
	return {
		findOne: () => null,
		find: () => [],
		where: () => ({ find: () => [] }),
	};
}
