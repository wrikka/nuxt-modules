<script setup lang="ts">
interface GeoData {
	country: string;
	code: string;
	users: number;
	projects: number;
}

const props = defineProps<{
	data: GeoData[];
}>();

const sortedData = computed(() =>
	[...props.data].sort((a, b) => b.users - a.users).slice(0, 10)
);

const maxUsers = computed(() => Math.max(...props.data.map(d => d.users), 1));
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
			<i class="i-mdi-earth text-blue-500" />
			Geographic Usage
		</h3>

		<div class="space-y-3">
			<div
				v-for="country in sortedData"
				:key="country.code"
				class="flex items-center gap-3"
			>
				<span class="text-2xl" :title="country.country">{{
					country.code
				}}</span>
				<div class="flex-1">
					<div class="flex justify-between mb-1">
						<span class="font-medium text-gray-900 dark:text-white text-sm">{{
							country.country
						}}</span>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{
								country.users
							}} users</span>
					</div>
					<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-blue-500 rounded-full"
							:style="{ width: `${(country.users / maxUsers) * 100}%` }"
						/>
					</div>
				</div>
				<div class="text-right text-sm text-gray-500 dark:text-gray-400 w-16">
					{{ country.projects }} projects
				</div>
			</div>
		</div>

		<div
			v-if="data.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-map-marker-off text-3xl mb-2" />
			<p>No geographic data available</p>
		</div>
	</div>
</template>
