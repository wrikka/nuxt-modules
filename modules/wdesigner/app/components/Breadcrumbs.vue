<script setup lang="ts">
interface BreadcrumbItem {
	label: string;
	href?: string;
}

const props = defineProps<{
	items: BreadcrumbItem[];
}>();
</script>

<template>
	<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm">
		<template v-for="(item, idx) in items" :key="idx">
			<span v-if="idx > 0" class="text-gray-400">/</span>
			<NuxtLink
				v-if="item.href"
				:to="item.href"
				class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
			>
				{{ item.label }}
			</NuxtLink>
			<span
				v-else
				class="font-medium text-gray-900 dark:text-white"
				aria-current="page"
			>
				{{ item.label }}
			</span>
		</template>
	</nav>
</template>
