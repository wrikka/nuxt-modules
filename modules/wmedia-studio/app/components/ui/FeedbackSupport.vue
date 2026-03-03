<script setup lang="ts">
const emit = defineEmits<{ close: []; submit: [feedback: any] }>();
const feedbackType = ref("bug");
const message = ref("");
const rating = ref(5);
const isSubmitting = ref(false);

const submit = () => {
	if (!message.value.trim()) return;
	isSubmitting.value = true;
	setTimeout(() => {
		isSubmitting.value = false;
		emit("submit", {
			type: feedbackType.value,
			message: message.value,
			rating: rating.value,
		});
		message.value = "";
	}, 1000);
};
</script>
<template>
	<div class="feedback-support bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:message-text" class="w-5 h-5 text-blue-500" />
				Feedback & Support
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				v-for='t in ["bug", "feature", "general"]'
				:key="t"
				class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"
				:class="feedbackType === t
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
				@click="feedbackType = t"
			>
				{{ t }}
			</button>
		</div>
		<div v-if="feedbackType === 'general'" class="mb-4">
			<div class="flex justify-center gap-2">
				<button
					v-for="i in 5"
					:key="i"
					@click="rating = i"
					class="transition-colors"
				>
					<Icon
						:name="i <= rating ? 'mdi:star' : 'mdi:star-outline'"
						:class="[i <= rating ? 'text-yellow-400' : 'text-gray-300', 'w-6 h-6']"
					/>
				</button>
			</div>
		</div>
		<textarea
			v-model="message"
			placeholder="Describe your feedback..."
			class="w-full h-32 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm resize-none mb-4 border-0"
		/>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isSubmitting || !message.trim()"
			@click="submit"
		>
			<Icon
				v-if="isSubmitting"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Submit Feedback
		</button>
	</div>
</template>
