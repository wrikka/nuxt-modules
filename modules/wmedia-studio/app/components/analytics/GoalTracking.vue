<script setup lang="ts">
interface Goal {
	id: string;
	name: string;
	target: number;
	current: number;
	unit: string;
	deadline: Date;
}

const props = defineProps<{
	goals: Goal[];
}>();

const emit = defineEmits<{
	add: [];
	edit: [id: string];
	delete: [id: string];
}>();

const sortedGoals = computed(() =>
	[...props.goals].sort((a, b) =>
		(a.current / a.target) - (b.current / b.target)
	)
);

function getProgress(goal: Goal): number {
	return Math.min((goal.current / goal.target) * 100, 100);
}

function getProgressColor(goal: Goal): string {
	const progress = getProgress(goal);
	if (progress >= 100) return "bg-green-500";
	if (progress >= 50) return "bg-blue-500";
	return "bg-yellow-500";
}

function daysLeft(deadline: Date): number {
	const diff = new Date(deadline).getTime() - Date.now();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-target text-red-500" />
				Goal Tracking
			</h3>
			<button
				class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
				@click="emit('add')"
			>
				<i class="i-mdi-plus" />
			</button>
		</div>

		<div class="space-y-4">
			<div
				v-for="goal in sortedGoals"
				:key="goal.id"
				class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center justify-between mb-2">
					<div class="flex items-center gap-2">
						<span class="font-medium text-gray-900 dark:text-white">{{
							goal.name
						}}</span>
						<span
							v-if="getProgress(goal) >= 100"
							class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
						>Completed!</span>
					</div>
					<div class="flex items-center gap-1">
						<button
							class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
							@click="emit('edit', goal.id)"
						>
							<i class="i-mdi-pencil text-sm" />
						</button>
						<button
							class="p-1 text-gray-400 hover:text-red-500 transition-colors"
							@click="emit('delete', goal.id)"
						>
							<i class="i-mdi-delete text-sm" />
						</button>
					</div>
				</div>

				<div class="flex items-center justify-between text-sm mb-2">
					<span class="text-gray-600 dark:text-gray-400">{{ goal.current }} / {{
							goal.target
						}} {{ goal.unit }}</span>
					<span
						class="font-medium"
						:class="daysLeft(goal.deadline) < 3
						? 'text-red-500'
						: 'text-gray-500 dark:text-gray-400'"
					>
						{{ daysLeft(goal.deadline) }} days left
					</span>
				</div>

				<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						class="h-full rounded-full transition-all"
						:class="getProgressColor(goal)"
						:style="{ width: `${getProgress(goal)}%` }"
					/>
				</div>
			</div>
		</div>

		<div
			v-if="goals.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-target text-3xl mb-2" />
			<p>No goals set yet</p>
			<button
				class="mt-2 text-blue-600 dark:text-blue-400 font-medium"
				@click="emit('add')"
			>
				Add your first goal
			</button>
		</div>
	</div>
</template>
