<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	title: string;
	currentStep: number;
	totalSteps: number;
	canGoBack?: boolean;
	canGoNext?: boolean;
	canFinish?: boolean;
}>();

const emit = defineEmits<{
	close: [];
	back: [];
	next: [];
	finish: [];
	goToStep: [step: number];
}>();
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					{{ title }}
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Step Indicator -->
			<div class="flex items-center justify-center gap-2 p-4">
				<button
					v-for="step in totalSteps"
					:key="step"
					@click="emit('goToStep', step)"
					:class="[
						'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
						step < currentStep
							? 'bg-green-500 text-white'
							: step === currentStep
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-500',
					]"
				>
					<Icon v-if="step < currentStep" name="mdi:check" class="w-4 h-4" />
					<span v-else>{{ step }}</span>
				</button>
			</div>

			<!-- Content Slot -->
			<div class="flex-1 overflow-y-auto p-4">
				<slot />
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
				<button
					@click="emit('back')"
					:disabled="!canGoBack"
					:class="[
						'px-4 py-2 rounded-lg font-medium transition-colors',
						canGoBack
							? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
							: 'text-gray-400 cursor-not-allowed',
					]"
				>
					Back
				</button>

				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-500">Step {{ currentStep }} of {{
							totalSteps
						}}</span>

					<button
						v-if="currentStep < totalSteps"
						@click="emit('next')"
						:disabled="!canGoNext"
						:class="[
							'px-6 py-2 rounded-lg font-medium transition-colors',
							canGoNext
								? 'bg-blue-500 text-white hover:bg-blue-600'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed',
						]"
					>
						Next
					</button>

					<button
						v-else
						@click="emit('finish')"
						:disabled="!canFinish"
						:class="[
							'px-6 py-2 rounded-lg font-medium transition-colors',
							canFinish
								? 'bg-green-500 text-white hover:bg-green-600'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed',
						]"
					>
						Finish
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
