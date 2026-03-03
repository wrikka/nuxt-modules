/**
 * The state of the context menu, containing its position and options.
 */
/**
 * Composable for managing the application's context menu.
 */
export const useContextMenu = () => {
	/**
	 * The state of the context menu, containing its position and options.
	 */
	const state = useState<ContextMenuOptions | null>("context-menu-state", () => null)
	/**
	 * The visibility state of the context menu.
	 */
	const isOpen = useState<boolean>("context-menu-isOpen", () => false)
	/**
	 * Opens the context menu with the given options.
	 * ~/param options - The position and items to display in the context menu.
	 */
	const open = (options: ContextMenuOptions) => {
		state.value = options
		isOpen.value = true
	}

	/**
	 * Closes the context menu.
	 */
	const close = () => {
		isOpen.value = false
	}

	return {
		close,
		open,
		state,
		isOpen,
	}
}
