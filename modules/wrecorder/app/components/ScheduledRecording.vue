<script setup lang="ts">
const scheduledTime = defineModel<string>("scheduledTime", { default: "" });
const duration = defineModel<number>("duration", { default: 60 });
const recurrence = defineModel<"once" | "daily" | "weekly">("recurrence", {
	default: "once",
});
const isScheduled = defineModel<boolean>("isScheduled", { default: false });

const emit = defineEmits<{
	schedule: [];
	cancel: [];
}>();

const durationOptions = [
	{ value: 15, label: "15 min" },
	{ value: 30, label: "30 min" },
	{ value: 60, label: "1 hour" },
	{ value: 120, label: "2 hours" },
	{ value: 0, label: "Unlimited" },
];

const recurrenceOptions = [
	{ value: "once" as const, label: "One-time", icon: "mdi:calendar-once" },
	{ value: "daily" as const, label: "Daily", icon: "mdi:calendar-today" },
	{ value: "weekly" as const, label: "Weekly", icon: "mdi:calendar-week" },
];

const minDateTime = computed(() => {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now.toISOString().slice(0, 16);
});

const canSchedule = computed(() => {
	return scheduledTime.value && new Date(scheduledTime.value) > new Date();
});

const timeUntilRecording = computed(() => {
	if (!scheduledTime.value) return "";
	const diff = new Date(scheduledTime.value).getTime() - Date.now();
	if (diff <= 0) return "Starting now...";
	const hours = Math.floor(diff / 3600000);
	const minutes = Math.floor((diff % 3600000) / 60000);
	return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Scheduled Recording
			</h3>
			<div v-if="isScheduled" class="flex items-center gap-2">
				<span
					class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full"
				>
					{{ timeUntilRecording }}
				</span>
			</div>
		</div>

		<div v-if="!isScheduled" class="space-y-4">
			<!-- Date/Time -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
				>Start Time</label>
				<input
					v-model="scheduledTime"
					type="datetime-local"
					:min="minDateTime"
					class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
				/>
			</div>

			<!-- Duration -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
				>Max Duration</label>
				<div class="grid grid-cols-5 gap-2">
					<button
						v-for="opt in durationOptions"
						:key="opt.value"
						:class="[
							'px-2 py-1.5 text-xs rounded transition-all',
							duration === opt.value
								? 'bg-purple-600 text-white'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200',
						]"
						@click="duration = opt.value"
					>
						{{ opt.label }}
					</button>
				</div>
			</div>

			<!-- Recurrence -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
				>Recurrence</label>
				<div class="flex gap-2">
					<button
						v-for="rec in recurrenceOptions"
						:key="rec.value"
						:class="[
							'flex-1 py-2 px-3 rounded-lg border text-center transition-all',
							recurrence === rec.value
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
						]"
						@click="recurrence = rec.value"
					>
						<Icon
							:name="rec.icon"
							class="w-4 h-4 mx-auto mb-1"
							:class="recurrence === rec.value ? 'text-purple-500' : 'text-gray-400'"
						/>
						<p class="text-xs">{{ rec.label }}</p>
					</button>
				</div>
			</div>

			<!-- Schedule Button -->
			<button
				class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
				:disabled="!canSchedule"
				@click="emit('schedule')"
			>
				<Icon name="mdi:calendar-clock" class="w-5 h-5 inline mr-2" />
				Schedule Recording
			</button>
		</div>

		<!-- Scheduled State -->
		<div v-else class="space-y-4">
			<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
						<Icon
							name="mdi:alarm"
							class="w-6 h-6 text-purple-600 dark:text-purple-400"
						/>
					</div>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">
							Recording Scheduled
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{{ new Date(scheduledTime).toLocaleString() }}
						</p>
						<p
							v-if="recurrence !== 'once'"
							class="text-xs text-purple-600 dark:text-purple-400"
						>
							Repeats {{ recurrence }}
						</p>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					class="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 transition-colors"
					@click="emit('cancel')"
				>
					<Icon name="mdi:close" class="w-4 h-4 inline mr-1" />
					Cancel
				</button>
				<button
					class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-colors"
					@click="isScheduled = false"
				>
					<Icon name="mdi:pencil" class="w-4 h-4 inline mr-1" />
					Edit
				</button>
			</div>
		</div>
	</div>
</template>
