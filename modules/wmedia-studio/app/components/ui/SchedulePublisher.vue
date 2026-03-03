<script setup lang="ts">
const emit = defineEmits<
	{ close: []; schedule: [date: string, platforms: string[]] }
>();
const publishDate = ref("");
const publishTime = ref("");
const platforms = ref([{ id: "youtube", name: "YouTube", selected: true }, {
	id: "tiktok",
	name: "TikTok",
	selected: false,
}, { id: "instagram", name: "Instagram", selected: false }]);
const visibility = ref("public");
const isScheduled = ref(false);

const schedule = () => {
	isScheduled.value = true;
	const selected = platforms.value.filter(p => p.selected).map(p => p.id);
	emit("schedule", `${publishDate.value} ${publishTime.value}`, selected);
};

const selectedCount = computed(() =>
	platforms.value.filter(p => p.selected).length
);
</script>
<template>
	<div class="schedule-publisher bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:calendar-check" class="w-5 h-5 text-blue-500" />
				Schedule Publisher
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div
			v-if="isScheduled"
			class="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4"
		>
			<div class="flex items-center gap-2 text-green-600 dark:text-green-400">
				<Icon name="mdi:check-circle" class="w-5 h-5" />
				<span class="text-sm font-medium">Scheduled successfully!</span>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Date</label>
				<input
					v-model="publishDate"
					type="date"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Time</label>
				<input
					v-model="publishTime"
					type="time"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Platforms ({{ selectedCount }} selected)</label>
			<div class="space-y-2">
				<label
					v-for="p in platforms"
					:key="p.id"
					class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
				>
					<span class="text-gray-900 dark:text-white text-sm">{{
						p.name
					}}</span>
					<input
						v-model="p.selected"
						type="checkbox"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
					>
				</label>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Visibility</label>
			<div class="flex gap-2">
				<button
					v-for='v in ["public", "unlisted", "private"]'
					:key="v"
					class="flex-1 p-2 rounded-lg text-sm capitalize transition-all"
					:class="visibility === v
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="visibility = v"
				>
					{{ v }}
				</button>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="!publishDate || !publishTime || selectedCount === 0"
			@click="schedule"
		>
			Schedule Publication
		</button>
	</div>
</template>
