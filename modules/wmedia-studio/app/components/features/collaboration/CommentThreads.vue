<script setup lang="ts">
const comments = ref([
	{
		id: 1,
		author: "Alice",
		avatar: "👩‍🎨",
		content: "This section looks great! Maybe add more contrast?",
		time: "5 minutes ago",
		x: 150,
		y: 120,
		replies: [
			{
				author: "Bob",
				content: "Agreed, maybe darker text?",
				time: "3 minutes ago",
			},
		],
	},
	{
		id: 2,
		author: "Bob",
		avatar: "👨‍💻",
		content: "The hero image needs to be higher resolution",
		time: "10 minutes ago",
		x: 400,
		y: 80,
		replies: [],
	},
]);

const activeComment = ref<number | null>(null);
const newReply = ref("");
const showAllPins = ref(true);

const toggleComment = (id: number) => {
	activeComment.value = activeComment.value === id ? null : id;
};

const addReply = (commentId: number) => {
	if (!newReply.value.trim()) return;
	const comment = comments.value.find(c => c.id === commentId);
	if (comment) {
		comment.replies.push({
			author: "You",
			content: newReply.value,
			time: "Just now",
		});
		newReply.value = "";
	}
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
			@click="showAllPins = !showAllPins"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
				/>
			</svg>
			<span class="text-sm font-medium">{{ comments.length }} Comments</span>
		</button>

		<!-- Comment Pins on Canvas -->
		<div v-if="showAllPins" class="pointer-events-auto fixed inset-0 z-30">
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="absolute cursor-pointer"
				:style="{ left: `${comment.x}px`, top: `${comment.y}px` }"
				@click="toggleComment(comment.id)"
			>
				<!-- Pin -->
				<div
					class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform hover:scale-110"
					:class="activeComment === comment.id
					? 'bg-yellow-500 ring-4 ring-yellow-200'
					: 'bg-yellow-400'"
				>
					{{ comment.avatar }}
				</div>

				<!-- Comment Thread Popup -->
				<div
					v-if="activeComment === comment.id"
					class="absolute left-10 top-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-40"
					@click.stop
				>
					<!-- Main Comment -->
					<div class="flex gap-2 mb-3">
						<span class="text-lg">{{ comment.avatar }}</span>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<span class="font-medium text-sm">{{ comment.author }}</span>
								<span class="text-xs text-gray-500">{{ comment.time }}</span>
							</div>
							<p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
								{{ comment.content }}
							</p>
						</div>
					</div>

					<!-- Replies -->
					<div v-if="comment.replies.length" class="ml-8 space-y-2 mb-3">
						<div
							v-for="(reply, idx) in comment.replies"
							:key="idx"
							class="flex gap-2 text-sm"
						>
							<span class="font-medium">{{ reply.author }}:</span>
							<span class="text-gray-600 dark:text-gray-400">{{
								reply.content
							}}</span>
							<span class="text-xs text-gray-400">{{ reply.time }}</span>
						</div>
					</div>

					<!-- Reply Input -->
					<div class="flex gap-2">
						<input
							v-model="newReply"
							type="text"
							placeholder="Reply..."
							class="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
							@keyup.enter="addReply(comment.id)"
						/>
						<button
							class="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
							@click="addReply(comment.id)"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
