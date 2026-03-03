<script setup lang="ts">
const route = useRoute();

const menuItems = [
	{ icon: "🏠", label: "Home", path: "/" },
	{ icon: "📁", label: "Projects", path: "/projects" },
	{ icon: "🎨", label: "Templates", path: "/templates" },
	{ icon: "🎥", label: "Video Recording", path: "/video-recording" },
];

const isActive = (path: string) => route.path === path;
</script>

<template>
	<aside class="fixed left-0 top-0 h-full w-16 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
		<!-- Logo -->
		<div class="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-200 dark:border-gray-700">
			<span
				class="text-xl font-bold text-indigo-600 dark:text-indigo-400 hidden md:block"
			>Media Studio</span>
			<span class="text-xl md:hidden">🎬</span>
		</div>

		<!-- Menu -->
		<nav class="flex-1 py-4">
			<ul class="space-y-1 px-2">
				<li v-for="item in menuItems" :key="item.path">
					<NuxtLink
						:to="item.path"
						class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors"
						:class="{
							'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400':
								isActive(item.path),
							'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700':
								!isActive(item.path),
						}"
					>
						<span class="text-xl">{{ item.icon }}</span>
						<span class="hidden md:block font-medium">{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>

		<!-- Bottom section -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400">
				<span class="text-xl">⚙️</span>
				<span class="hidden md:block font-medium">Settings</span>
			</div>
		</div>
	</aside>
</template>
