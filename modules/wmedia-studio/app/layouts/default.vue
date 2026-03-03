<script setup lang="ts">
import { useUiStore } from "~/stores/ui";

const uiStore = useUiStore();

const theme = computed(() => uiStore.theme);

onMounted(() => {
	uiStore.initTheme();
});

watch(theme, (newTheme) => {
	if (newTheme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
});
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<LayoutSidebar />
		<main class="ml-16 md:ml-64">
			<NuxtPage />
		</main>
	</div>
</template>
