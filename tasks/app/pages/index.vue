<script setup lang="ts">
const tasks = useState<Task[]>("tasks", () => [])
const { notifications, unreadCount } = useNotifications()
const { userStats } = useGamification()

const activeView = ref<"list" | "kanban" | "calendar" | "gantt">("kanban")
const showAIChat = ref(false)
const showPomodoro = ref(false)

// Load mock tasks
onMounted(async () => {
	const { data } = await useFetch<Task[]>('/api/tasks/search')
	if (data.value) tasks.value = data.value
})
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		<!-- Header -->
		<header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
			<div class="flex items-center justify-between px-4 py-3">
				<div class="flex items-center gap-4">
					<h1 class="text-xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
					
					<!-- View Switcher -->
					<div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
						<button
							v-for="view in ['list', 'kanban', 'calendar', 'gantt']"
							:key="view"
							class="px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors"
							:class="activeView === view
								? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-900'"
							@click="activeView = view as typeof activeView"
						>
							<Icon :name="`mdi:${view === 'list' ? 'format-list-bulleted' : view === 'kanban' ? 'view-column' : view === 'calendar' ? 'calendar' : 'chart-gantt'}`" class="w-4 h-4 inline mr-1" />
							{{ view }}
						</button>
					</div>
				</div>

				<!-- Right Actions -->
				<div class="flex items-center gap-3">
					<!-- Pomodoro Toggle -->
					<button
						class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
						:class="{ 'text-red-500': showPomodoro }"
						@click="showPomodoro = !showPomodoro"
					>
						<Icon name="mdi:timer-outline" class="w-5 h-5" />
					</button>

					<!-- AI Assistant Toggle -->
					<button
						class="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
						:class="{ 'bg-purple-50 dark:bg-purple-900/20': showAIChat }"
						@click="showAIChat = !showAIChat"
					>
						<Icon name="mdi:robot" class="w-5 h-5" />
					</button>

					<!-- Notifications -->
					<NotificationPanel />

					<!-- User Menu -->
					<div class="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
						<div v-if="userStats" class="flex items-center gap-2">
							<span class="text-sm font-medium text-purple-600">Lvl {{ userStats.level }}</span>
							<span class="text-sm text-gray-500">{{ userStats.points }} XP</span>
						</div>
						<button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
							<Icon name="mdi:cog" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<div class="flex">
			<!-- Sidebar -->
			<aside class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-64px)]">
				<nav class="p-4 space-y-1">
					<NuxtLink to="/" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg">
						<Icon name="mdi:view-dashboard" class="w-5 h-5" />
						Dashboard
					</NuxtLink>
					<NuxtLink to="/tasks" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:checkbox-marked" class="w-5 h-5" />
						My Tasks
					</NuxtLink>
					<NuxtLink to="/sprints" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:sprint" class="w-5 h-5" />
						Sprints
					</NuxtLink>
					<NuxtLink to="/portfolio" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:briefcase" class="w-5 h-5" />
						Portfolio
					</NuxtLink>
					<NuxtLink to="/automation" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:lightning-bolt" class="w-5 h-5" />
						Automation
					</NuxtLink>
					<NuxtLink to="/gamification" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:trophy" class="w-5 h-5" />
						Achievements
					</NuxtLink>
					<NuxtLink to="/settings" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
						<Icon name="mdi:cog" class="w-5 h-5" />
						Settings
					</NuxtLink>
				</nav>
			</aside>

			<!-- Main Area -->
			<main class="flex-1 p-6">
				<!-- Dashboard Widget Grid -->
				<DashboardWidgetGrid />

				<!-- Task Views -->
				<div class="mt-6">
					<!-- Kanban View -->
					<div v-if="activeView === 'kanban'" class="grid grid-cols-4 gap-4">
						<div v-for="status in ['Backlog', 'In Progress', 'In Review', 'Done']" :key="status" class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
							<h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
								{{ status }}
								<span class="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
									{{ tasks.filter(t => t.status === status).length }}
								</span>
							</h3>
							<div class="space-y-2">
								<div
									v-for="task in tasks.filter(t => t.status === status)"
									:key="task.id"
									class="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
								>
									<h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</h4>
									<div class="flex items-center justify-between mt-2">
										<span class="text-xs px-2 py-0.5 rounded-full" :class="{
											'bg-red-100 text-red-700': task.priority === 'Critical',
											'bg-orange-100 text-orange-700': task.priority === 'High',
											'bg-blue-100 text-blue-700': task.priority === 'Medium',
											'bg-gray-100 text-gray-700': task.priority === 'Low'
										}">{{ task.priority }}</span>
										<img v-if="task.assignee" :src="task.assignee.avatarUrl" :alt="task.assignee.name" class="w-6 h-6 rounded-full">
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Gantt View -->
					<GanttChart v-if="activeView === 'gantt'" :tasks="tasks" />
				</div>
			</main>

			<!-- Right Panel (AI Chat / Pomodoro) -->
			<aside v-if="showAIChat || showPomodoro" class="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
				<AIChatPanel v-if="showAIChat" class="h-full" />
				<PomodoroTimer v-if="showPomodoro" class="h-full p-4" />
			</aside>
		</div>
	</div>
</template>
