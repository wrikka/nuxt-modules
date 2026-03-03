<script setup lang="ts">
const emit = defineEmits<{ close: []; check: [strictness: number] }>();
const strictness = ref(70);
const checks = ref({
	copyright: true,
	violence: true,
	nudity: true,
	hate: true,
});
const violations = ref([{
	type: "warning",
	message: "Potential copyrighted music detected at 02:15",
	timestamp: "02:15",
}, { type: "info", message: "No inappropriate content detected" }]);
const isChecking = ref(false);

const check = () => {
	isChecking.value = true;
	setTimeout(() => {
		isChecking.value = false;
		emit("check", strictness.value);
	}, 2000);
};
</script>
<template>
	<div class="ai-content-moderator bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:shield-check" class="w-5 h-5 text-purple-500" />
				AI Content Moderator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Moderation Strictness</span>
				<span class="text-purple-500 font-medium">{{ strictness }}%</span>
			</div>
			<input
				v-model="strictness"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="space-y-2 mb-4">
			<div
				v-for="(check, key) in checks"
				:key="key"
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
			>
				<span class="text-gray-900 dark:text-white text-sm capitalize">{{
					key
				}}</span>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="check ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="checks[key] = !check"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="check ? 'left-7' : 'left-1'"
					/>
				</button>
			</div>
		</div>
		<button
			class="w-full mb-4 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isChecking"
			@click="check"
		>
			<Icon
				v-if="isChecking"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>Analyze Content
		</button>
		<div class="space-y-2">
			<div
				v-for="v in violations"
				:key="v.message"
				class="p-2 rounded-lg flex items-start gap-2"
				:class="v.type === 'warning'
				? 'bg-yellow-50 dark:bg-yellow-900/30'
				: 'bg-green-50 dark:bg-green-900/30'"
			>
				<Icon
					:name="v.type === 'warning' ? 'mdi:alert' : 'mdi:check-circle'"
					:class="[
						v.type === 'warning' ? 'text-yellow-500' : 'text-green-500',
						'w-4 h-4 mt-0.5',
					]"
				/>
				<div>
					<div class="text-gray-900 dark:text-white text-sm">
						{{ v.message }}
					</div>
					<div v-if="v.timestamp" class="text-gray-500 text-xs">
						{{ v.timestamp }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
