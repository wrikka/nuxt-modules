<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	addComment: [comment: Comment];
	resolveComment: [commentId: string];
}>();

interface Comment {
	id: string;
	author: string;
	avatar: string;
	text: string;
	time: number;
	frame: number;
	resolved: boolean;
	replies: Reply[];
	createdAt: Date;
}

interface Reply {
	id: string;
	author: string;
	text: string;
	createdAt: Date;
}

const comments = ref<Comment[]>([
	{
		id: "1",
		author: "Sarah Chen",
		avatar: "/avatars/sarah.jpg",
		text: "Color correction looks too warm here, can we cool it down?",
		time: 15.5,
		frame: 372,
		resolved: false,
		replies: [],
		createdAt: new Date(),
	},
	{
		id: "2",
		author: "Mike Johnson",
		avatar: "/avatars/mike.jpg",
		text: "Great shot! Maybe trim the beginning by 0.5s?",
		time: 42.3,
		frame: 1015,
		resolved: true,
		replies: [
			{ id: "r1", author: "You", text: "Done!", createdAt: new Date() },
		],
		createdAt: new Date(),
	},
]);

const newComment = ref("");
const selectedComment = ref<string | null>(null);
const currentTime = ref(30.0);

const addComment = () => {
	if (!newComment.value.trim()) return;

	comments.value.push({
		id: Date.now().toString(),
		author: "You",
		avatar: "/avatars/me.jpg",
		text: newComment.value,
		time: currentTime.value,
		frame: Math.floor(currentTime.value * 30),
		resolved: false,
		replies: [],
		createdAt: new Date(),
	});

	newComment.value = "";
};

const resolveComment = (commentId: string) => {
	const comment = comments.value.find(c => c.id === commentId);
	if (comment) {
		comment.resolved = !comment.resolved;
		emit("resolveComment", commentId);
	}
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const frames = Math.floor((seconds % 1) * 30);
	return `${mins}:${secs.toString().padStart(2, "0")}:${
		frames.toString().padStart(2, "0")
	}`;
};

const jumpToTime = (time: number) => {
	currentTime.value = time;
};
</script>

<template>
	<div class="comments-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:message-text" class="w-5 h-5 text-blue-500" />
				Comments & Annotations
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Filter Tabs -->
		<div class="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
			<button class="flex-1 px-3 py-1.5 rounded text-sm bg-blue-600 text-white font-medium">
				All
			</button>
			<button class="flex-1 px-3 py-1.5 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
				Open
			</button>
			<button class="flex-1 px-3 py-1.5 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
				Resolved
			</button>
		</div>

		<!-- New Comment -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
					You
				</div>
				<div class="text-gray-600 dark:text-gray-400 text-xs">
					At {{ formatTime(currentTime) }}
				</div>
			</div>
			<textarea
				v-model="newComment"
				placeholder="Add a comment..."
				class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm resize-none border-0"
				rows="2"
				@keydown.enter.prevent="addComment"
			/>
			<div class="flex justify-end mt-2">
				<button
					class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
					:disabled="!newComment.trim()"
					@click="addComment"
				>
					Add Comment
				</button>
			</div>
		</div>

		<!-- Comments List -->
		<div class="flex-1 overflow-y-auto space-y-3">
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="p-3 rounded-lg transition-colors"
				:class="[
					comment.resolved
						? 'bg-gray-100 dark:bg-gray-700/20 opacity-60'
						: 'bg-gray-50 dark:bg-gray-700/30',
					selectedComment === comment.id ? 'ring-2 ring-blue-500' : '',
				]"
				@click="selectedComment = comment.id"
			>
				<div class="flex items-start gap-3">
					<div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-700 dark:text-white font-medium">
						{{ comment.author[0] }}
					</div>
					<div class="flex-1">
						<div class="flex items-center justify-between">
							<span class="text-gray-900 dark:text-white text-sm font-medium">{{
								comment.author
							}}</span>
							<button
								class="text-xs px-2 py-0.5 rounded transition-colors"
								:class="comment.resolved
								? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
								: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'"
								@click.stop="resolveComment(comment.id)"
							>
								{{ comment.resolved ? "Resolved" : "Resolve" }}
							</button>
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">
							{{ formatTime(comment.time) }} • Frame {{ comment.frame }}
						</div>
						<p class="text-gray-700 dark:text-gray-300 text-sm">
							{{ comment.text }}
						</p>

						<!-- Jump Button -->
						<button
							class="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
							@click.stop="jumpToTime(comment.time)"
						>
							<Icon name="mdi:play-circle" class="w-3 h-3" />
							Jump to time
						</button>

						<!-- Replies -->
						<div v-if="comment.replies.length > 0" class="mt-3 space-y-2">
							<div
								v-for="reply in comment.replies"
								:key="reply.id"
								class="pl-3 border-l-2 border-gray-300 dark:border-gray-600"
							>
								<div class="text-gray-500 dark:text-gray-400 text-xs">
									{{ reply.author }}
								</div>
								<p class="text-gray-700 dark:text-gray-300 text-sm">
									{{ reply.text }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
