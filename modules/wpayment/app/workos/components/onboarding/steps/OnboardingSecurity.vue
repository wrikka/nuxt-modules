<script setup lang="ts">
interface SecurityData {
	mfaEnabled: boolean;
	recoveryEmail: boolean;
	recoveryEmailAddress: string;
}

const props = defineProps<{
	data: SecurityData;
}>();

const emit = defineEmits<{
	"update:data": [data: SecurityData];
}>();

const toggleMfa = () => {
	emit("update:data", { ...props.data, mfaEnabled: !props.data.mfaEnabled });
};

const toggleRecovery = () => {
	emit("update:data", { ...props.data, recoveryEmail: !props.data.recoveryEmail });
};

const updateRecoveryEmail = (value: string) => {
	emit("update:data", { ...props.data, recoveryEmailAddress: value });
};
</script>

<template>
	<div class="step-security">
		<h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Secure Your Account</h2>
		<p class="text-gray-600 text-center mb-6">Set up additional security measures</p>

		<div class="max-w-md mx-auto space-y-3">
			<div
				class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
				:class="data.mfaEnabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
				@click="toggleMfa"
			>
				<div class="text-2xl">📱</div>
				<div class="flex-1">
					<h4 class="font-medium text-gray-800">Two-Factor Authentication</h4>
					<p class="text-sm text-gray-600">Add an extra layer of security to your account</p>
				</div>
				<div
					class="w-10 h-6 rounded-full relative transition-colors"
					:class="data.mfaEnabled ? 'bg-blue-500' : 'bg-gray-300'"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="data.mfaEnabled ? 'left-5' : 'left-1'"
					/>
				</div>
			</div>

			<div
				class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
				:class="data.recoveryEmail ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
				@click="toggleRecovery"
			>
				<div class="text-2xl">📧</div>
				<div class="flex-1">
					<h4 class="font-medium text-gray-800">Recovery Email</h4>
					<p class="text-sm text-gray-600">Add a backup email for account recovery</p>
				</div>
				<div
					class="w-10 h-6 rounded-full relative transition-colors"
					:class="data.recoveryEmail ? 'bg-blue-500' : 'bg-gray-300'"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="data.recoveryEmail ? 'left-5' : 'left-1'"
					/>
				</div>
			</div>

			<div v-if="data.recoveryEmail" class="mt-3">
				<input
					:value="data.recoveryEmailAddress"
					type="email"
					placeholder="recovery@email.com"
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
					@input="updateRecoveryEmail(($event.target as HTMLInputElement).value)"
				/>
			</div>
		</div>
	</div>
</template>
