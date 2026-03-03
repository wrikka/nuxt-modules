<script setup lang="ts">
interface ProjectStats {
	totalProjects: number;
	completedTasks: number;
	inProgress: number;
	teamMembers: number;
}

interface Activity {
	id: string;
	user: string;
	action: string;
	target: string;
	time: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	openProject: [id: string];
}>();

const stats = ref<ProjectStats>({
	totalProjects: 12,
	completedTasks: 48,
	inProgress: 5,
	teamMembers: 4,
});

const recentProjects = ref([
	{
		id: "p1",
		name: "E-commerce Redesign",
		updated: "2 hours ago",
		thumbnail: "",
		status: "active",
	},
	{
		id: "p2",
		name: "Mobile App UI",
		updated: "5 hours ago",
		thumbnail: "",
		status: "active",
	},
	{
		id: "p3",
		name: "Brand Guidelines",
		updated: "1 day ago",
		thumbnail: "",
		status: "completed",
	},
	{
		id: "p4",
		name: "Landing Page",
		updated: "2 days ago",
		thumbnail: "",
		status: "active",
	},
]);

const activities = ref<Activity[]>([
	{
		id: "1",
		user: "Jane",
		action: "updated",
		target: "E-commerce Redesign",
		time: "10 min ago",
	},
	{
		id: "2",
		user: "John",
		action: "commented on",
		target: "Mobile App UI",
		time: "25 min ago",
	},
	{
		id: "3",
		user: "Alice",
		action: "created",
		target: "New Project",
		time: "1 hour ago",
	},
	{
		id: "4",
		user: "Bob",
		action: "exported",
		target: "Brand Guidelines",
		time: "2 hours ago",
	},
]);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:view-dashboard" class="w-7 h-7 text-blue-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Project Dashboard
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<!-- Stats Cards -->
				<div class="grid grid-cols-4 gap-4">
					<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
						<p class="text-sm text-blue-600 dark:text-blue-400">
							Total Projects
						</p>
						<p class="text-2xl font-bold text-blue-700 dark:text-blue-300">
							{{ stats.totalProjects }}
						</p>
					</div>
					<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
						<p class="text-sm text-green-600 dark:text-green-400">Completed</p>
						<p class="text-2xl font-bold text-green-700 dark:text-green-300">
							{{ stats.completedTasks }}
						</p>
					</div>
					<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
						<p class="text-sm text-yellow-600 dark:text-yellow-400">
							In Progress
						</p>
						<p class="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
							{{ stats.inProgress }}
						</p>
					</div>
					<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
						<p class="text-sm text-purple-600 dark:text-purple-400">Team</p>
						<p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
							{{ stats.teamMembers }}
						</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-6">
					<!-- Recent Projects -->
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
							<Icon name="mdi:folder-open" class="w-5 h-5 text-gray-500" />
							Recent Projects
						</h3>
						<div class="space-y-3">
							<div
								v-for="project in recentProjects"
								:key="project.id"
								class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								@click="emit('openProject', project.id)"
							>
								<div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
									<Icon name="mdi:image" class="w-6 h-6 text-gray-400" />
								</div>
								<div class="flex-1">
									<p class="font-medium text-gray-900 dark:text-white text-sm">
										{{ project.name }}
									</p>
									<p class="text-xs text-gray-500">{{ project.updated }}</p>
								</div>
								<span
									:class="[
										'px-2 py-0.5 rounded-full text-xs',
										project.status === 'completed'
											? 'bg-green-100 text-green-600'
											: 'bg-blue-100 text-blue-600',
									]"
								>
									{{ project.status }}
								</span>
							</div>
						</div>
						<button class="w-full mt-3 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors">
							+ New Project
						</button>
					</div>

					<!-- Activity Feed -->
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
							<Icon name="mdi:pulse" class="w-5 h-5 text-gray-500" />
							Activity
						</h3>
						<div class="space-y-3">
							<div
								v-for="activity in activities"
								:key="activity.id"
								class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
							>
								<div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
									{{ activity.user[0] }}
								</div>
								<div class="flex-1">
									<p class="text-sm text-gray-700 dark:text-gray-300">
										<span class="font-medium text-gray-900 dark:text-white">{{
											activity.user
										}}</span>
										{{ activity.action }}
										<span class="font-medium text-gray-900 dark:text-white">{{
											activity.target
										}}</span>
									</p>
									<p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
