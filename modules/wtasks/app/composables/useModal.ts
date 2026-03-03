/**
 * The state of the currently open modal.
 */
import type { List } from "~/shared/types/list"
import type { Task } from "~/shared/types/task"

export interface ModalState {
	name: ModalName
	task?: Task
	list?: List
	onConfirm?: () => void
}

const modalState = ref<ModalState | null>(null)

/**
 * The name of the currently open modal.
 */
export type ModalName =
	| "createTask"
	| "editTask"
	| "deleteTask"
	| "listSettings"
	| "deleteList"
	| "addList"

/**
 * Composable for managing modals throughout the application.
 */
export const useModal = () => {
	/**
	 * Opens a modal with the given state.
	 * ~/param state - The state to pass to the modal, determining which modal to open and its content.
	 */
	const open = <T extends ModalState>(state: T) => {
		modalState.value = state
	}

	/**
	 * Closes the currently open modal.
	 */
	const close = () => {
		modalState.value = null
	}

	return {
		close,
		open,
		state: modalState,
	}
}
