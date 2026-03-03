<script setup lang="ts">
const emit = defineEmits<
	{
		close: [];
		reply: [commentId: string, text: string];
		resolve: [commentId: string];
	}
>();
const comments = ref([{
	id: "1",
	author: "John Doe",
	avatar: "JD",
	text: "Great work! Can we adjust the colors?",
	time: "2h ago",
	resolved: false,
	replies: [{
		id: "r1",
		author: "You",
		text: "Sure, will do!",
		time: "1h ago",
	}],
}, {
	id: "2",
	author: "Jane Smith",
	avatar: "JS",
	text: "The animation feels too fast",
	time: "5h ago",
	resolved: true,
	replies: [],
}]);
const replyText = ref("");
const replyTo = ref<string | null>(null);
const reply = (commentId: string) => {
	if (!replyText.value.trim()) return;
	emit("reply", commentId, replyText.value);
	replyText.value = "";
	replyTo.value = null;
};
const resolve = (commentId: string) => emit("resolve", commentId);
</script>
<template>
	<div class="comments-thread bg-gray-800 rounded-lg p-4 w-[450px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-chat-circle-text" class="w-5 h-5" />Comments
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-4">
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="p-3 rounded-lg"
				:class="comment.resolved ? 'bg-gray-700/30 opacity-60' : 'bg-gray-700/50'"
			>
				<div class="flex gap-3">
					<div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
						{{ comment.avatar }}
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-2 mb-1">
							<span class="text-white text-sm font-medium">{{
								comment.author
							}}</span><span class="text-gray-500 text-xs">{{
								comment.time
							}}</span><span
								v-if="comment.resolved"
								class="px-1.5 py-0.5 bg-green-600/30 text-green-400 rounded text-xs"
							>Resolved</span>
						</div>
						<p class="text-gray-300 text-sm mb-2">{{ comment.text }}</p>
						<div v-if="comment.replies.length > 0" class="space-y-2 mt-2">
							<div
								v-for="reply in comment.replies"
								:key="reply.id"
								class="pl-3 border-l-2 border-gray-600"
							>
								<div class="text-gray-400 text-xs mb-0.5">
									{{ reply.author }} • {{ reply.time }}
								</div>
								<p class="text-gray-300 text-sm">{{ reply.text }}</p>
							</div>
						</div>
						<div v-if="replyTo === comment.id" class="mt-2">
							<input
								v-model="replyText"
								type="text"
								placeholder="Write a reply..."
								class="w-full bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm"
								@keydown.enter="reply(comment.id)"
							/>
						</div>
						<div v-else class="flex gap-2 mt-2">
							<button
								class="text-xs text-blue-400 hover:text-blue-300"
								@click="replyTo = comment.id"
							>
								Reply
							</button>
							<button
								v-if="!comment.resolved"
								class="text-xs text-green-400 hover:text-green-300"
								@click="resolve(comment.id)"
							>
								Resolve
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
