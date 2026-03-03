import { ref, readonly, onMounted, onUnmounted } from "vue";

export function useChartResponsive() {
	const isMobile = ref(false);
	const isTablet = ref(false);
	const isDesktop = ref(true);

	// Update based on window size
	const updateBreakpoints = () => {
		const width = typeof window !== "undefined" ? window.innerWidth : 1024;
		isMobile.value = width < 768;
		isTablet.value = width >= 768 && width < 1024;
		isDesktop.value = width >= 1024;
	};

	onMounted(() => {
		updateBreakpoints();
		window.addEventListener("resize", updateBreakpoints);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", updateBreakpoints);
	});

	return {
		isMobile: readonly(isMobile),
		isTablet: readonly(isTablet),
		isDesktop: readonly(isDesktop),
		updateBreakpoints,
	};
}
