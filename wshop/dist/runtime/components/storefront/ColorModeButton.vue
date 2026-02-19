<script setup>
const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
	<button
		@click="toggleColorMode"
		class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
		:aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
	>
		<Icon 
			:name="colorMode.value === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-weather-night'"
			class="w-5 h-5"
		/>
	</button>
</template>
