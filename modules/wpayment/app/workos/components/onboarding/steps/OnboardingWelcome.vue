<script setup lang="ts">
interface Props {
	organizationName: string;
	stepsCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
	start: [];
}>();
</script>

<template>
	<div class="step-welcome text-center">
		<div class="text-6xl mb-4">👋</div>
		<h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome to {{ organizationName }}!</h2>
		<p class="text-gray-600 mb-6">Let's get you set up. This will only take a few minutes.</p>
		<div class="flex justify-center gap-8 mb-8">
			<div class="flex items-center gap-2">
				<span class="text-2xl">⏱️</span>
				<span class="text-gray-700">~3 minutes</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-2xl">📋</span>
				<span class="text-gray-700">{{ stepsCount }} steps</span>
			</div>
		</div>
		<WorkOSButton variant="primary" @click="emit('start')">Let's Get Started</WorkOSButton>
	</div>
</template>
