import type { Priority, Task } from "../shared/types/task"

const priorities: Priority[] = ["Urgent", "High", "Medium", "Low", "None"]

const users = {
	"User 1": { name: "User 1", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
	"User 2": { name: "User 2", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
	"User 3": { name: "User 3", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026706d" },
	"User 4": { name: "User 4", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026707d" },
}

const createTasksForList = (listId: string, count: number): Task[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: `${listId}-${i + 1}`,
		title: `${listId} Task ${i + 1}`,
		description: `Description for ${listId} Task ${i + 1}`,
		status: ["In Review", "In Progress", "In Design"][i % 3] as Task["status"],
		priority: priorities[i % 5] as Priority,
		assignee: users[`User ${(i % 4) + 1}` as keyof typeof users],
		comments: [],
		subtasks: Array.from({ length: i % 4 }, (_, j) => ({
			id: `${listId}-${i + 1}-subtask-${j + 1}`,
			title: `Subtask ${j + 1} for task ${i + 1}`,
			completed: j % 2 === 0,
		})),
		tags: i % 2 === 0
			? [{ name: "UI", color: "#fb923c" }, { name: "Feature", color: "#818cf8" }]
			: [{ name: "Bug", color: "#f87171" }],
		date: `Oct ${10 + i}`,
		updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
	}))
}

const lists = [
	{ id: "tasks", icon: "mdi:format-list-checks", label: "Tasks" },
	{ id: "subscription", icon: "mdi:briefcase-outline", label: "Subscription" },
	{ id: "habbit", icon: "mdi:calendar-check", label: "Habbit" },
	{ id: "waiting", icon: "mdi:clock-outline", label: "Waiting" },
]

const allTasks: Task[] = lists.flatMap(list => createTasksForList(list.label, 8))

export const db = {
	tasks: allTasks,
	lists,
}
