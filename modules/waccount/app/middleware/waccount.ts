/**
 * Authentication middleware for WAccount module
 */
export default defineNuxtRouteMiddleware((to) => {
	const config = useRuntimeConfig().public.waccount;

	// Skip if auth middleware is disabled
	if (!config.enableAuthMiddleware) {
		return;
	}

	// Check if current path is public
	const isPublicPage = config.publicPages.some((page) => to.path.startsWith(page));

	if (isPublicPage) {
		return;
	}

	// Check authentication status
	const { isAuthenticated } = useWAccount();

	if (!isAuthenticated.value) {
		const loginPath = config.loginPath;
		const redirect = encodeURIComponent(to.fullPath);
		return navigateTo(`${loginPath}?redirect=${redirect}`);
	}
});
