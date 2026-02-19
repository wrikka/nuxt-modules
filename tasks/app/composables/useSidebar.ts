/**
 * Composable for managing the state of the application's sidebar.
 */
export const useSidebar = () => {
	/** The reactive state of the sidebar (open or closed). */
	const isSidebarOpen = useState("isSidebarOpen", () => true)

	/** Toggles the sidebar's open/closed state. */
	const toggleSidebar = () => {
		isSidebarOpen.value = !isSidebarOpen.value
	}

	return {
		isSidebarOpen,
		toggleSidebar,
	}
}
