<script setup lang="ts">
interface TimelineComment {
	id: string;
	author: string;
	avatar: string;
	text: string;
	timestamp: number;
	duration: number;
	type: "comment" | "suggestion" | "approval";
	resolved: boolean;
	appearAt: number;
	disappearAt: number | null;
}

const videoDuration = ref(180); // 3 minutes
const currentTime = ref(45);
const selectedComment = ref<TimelineComment | null>(null);
const showCommentEditor = ref(false);
const newCommentText = ref("");
const newCommentType = ref<"comment" | "suggestion" | "approval">("comment");
const commentStartTime = ref(0);
const commentEndTime = ref<number | null>(null);

const comments = ref<TimelineComment[]>([
	{
		id: "1",
		author: "Alice Chen",
		avatar: "/avatars/alice.jpg",
		text: "The transition here feels too abrupt. Consider adding a fade.",
		timestamp: 30,
		duration: 5,
		type: "suggestion",
		resolved: false,
		appearAt: 25,
		disappearAt: 40,
	},
	{
		id: "2",
		author: "Bob Smith",
		avatar: "/avatars/bob.jpg",
		text: "Great shot! This framing is perfect.",
		timestamp: 75,
		duration: 3,
		type: "approval",
		resolved: true,
		appearAt: 70,
		disappearAt: null,
	},
	{
		id: "3",
		author: "Carol Wu",
		avatar: "/avatars/carol.jpg",
		text: "Text overlay appears too fast here.",
		timestamp: 120,
		duration: 8,
		type: "comment",
		resolved: false,
		appearAt: 115,
		disappearAt: 135,
	},
]);

const visibleComments = computed(() => {
	return comments.value.filter(c =>
		currentTime.value >= c.appearAt
		&& (c.disappearAt === null || currentTime.value <= c.disappearAt)
	);
});

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function seekToTime(time: number) {
	currentTime.value = time;
}

function selectComment(comment: TimelineComment) {
	selectedComment.value = comment;
	currentTime.value = comment.timestamp;
}

function addComment() {
	if (newCommentText.value) {
		comments.value.push({
			id: Date.now().toString(),
			author: "You",
			avatar: "/avatars/you.jpg",
			text: newCommentText.value,
			timestamp: commentStartTime.value,
			duration: commentEndTime.value
				? commentEndTime.value - commentStartTime.value
				: 5,
			type: newCommentType.value,
			resolved: false,
			appearAt: commentStartTime.value,
			disappearAt: commentEndTime.value,
		});
		newCommentText.value = "";
		showCommentEditor.value = false;
	}
}

function toggleResolved(comment: TimelineComment) {
	comment.resolved = !comment.resolved;
}

function deleteComment(comment: TimelineComment) {
	const index = comments.value.indexOf(comment);
	if (index > -1) comments.value.splice(index, 1);
}
</script>

<template>
	<div class="time-locked-comments">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:comment-text-clock" class="mr-2" />
			Time-Locked Comments
		</h2>
		<p class="text-gray-500 mb-6">
			Comments that appear/disappear at specific timestamps
		</p>

		<div class="grid grid-cols-3 gap-6">
			<!-- Video Preview -->
			<div class="col-span-2">
				<div class="aspect-video bg-gray-900 rounded-lg relative overflow-hidden mb-4">
					<!-- Video Placeholder -->
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:play-circle" class="text-6xl text-white/50" />
					</div>

					<!-- Active Comments Overlay -->
					<div class="absolute bottom-20 left-4 right-4 space-y-2">
						<div
							v-for="comment in visibleComments"
							:key="comment.id"
							class="bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm"
							:class="{
								'border-l-4 border-yellow-500': comment.type === 'suggestion',
								'border-l-4 border-green-500': comment.type === 'approval',
							}"
						>
							<div class="flex items-start gap-3">
								<img :src="comment.avatar" class="w-8 h-8 rounded-full" />
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<span class="font-medium text-sm">{{
											comment.author
										}}</span>
										<span class="text-xs text-gray-400">{{
											formatTime(comment.timestamp)
										}}</span>
										<span
											class="text-xs px-2 py-0.5 rounded"
											:class="{
												'bg-yellow-500/30': comment.type === 'suggestion',
												'bg-green-500/30': comment.type === 'approval',
												'bg-blue-500/30': comment.type === 'comment',
											}"
										>
											{{ comment.type }}
										</span>
									</div>
									<p class="text-sm mt-1">{{ comment.text }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Current Time Display -->
					<div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
						{{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
					</div>
				</div>

				<!-- Timeline -->
				<div class="bg-gray-100 rounded-lg p-4">
					<div class="relative h-12 bg-gray-200 rounded mb-2">
						<!-- Comment Markers -->
						<div
							v-for="comment in comments"
							:key="comment.id"
							class="absolute top-0 h-full cursor-pointer group"
							:style="{
								left: `${(comment.appearAt / videoDuration) * 100}%`,
								width: comment.disappearAt
									? `${
										((comment.disappearAt - comment.appearAt) / videoDuration)
										* 100
									}%`
									: '2%',
							}"
							@click="selectComment(comment)"
						>
							<div
								class="h-full rounded"
								:class="{
									'bg-yellow-400': comment.type === 'suggestion'
										&& !comment.resolved,
									'bg-green-400': comment.type === 'approval'
										|| comment.resolved,
									'bg-blue-400': comment.type === 'comment'
										&& !comment.resolved,
									'opacity-50': comment.resolved,
								}"
							/>
							<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
								<img :src="comment.avatar" class="w-5 h-5 rounded-full" />
							</div>
						</div>

						<!-- Playhead -->
						<div
							class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
							:style="{ left: `${(currentTime / videoDuration) * 100}%` }"
						>
							<div class="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
						</div>
					</div>

					<!-- Time Ruler -->
					<div class="flex justify-between text-xs text-gray-500">
						<span v-for="n in 6" :key="n">{{
							formatTime((n - 1) * (videoDuration / 5))
						}}</span>
					</div>
				</div>
			</div>

			<!-- Comments Panel -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">
						Timeline Comments ({{ comments.length }})
					</h3>
					<button
						@click="showCommentEditor = true"
						class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
					>
						<Icon name="mdi:plus" class="mr-1" />
						Add
					</button>
				</div>

				<div class="space-y-2 max-h-96 overflow-y-auto">
					<div
						v-for="comment in comments"
						:key="comment.id"
						class="p-3 border rounded-lg cursor-pointer transition-all"
						:class="{
							'ring-2 ring-blue-500 bg-blue-50':
								selectedComment?.id === comment.id,
							'opacity-50': comment.resolved,
							'hover:bg-gray-50': selectedComment?.id !== comment.id,
						}"
						@click="selectComment(comment)"
					>
						<div class="flex items-start gap-3">
							<img :src="comment.avatar" class="w-8 h-8 rounded-full" />
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="font-medium text-sm">{{ comment.author }}</span>
									<span class="text-xs text-gray-500">{{
										formatTime(comment.timestamp)
									}}</span>
								</div>
								<p class="text-sm text-gray-600 truncate">{{ comment.text }}</p>
								<div class="flex items-center gap-2 mt-2">
									<span
										class="text-xs px-2 py-0.5 rounded"
										:class="{
											'bg-yellow-100 text-yellow-700':
												comment.type === 'suggestion',
											'bg-green-100 text-green-700':
												comment.type === 'approval',
											'bg-blue-100 text-blue-700': comment.type === 'comment',
										}"
									>
										{{ comment.type }}
									</span>
									<span
										v-if="comment.disappearAt"
										class="text-xs text-gray-500"
									>
										{{ formatTime(comment.appearAt) }} - {{
											formatTime(comment.disappearAt)
										}}
									</span>
									<span v-else class="text-xs text-gray-500">
										From {{ formatTime(comment.appearAt) }}
									</span>
								</div>
							</div>
						</div>

						<div class="flex items-center gap-2 mt-3">
							<button
								@click.stop="toggleResolved(comment)"
								class="text-xs px-2 py-1 rounded"
								:class="comment.resolved
								? 'bg-green-100 text-green-700'
								: 'bg-gray-100 hover:bg-gray-200'"
							>
								<Icon
									:name="comment.resolved ? 'mdi:check' : 'mdi:check-circle-outline'"
									class="mr-1"
								/>
								{{ comment.resolved ? "Resolved" : "Resolve" }}
							</button>
							<button
								@click.stop="deleteComment(comment)"
								class="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
							>
								<Icon name="mdi:delete" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Add Comment Modal -->
		<div
			v-if="showCommentEditor"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-xl font-bold mb-4">Add Time-Locked Comment</h3>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1">Comment Type</label>
						<div class="flex gap-2">
							<button
								v-for='type in ["comment", "suggestion", "approval"] as const'
								:key="type"
								@click="newCommentType = type"
								class="px-3 py-1 rounded text-sm capitalize"
								:class="newCommentType === type
								? 'bg-blue-600 text-white'
								: 'border hover:bg-gray-50'"
							>
								{{ type }}
							</button>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Comment</label>
						<textarea
							v-model="newCommentText"
							rows="3"
							class="w-full border rounded-lg px-3 py-2"
							placeholder="Enter your comment..."
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-1"
							>Appear At (seconds)</label>
							<input
								v-model.number="commentStartTime"
								type="number"
								class="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium mb-1"
							>Disappear At (optional)</label>
							<input
								v-model.number="commentEndTime"
								type="number"
								class="w-full border rounded px-3 py-2"
								placeholder="Leave empty to show permanently"
							/>
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						@click="showCommentEditor = false"
						class="px-4 py-2 border rounded-lg"
					>
						Cancel
					</button>
					<button
						@click="addComment"
						:disabled="!newCommentText"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						Add Comment
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.time-locked-comments {
	padding: 1.5rem;
}
</style>
