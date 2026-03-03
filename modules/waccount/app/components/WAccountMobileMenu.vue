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

const { closeMobileMenu } = useAuthDashboard();
</script>

<template>
	<div
		class="fixed inset-0 z-50 bg-black/50 lg:hidden"
		@click="closeMobileMenu"
	>
		<div
			class="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl"
			@click.stop
		>
			<div class="flex h-full flex-col">
				<AuthDashboardSidebarHeader :user="user" />

				<nav class="flex-1 overflow-y-auto p-4">
					<ul class="space-y-1">
						<li v-for="item in navItems" :key="item.id">
							<button
								:class="[
									'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
									currentTab === item.id
										? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
										: 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
									item.disabled && 'opacity-50 cursor-not-allowed',
								]"
								:disabled="item.disabled"
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
							</button>
						</li>
					</ul>
				</nav>

				<AuthDashboardSidebarFooter />
			</div>
		</div>
	</div>
</template>
