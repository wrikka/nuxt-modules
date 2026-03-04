<script setup lang="ts">
const currentMonth = ref(new Date());
const selectedDate = ref<Date | null>(null);
const recordings = ref([
	{
		id: 1,
		title: "Tutorial Recording",
		date: new Date(2025, 1, 5, 14, 0),
		duration: "15:32",
		type: "screen",
		color: "blue",
	},
	{
		id: 2,
		title: "Podcast Episode 12",
		date: new Date(2025, 1, 5, 10, 0),
		duration: "45:18",
		type: "camera",
		color: "purple",
	},
	{
		id: 3,
		title: "Client Interview",
		date: new Date(2025, 1, 8, 16, 30),
		duration: "32:45",
		type: "interview",
		color: "orange",
	},
	{
		id: 4,
		title: "Product Demo",
		date: new Date(2025, 1, 12, 9, 0),
		duration: "8:15",
		type: "screen",
		color: "blue",
	},
]);

const scheduledRecordings = ref([
	{
		id: 5,
		title: "Weekly Update",
		date: new Date(2025, 1, 15, 10, 0),
		type: "scheduled",
		color: "green",
		duration: null,
	},
	{
		id: 6,
		title: "Team Standup",
		date: new Date(2025, 1, 17, 14, 0),
		type: "scheduled",
		color: "green",
		duration: null,
	},
]);

const view = ref<"month" | "week" | "list">("month");

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const daysInMonth = computed(() => {
	const year = currentMonth.value.getFullYear();
	const month = currentMonth.value.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const days = new Date(year, month + 1, 0).getDate();
	return { firstDay, days };
});

const prevMonth = () => {
	currentMonth.value = new Date(
		currentMonth.value.getFullYear(),
		currentMonth.value.getMonth() - 1,
	);
};

const nextMonth = () => {
	currentMonth.value = new Date(
		currentMonth.value.getFullYear(),
		currentMonth.value.getMonth() + 1,
	);
};

const isToday = (day: number) => {
	const today = new Date();
	return today.getDate() === day
		&& today.getMonth() === currentMonth.value.getMonth()
		&& today.getFullYear() === currentMonth.value.getFullYear();
};

const getRecordingsForDay = (day: number) => {
	return recordings.value.filter(r =>
		r.date.getDate() === day
		&& r.date.getMonth() === currentMonth.value.getMonth()
	);
};

const getScheduledForDay = (day: number) => {
	return scheduledRecordings.value.filter(r =>
		r.date.getDate() === day
		&& r.date.getMonth() === currentMonth.value.getMonth()
	);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center">
					<Icon
						name="mdi:calendar"
						class="w-5 h-5 text-slate-600 dark:text-slate-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Recording Calendar
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Schedule and view recordings
					</p>
				</div>
			</div>
			<div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
				<button
					v-for='v in ["month", "week", "list"] as const'
					:key="v"
					:class="[
						'px-3 py-1 text-xs rounded-md transition-colors capitalize',
						view === v
							? 'bg-white dark:bg-gray-600 shadow-sm'
							: 'text-gray-500',
					]"
					@click="view = v"
				>
					{{ v }}
				</button>
			</div>
		</div>

		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<button
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
					@click="prevMonth"
				>
					<Icon name="mdi:chevron-left" class="w-5 h-5" />
				</button>
				<span class="font-medium">{{ monthNames[currentMonth.getMonth()] }} {{
						currentMonth.getFullYear()
					}}</span>
				<button
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
					@click="nextMonth"
				>
					<Icon name="mdi:chevron-right" class="w-5 h-5" />
				</button>
			</div>
			<button class="px-3 py-1.5 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1">
				<Icon name="mdi:plus" class="w-4 h-4" />
				Schedule
			</button>
		</div>

		<div class="grid grid-cols-7 gap-1 mb-2">
			<div
				v-for="day in weekDays"
				:key="day"
				class="text-center text-xs font-medium text-gray-500 py-1"
			>
				{{ day }}
			</div>
		</div>

		<div class="grid grid-cols-7 gap-1">
			<div
				v-for="i in daysInMonth.firstDay"
				:key="`empty-${i}`"
				class="aspect-square"
			/>
			<button
				v-for="day in daysInMonth.days"
				:key="day"
				:class="[
					'aspect-square rounded-lg border text-sm relative transition-all',
					isToday(day)
						? 'border-slate-500 bg-slate-50 dark:bg-slate-900/30 font-semibold'
						: 'border-gray-200 dark:border-gray-700 hover:border-slate-300',
					selectedDate?.getDate() === day ? 'ring-2 ring-slate-500' : '',
				]"
				@click="selectedDate = new Date(
					currentMonth.getFullYear(),
					currentMonth.getMonth(),
					day,
				)"
			>
				<span
					:class="isToday(day)
					? 'text-slate-700 dark:text-slate-300'
					: 'text-gray-700 dark:text-gray-300'"
				>{{ day }}</span>
				<div
					v-if="getRecordingsForDay(day).length"
					class="absolute bottom-1 left-1 right-1 flex gap-0.5"
				>
					<div
						v-for="r in getRecordingsForDay(day).slice(0, 3)"
						:key="r.id"
						:class="`w-1.5 h-1.5 rounded-full bg-${r.color}-500`"
					/>
				</div>
				<div
					v-if="getScheduledForDay(day).length"
					class="absolute top-1 right-1"
				>
					<div class="w-1.5 h-1.5 rounded-full bg-green-500" />
				</div>
			</button>
		</div>

		<div v-if="selectedDate" class="mt-4 space-y-2">
			<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				{{
					selectedDate.toLocaleDateString("en-US", {
						weekday: "long",
						month: "long",
						day: "numeric",
					})
				}}
			</h4>
			<div
				v-for="recording in [
					...getRecordingsForDay(selectedDate.getDate()),
					...getScheduledForDay(selectedDate.getDate()),
				]"
				:key="recording.id"
				class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div :class="`w-8 h-8 rounded-lg bg-${recording.color}-100 dark:bg-${recording.color}-900/30 flex items-center justify-center`">
					<Icon
						:name="recording.type === 'scheduled' ? 'mdi:clock' : 'mdi:video'"
						:class="`w-4 h-4 text-${recording.color}-600`"
					/>
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
						{{ recording.title }}
					</div>
					<div class="text-xs text-gray-500">
						{{
							recording.date.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})
						}} {{ recording.duration ? `• ${recording.duration}` : "" }}
					</div>
				</div>
				<span
					v-if="recording.type === 'scheduled'"
					class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full"
				>Scheduled</span>
			</div>
			<div
				v-if="getRecordingsForDay(selectedDate.getDate()).length === 0
				&& getScheduledForDay(selectedDate.getDate()).length === 0"
				class="text-center py-4 text-sm text-gray-500"
			>
				No recordings scheduled
			</div>
		</div>
	</div>
</template>
