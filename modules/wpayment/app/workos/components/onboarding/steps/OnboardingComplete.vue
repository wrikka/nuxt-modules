<script setup lang="ts">
interface Props {
	profileName: string;
	mfaEnabled: boolean;
	notificationCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
	complete: [];
}>();
</script>

<template>
	<div class="step-complete text-center">
		<div class="text-6xl mb-4">🎉</div>
		<h2 class="text-2xl font-bold text-gray-800 mb-2">You're All Set!</h2>
		<p class="text-gray-600 mb-6">Your account is ready to use. Here's a quick summary:</p>

		<div class="bg-gray-50 rounded-lg p-6 max-w-sm mx-auto mb-6 text-left">
			<div class="flex items-center gap-3 py-2 border-b border-gray-200">
				<span class="text-xl">👤</span>
				<span class="text-gray-700">{{ profileName }}</span>
			</div>
			<div class="flex items-center gap-3 py-2 border-b border-gray-200">
				<span class="text-xl">🔐</span>
				<span class="text-gray-700">{{ mfaEnabled ? '2FA Enabled' : '2FA Disabled' }}</span>
			</div>
			<div class="flex items-center gap-3 py-2">
				<span class="text-xl">🔔</span>
				<span class="text-gray-700">{{ notificationCount }} notification types enabled</span>
			</div>
		</div>

		<WorkOSButton variant="primary" @click="emit('complete')">Go to Dashboard</WorkOSButton>
	</div>
</template>
