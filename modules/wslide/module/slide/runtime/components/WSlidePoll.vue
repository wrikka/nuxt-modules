<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
	question: string;
	options: string[];
}>();

const emit = defineEmits<{
	vote: [optionIndex: number];
}>();

const votes = ref<Record<number, number>>({});
const hasVoted = ref(false);
const selectedOption = ref<number | null>(null);

const totalVotes = computed(() =>
	Object.values(votes.value).reduce((a, b) => a + b, 0),
);

const percentages = computed(() => {
	return props.options.map((_, index) => {
		const voteCount = votes.value[index] || 0;
		return totalVotes.value > 0
			? Math.round((voteCount / totalVotes.value) * 100)
			: 0;
	});
});

function vote(index: number) {
	if (hasVoted.value) return;
	votes.value[index] = (votes.value[index] || 0) + 1;
	selectedOption.value = index;
	hasVoted.value = true;
	emit("vote", index);
}

// Simulate receiving votes from other users
function simulateIncomingVote(index: number) {
	votes.value[index] = (votes.value[index] || 0) + 1;
}

defineExpose({
	simulateIncomingVote,
});
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-6 max-w-md">
		<h3 class="text-lg font-semibold text-white mb-4">{{ question }}</h3>
		<div class="space-y-3">
			<button
				v-for="(option, index) in options"
				:key="index"
				class="w-full relative overflow-hidden rounded-lg transition-all"
				:class="[
					hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-700',
					selectedOption === index ? 'ring-2 ring-blue-500' : '',
				]"
				:disabled="hasVoted"
				@click="vote(index)"
			>
				<!-- Progress bar -->
				<div
					class="absolute inset-0 bg-blue-600/30 transition-all duration-500"
					:style="{ width: `${percentages[index]}%` }"
				/>

				<div class="relative flex items-center justify-between p-3">
					<span class="text-white">{{ option }}</span>
					<span v-if="hasVoted" class="text-sm text-gray-300">
						{{ percentages[index] }}% ({{ votes[index] || 0 }})
					</span>
				</div>
			</button>
		</div>

		<div v-if="hasVoted" class="mt-4 text-center text-sm text-gray-400">
			Total votes: {{ totalVotes }}
		</div>
	</div>
</template>
