<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

interface Comment {
	id: string;
	user: string;
	avatar: string;
	timestamp: number;
	text: string;
	resolved: boolean;
	replies: number;
}

const comments = ref<Comment[]>([
	{
		id: "1",
		user: "Alice",
		avatar: "A",
		timestamp: 12.5,
		text: "Can we make this transition smoother?",
		resolved: false,
		replies: 2,
	},
	{
		id: "2",
		user: "Bob",
		avatar: "B",
		timestamp: 34.2,
		text: "Great shot! Love the lighting here.",
		resolved: true,
		replies: 0,
	},
	{
		id: "3",
		user: "Carol",
		avatar: "C",
		timestamp: 58.7,
		text: "Check audio levels - seems a bit low",
		resolved: false,
		replies: 1,
	},
]);

const newComment = ref("");
const currentTime = ref(45.3);

const addComment = () => {
	if (!newComment.value.trim()) return;
	comments.value.push({
		id: Math.random().toString(36).substr(2, 9),
		user: "You",
		avatar: "Y",
		timestamp: currentTime.value,
		text: newComment.value,
		resolved: false,
		replies: 0,
	});
	newComment.value = "";
};

const toggleResolved = (id: string) => {
	const c = comments.value.find(x => x.id === id);
	if (c) c.resolved = !c.resolved;
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Team Review & Comments"
		@close="emit('close')"
	>
		<div class="space-y-4">
			<!-- Timeline -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-2">
					<Icon name="mdi:timeline" class="w-5 h-5 text-gray-500" />
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Comment Timeline</span>
				</div>
				<div class="relative h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
					<div
						v-for="comment in comments"
						:key="comment.id"
						class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer hover:scale-125 transition-transform"
						:class="comment.resolved ? 'bg-green-500' : 'bg-yellow-500'"
						:style="{ left: `${(comment.timestamp / 120) * 100}%` }"
					/>
					<div
						class="absolute top-0 bottom-0 w-0.5 bg-blue-500"
						:style="{ left: `${(currentTime / 120) * 100}%` }"
					>
						<div class="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45" />
					</div>
				</div>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>0:00</span>
					<span>2:00</span>
				</div>
			</div>

			<!-- Add Comment -->
			<div class="flex gap-2">
				<input
					v-model="newComment"
					type="text"
					placeholder="Add a comment at current time..."
					class="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
					@keyup.enter="addComment"
				/>
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					@click="addComment"
				>
					<Icon name="mdi:send" class="w-4 h-4" />
				</button>
			</div>

			<!-- Comments List -->
			<div class="space-y-2 max-h-64 overflow-y-auto">
				<div
					v-for="comment in comments"
					:key="comment.id"
					class="p-3 rounded-lg border"
					:class="comment.resolved
					? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
					: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'"
				>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
							{{ comment.avatar }}
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<span
									class="font-medium text-sm text-gray-900 dark:text-white"
								>{{ comment.user }}</span>
								<span class="text-xs text-gray-500">{{
										comment.timestamp.toFixed(1)
									}}s</span>
								<button
									class="ml-auto text-xs px-2 py-0.5 rounded"
									:class="comment.resolved
									? 'bg-green-200 text-green-800'
									: 'bg-yellow-200 text-yellow-800'"
									@click="toggleResolved(comment.id)"
								>
									{{ comment.resolved ? "Resolved" : "Pending" }}
								</button>
							</div>
							<p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
								{{ comment.text }}
							</p>
							<div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
								<button class="hover:text-blue-500">Reply</button>
								<span v-if="comment.replies > 0">{{ comment.replies }}
									replies</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
