import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
	const theme = ref<"light" | "dark" | "auto">("auto");
	const sidebarOpen = ref(true);
	const propertiesPanelOpen = ref(true);
	const layersPanelOpen = ref(true);
	const toolbarVisible = ref(true);
	const gridVisible = ref(false);
	const rulersVisible = ref(false);
	const guidesVisible = ref(false);
	const zoom = ref(100);
	const showOnboarding = ref(false);
	const keyboardShortcutsModalOpen = ref(false);

	const initTheme = () => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "auto" | null;

		if (savedTheme) {
			theme.value = savedTheme;
		} else {
			theme.value = "auto";
		}

		applyTheme();
	};

	const applyTheme = () => {
		const isDark = theme.value === "dark"
			|| (theme.value === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const setTheme = (newTheme: "light" | "dark" | "auto") => {
		theme.value = newTheme;
		localStorage.setItem("theme", newTheme);
		applyTheme();
	};

	const toggleSidebar = () => {
		sidebarOpen.value = !sidebarOpen.value;
	};

	const togglePropertiesPanel = () => {
		propertiesPanelOpen.value = !propertiesPanelOpen.value;
	};

	const toggleLayersPanel = () => {
		layersPanelOpen.value = !layersPanelOpen.value;
	};

	const toggleToolbar = () => {
		toolbarVisible.value = !toolbarVisible.value;
	};

	const toggleGrid = () => {
		gridVisible.value = !gridVisible.value;
	};

	const toggleRulers = () => {
		rulersVisible.value = !rulersVisible.value;
	};

	const toggleGuides = () => {
		guidesVisible.value = !guidesVisible.value;
	};

	const setZoom = (newZoom: number) => {
		zoom.value = Math.max(10, Math.min(500, newZoom));
	};

	const zoomIn = () => {
		setZoom(zoom.value + 10);
	};

	const zoomOut = () => {
		setZoom(zoom.value - 10);
	};

	const resetZoom = () => {
		zoom.value = 100;
	};

	const fitToScreen = () => {
		zoom.value = 100;
	};

	const showKeyboardShortcuts = () => {
		keyboardShortcutsModalOpen.value = true;
	};

	const hideKeyboardShortcuts = () => {
		keyboardShortcutsModalOpen.value = false;
	};

	const dismissOnboarding = () => {
		showOnboarding.value = false;
		localStorage.setItem("onboarding-dismissed", "true");
	};

	const checkOnboarding = () => {
		const dismissed = localStorage.getItem("onboarding-dismissed");
		showOnboarding.value = !dismissed;
	};

	return {
		theme,
		sidebarOpen,
		propertiesPanelOpen,
		layersPanelOpen,
		toolbarVisible,
		gridVisible,
		rulersVisible,
		guidesVisible,
		zoom,
		showOnboarding,
		keyboardShortcutsModalOpen,
		initTheme,
		setTheme,
		toggleSidebar,
		togglePropertiesPanel,
		toggleLayersPanel,
		toggleToolbar,
		toggleGrid,
		toggleRulers,
		toggleGuides,
		setZoom,
		zoomIn,
		zoomOut,
		resetZoom,
		fitToScreen,
		showKeyboardShortcuts,
		hideKeyboardShortcuts,
		dismissOnboarding,
		checkOnboarding,
	};
});
