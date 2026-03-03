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
	<aside class="hidden lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:dark:border-gray-800 lg:dark:bg-gray-900">
		<AuthDashboardSidebarHeader :user="user" />

		<nav class="flex-1 overflow-y-auto p-4">
			<ul class="space-y-1">
				<li v-for="item in navItems" :key="item.id">
					<NuxtLink
						:to="item.path"
						:class="[
							'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
							currentTab === item.id
								? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
								: 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
							item.disabled
							&& 'opacity-50 cursor-not-allowed pointer-events-none',
						]"
						@click="!item.disabled && emit('navigate', item)"
					>
						<Icon
							v-if="item.icon"
							:name="item.icon"
							class="h-5 w-5"
						/>
						<span>{{ item.label }}</span>
						<span
							v-if="item.badge"
							class="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white"
						>
							{{ item.badge }}
						</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>

		<AuthDashboardSidebarFooter />
	</aside>
</template>
