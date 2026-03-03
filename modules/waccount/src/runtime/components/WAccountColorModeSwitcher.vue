<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
	<button
		class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
		@click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
	>
		<Icon
			:name="colorMode.value === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'"
			class="h-5 w-5"
		/>
	</button>
</template>
