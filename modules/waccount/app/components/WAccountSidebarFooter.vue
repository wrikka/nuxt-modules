<script setup lang="ts">
const { signOut } = useAuthDashboard();
const { closeMobileMenu } = useAuthDashboard();
</script>

<template>
	<div class="border-t border-gray-200 p-4 dark:border-gray-800">
		<button
			class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
			@click="signOut();
			closeMobileMenu();"
		>
			<Icon name="mdi:logout" class="h-5 w-5" />
			<span>Sign out</span>
		</button>
	</div>
</template>
