<script setup lang="ts">
import type { NavItem } from "../../../types";

interface Props {
	user: UserProfile | null;
	navItems: NavItem[];
	currentTab: string;
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "navigate", item: NavItem): void;
}>();
</script>

<template>
	<div class="flex h-16 items-center justify-between px-4 sm:px-6">
		<div class="flex items-center gap-4">
			<button
				class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
				@click="emit('toggle-mobile-menu')"
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
</template>
