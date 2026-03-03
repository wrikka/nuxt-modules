<script setup lang="ts">
interface Props {
	currentTab: string;
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "toggle-mobile-menu"): void;
}>();

const { toggleMobileMenu } = useAuthDashboard();

const handleToggle = () => {
	toggleMobileMenu();
	emit("toggle-mobile-menu");
};
</script>

<template>
	<header class="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
		<div class="flex h-16 items-center justify-between px-4 sm:px-6">
			<div class="flex items-center gap-4">
				<button
					class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
					@click="handleToggle"
				>
					<Icon name="mdi:menu" class="h-6 w-6" />
				</button>

				<h1 class="text-lg font-semibold text-gray-900 dark:text-white">
					{{ currentTab.charAt(0).toUpperCase() + currentTab.slice(1) }}
				</h1>
			</div>

			<div class="flex items-center gap-2">
				<AuthDashboardColorModeSwitcher />
			</div>
		</div>
	</header>
</template>
