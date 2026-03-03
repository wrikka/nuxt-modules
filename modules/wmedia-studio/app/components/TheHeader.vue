<script setup lang="ts">
const route = useRoute();
</script>

<template>
	<header class="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-3 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<NuxtLink
				to="/"
				class="text-sm text-gray-600 dark:text-gray-200 hover:underline"
			>Home</NuxtLink>
			<span class="text-gray-300 dark:text-gray-500">/</span>
			<h1 class="text-sm font-semibold text-gray-900 dark:text-white">
				Editor
			</h1>
			<span class="text-xs text-gray-500 dark:text-gray-300">{{
				route.params.id
			}}</span>
		</div>
	</header>
</template>
