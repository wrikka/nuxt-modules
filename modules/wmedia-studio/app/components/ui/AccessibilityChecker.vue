<script setup lang="ts">
const emit = defineEmits<{ close: []; check: [] }>();
const issues = ref([
	{ type: "warning", message: "Missing alt text on 3 images", autoFix: true },
	{ type: "error", message: "Color contrast ratio too low", autoFix: false },
	{ type: "info", message: "Keyboard navigation available", autoFix: false },
]);
const isChecking = ref(false);
const score = ref(85);

const check = () => {
	isChecking.value = true;
	setTimeout(() => {
		isChecking.value = false;
		score.value = 92;
	}, 1500);
};

const fixIssue = (index: number) => {
	issues.value.splice(index, 1);
	score.value = Math.min(100, score.value + 3);
};
</script>
<template>
	<div class="accessibility-checker bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:accessibility" class="w-5 h-5 text-blue-500" />
				Accessibility Checker
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
			<div
				class="text-4xl font-bold mb-1"
				:class="score >= 90
				? 'text-green-600 dark:text-green-400'
				: score >= 70
				? 'text-yellow-600 dark:text-yellow-400'
				: 'text-red-600 dark:text-red-400'"
			>
				{{ score }}
			</div>
			<div class="text-gray-500 dark:text-gray-400 text-sm">
				Accessibility Score
			</div>
		</div>
		<button
			class="w-full mb-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isChecking"
			@click="check"
		>
			<Icon
				v-if="isChecking"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>{{ isChecking ? "Checking..." : "Run Check" }}
		</button>
		<div class="space-y-2">
			<div
				v-for="(issue, i) in issues"
				:key="i"
				class="flex items-start gap-3 p-3 rounded-lg"
				:class="{
					'bg-red-50 dark:bg-red-900/20': issue.type === 'error',
					'bg-yellow-50 dark:bg-yellow-900/20': issue.type === 'warning',
					'bg-blue-50 dark:bg-blue-900/20': issue.type === 'info',
				}"
			>
				<Icon
					:name="issue.type === 'error'
					? 'mdi:close-circle'
					: issue.type === 'warning'
					? 'mdi:alert'
					: 'mdi:information'"
					:class="[
						issue.type === 'error'
							? 'text-red-500'
							: issue.type === 'warning'
							? 'text-yellow-500'
							: 'text-blue-500',
						'w-5 h-5 mt-0.5',
					]"
				/>
				<div class="flex-1">
					<div class="text-gray-900 dark:text-white text-sm">
						{{ issue.message }}
					</div>
					<div class="text-gray-500 dark:text-gray-500 text-xs capitalize">
						{{ issue.type }}
					</div>
				</div>
				<button
					v-if="issue.autoFix"
					class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-medium"
					@click="fixIssue(i)"
				>
					Fix
				</button>
			</div>
		</div>
	</div>
</template>
