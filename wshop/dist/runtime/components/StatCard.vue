<script setup>
defineProps({
  stat: { type: null, required: true }
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition hover:shadow-md">
		<div class="flex justify-between items-start">
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
				{{ stat.name }}
			</p>
			<Icon
				:name="stat.icon"
				class="w-6 h-6 text-gray-400 dark:text-gray-500"
			/>
		</div>
		<div class="mt-2">
			<p class="text-3xl font-semibold">{{ stat.value }}</p>
			<p
				class="text-sm mt-1"
				:class="[stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600']"
			>
				{{ stat.change }}
			</p>
		</div>
	</div>
</template>
