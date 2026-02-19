import type { List } from "~/shared/types/list"
import type { Task } from "~/shared/types/task"

export function useListApi() {
	const lists = useState<List[]>("lists", () => [])
	const tasks = useState<Task[]>("tasks", () => [])

	function addList(listData: Omit<List, "id">) {
		const newList: List = {
			id: listData.label.toLowerCase().replace(/\s+/g, "-"), // simple id generation
			...listData,
		}
		lists.value.push(newList)
	}

	function updateList(updatedList: List) {
		const index = lists.value.findIndex((list: List) => list.id === updatedList.id)
		if (index !== -1) {
			const oldList = lists.value[index]
			if (oldList) {
				const oldLabel = oldList.label
				lists.value[index] = updatedList
				// Also update tasks that might be associated with this list by title
				tasks.value.forEach((task: Task) => {
					if (task.title.startsWith(oldLabel)) {
						task.title = task.title.replace(oldLabel, updatedList.label)
					}
				})
				$toast.success("List updated successfully")
			}
		}
	}

	function deleteList(listId: string) {
		const index = lists.value.findIndex((list: List) => list.id === listId)
		if (index !== -1) {
			const listToDelete = lists.value[index]
			if (!listToDelete) {
				return
			}

			lists.value.splice(index, 1)
			// Also remove tasks associated with this list
			tasks.value = tasks.value.filter((task: Task) => !task.title.startsWith(listToDelete.label))
			$toast.success("List deleted successfully")
			navigateTo("/") // Navigate to a safe page after deletion
		}
	}

	return { addList, updateList, deleteList }
}
