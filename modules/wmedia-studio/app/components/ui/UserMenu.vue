<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	currentUser: { name: string; email: string; avatar?: string; role: string };
}>();

const emit = defineEmits<{
	close: [];
	logout: [];
	navigate: [path: string];
}>();

const menuItems = [
	{ id: "profile", name: "Profile", icon: "mdi:account", path: "/profile" },
	{ id: "settings", name: "Settings", icon: "mdi:cog", path: "/settings" },
	{ id: "billing", name: "Billing", icon: "mdi:credit-card", path: "/billing" },
	{ id: "team", name: "Team", icon: "mdi:account-group", path: "/team" },
];

const isOpen = ref(false);
</script>

<template>
	<div class="relative">
		<button
			@click="isOpen = !isOpen"
			class="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
		>
			<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
				{{ currentUser.avatar || currentUser.name[0] }}
			</div>
			<span class="hidden md:block text-sm text-gray-700 dark:text-gray-300">{{
				currentUser.name
			}}</span>
			<Icon name="mdi:chevron-down" class="w-4 h-4 text-gray-400" />
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2"
		>
			<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
				<p class="font-medium text-gray-900 dark:text-white">
					{{ currentUser.name }}
				</p>
				<p class="text-sm text-gray-500">{{ currentUser.email }}</p>
				<span
					class="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
				>
					{{ currentUser.role }}
				</span>
			</div>

			<div class="py-1">
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click='emit("navigate", item.path);
					isOpen = false;'
					class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
				>
					<Icon :name="item.icon" class="w-4 h-4 text-gray-500" />
					{{ item.name }}
				</button>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
				<button
					@click='emit("logout");
					isOpen = false;'
					class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
				>
					<Icon name="mdi:logout" class="w-4 h-4" />
					Log out
				</button>
			</div>
		</div>
	</div>
</template>
