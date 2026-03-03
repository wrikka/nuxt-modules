<script setup lang="ts">
const { rules, fetchRules } = useWorkflowAutomation()

onMounted(() => {
	fetchRules()
})
</script>

<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Automation</h1>
				<p class="text-gray-500">Create rules to automate your workflow</p>
			</div>
		</div>

		<AutomationRules />
	</div>
</template>
