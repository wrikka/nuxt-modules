<script setup lang="ts">
const { initTheme } = useTheme()
const { fetchUserStats } = useGamification()

const activeTab = ref<"appearance" | "notifications" | "integrations">("appearance")

onMounted(() => {
	initTheme()
	fetchUserStats()
})
</script>

<template>
	<div class="p-6 max-w-4xl mx-auto">
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
			<p class="text-gray-500">Customize your workspace</p>
		</div>

		<div class="flex gap-6">
			<!-- Sidebar -->
			<div class="w-48 space-y-1">
				<button
					v-for="tab in ['appearance', 'notifications', 'integrations']"
					:key="tab"
					class="w-full px-3 py-2 text-sm font-medium text-left rounded-lg capitalize"
					:class="activeTab === tab
						? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
					@click="activeTab = tab as typeof activeTab"
				>
					<Icon :name="tab === 'appearance' ? 'mdi:palette' : tab === 'notifications' ? 'mdi:bell' : 'mdi:connection'" class="w-4 h-4 inline mr-2" />
					{{ tab }}
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1">
				<ThemeSettings v-if="activeTab === 'appearance'" />
			</div>
		</div>
	</div>
</template>
