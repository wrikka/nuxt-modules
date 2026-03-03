<script lang="ts" setup>
const menu = [
	{ name: "Dashboard", to: "/", icon: "mdi:view-dashboard-outline" },
	{ name: "Orders", to: "/orders", icon: "mdi:package-variant-closed" },
	{ name: "Products", to: "/products", icon: "mdi:store-outline" },
	{ name: "Customers", to: "/customers", icon: "mdi:account-group-outline" },
	{ name: "Analytics", to: "/analytics", icon: "mdi:chart-line" },
	{ name: "Settings", to: "/settings", icon: "mdi:cog-outline" },
];
</script>

<template>


	<aside
		class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
		aria-label="Sidenav"
	>
		<div class="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
			<ul class="space-y-2">
				<li v-for="item in menu" :key="item.name">
					<NuxtLink
						:to="item.to"
						class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
						active-class="bg-gray-100 dark:bg-gray-700"
					>
						<Icon :name="item.icon" class="w-6 h-6 text-gray-500" />
						<span class="ml-3">{{ item.name }}</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</aside>


</template>
