<script setup lang="ts">
interface Reviewer {
	id: string;
	name: string;
	email: string;
	avatar: string;
	status: "pending" | "reviewing" | "approved" | "rejected";
	lastActivity: Date;
	comments: number;
}

interface ReviewStage {
	id: string;
	name: string;
	order: number;
	status: "pending" | "in_progress" | "completed";
	reviewers: Reviewer[];
	dueDate?: Date;
}

interface VideoFrame {
	time: number;
	thumbnail: string;
	comments: number;
}

const projectName = ref("Summer Campaign Video");
const currentStage = ref(1);
const showShareModal = ref(false);
const showTimelineComments = ref(false);
const selectedTime = ref(0);

const stages = ref<ReviewStage[]>([
	{
		id: "1",
		name: "Creative Review",
		order: 1,
		status: "completed",
		reviewers: [
			{
				id: "1",
				name: "Alice Chen",
				email: "alice@company.com",
				avatar: "/avatars/alice.jpg",
				status: "approved",
				lastActivity: new Date("2024-01-15"),
				comments: 5,
			},
			{
				id: "2",
				name: "Bob Smith",
				email: "bob@company.com",
				avatar: "/avatars/bob.jpg",
				status: "approved",
				lastActivity: new Date("2024-01-14"),
				comments: 3,
			},
		],
	},
	{
		id: "2",
		name: "Legal Review",
		order: 2,
		status: "in_progress",
		reviewers: [
			{
				id: "3",
				name: "Carol Wu",
				email: "carol@company.com",
				avatar: "/avatars/carol.jpg",
				status: "reviewing",
				lastActivity: new Date("2024-01-16"),
				comments: 8,
			},
		],
		dueDate: new Date("2024-01-20"),
	},
	{
		id: "3",
		name: "Client Approval",
		order: 3,
		status: "pending",
		reviewers: [
			{
				id: "4",
				name: "Client Team",
				email: "client@external.com",
				avatar: "/avatars/client.jpg",
				status: "pending",
				lastActivity: new Date(),
				comments: 0,
			},
		],
		dueDate: new Date("2024-01-25"),
	},
]);

const timelineFrames: VideoFrame[] = Array.from({ length: 20 }, (_, i) => ({
	time: i * 15,
	thumbnail: `/frames/frame-${i}.jpg`,
	comments: Math.floor(Math.random() * 5),
}));

const newReviewerEmail = ref("");
const approvalMessage = ref("");

function addReviewer() {
	if (newReviewerEmail.value) {
		// Add reviewer to current stage
		newReviewerEmail.value = "";
	}
}

function approveStage(stageId: string) {
	const stage = stages.value.find(s => s.id === stageId);
	if (stage) {
		stage.status = "completed";
		stage.reviewers.forEach(r => r.status = "approved");
	}
}

function rejectStage(stageId: string) {
	const stage = stages.value.find(s => s.id === stageId);
	if (stage) {
		stage.reviewers.forEach(r => r.status = "rejected");
	}
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
		.format(date);
}

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}
</script>

<template>
	<div class="video-review-approval">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:clipboard-check" class="mr-2" />
			Video Review & Approval
		</h2>
		<p class="text-gray-500 mb-6">
			Frame-accurate comments with approval workflows
		</p>

		<!-- Project Header -->
		<div class="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
			<div>
				<h3 class="font-semibold text-lg">{{ projectName }}</h3>
				<p class="text-sm text-gray-500">Version 3.2 • Updated 2 hours ago</p>
			</div>
			<div class="flex gap-2">
				<button
					@click="showShareModal = true"
					class="px-4 py-2 border rounded-lg hover:bg-white"
				>
					<Icon name="mdi:share" class="mr-1" />
					Share for Review
				</button>
				<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
					<Icon name="mdi:check-all" class="mr-1" />
					Final Approve
				</button>
			</div>
		</div>

		<!-- Review Stages -->
		<div class="mb-6">
			<div class="flex items-center gap-4 mb-4">
				<div
					v-for="(stage, index) in stages"
					:key="stage.id"
					class="flex items-center"
				>
					<div
						class="stage-indicator flex items-center gap-2 px-4 py-2 rounded-lg"
						:class="{
							'bg-green-100 text-green-700': stage.status === 'completed',
							'bg-blue-100 text-blue-700': stage.status === 'in_progress',
							'bg-gray-100 text-gray-500': stage.status === 'pending',
						}"
					>
						<Icon
							:name="stage.status === 'completed'
							? 'mdi:check-circle'
							: stage.status === 'in_progress'
							? 'mdi:progress-clock'
							: 'mdi:clock-outline'"
						/>
						<span class="font-medium">{{ stage.name }}</span>
						<span v-if="stage.dueDate" class="text-xs opacity-75">
							(Due {{ formatDate(stage.dueDate) }})
						</span>
					</div>
					<Icon
						v-if="index < stages.length - 1"
						name="mdi:chevron-right"
						class="text-gray-400 mx-2"
					/>
				</div>
			</div>
		</div>

		<!-- Video Preview with Timeline Comments -->
		<div class="grid grid-cols-3 gap-6">
			<!-- Video Player -->
			<div class="col-span-2">
				<div class="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:play-circle" class="text-6xl text-white/50" />
					</div>

					<!-- Frame Comments Overlay -->
					<div
						v-if="showTimelineComments"
						class="absolute right-4 top-4 bottom-4 w-64 bg-black/80 rounded-lg p-4 overflow-y-auto"
					>
						<h4 class="text-white font-medium mb-3">
							Comments at {{ formatTime(selectedTime) }}
						</h4>
						<div class="space-y-3">
							<div class="bg-white/10 rounded p-3">
								<div class="flex items-center gap-2 mb-1">
									<img src="/avatars/alice.jpg" class="w-6 h-6 rounded-full" />
									<span class="text-white text-sm">Alice</span>
								</div>
								<p class="text-white/80 text-sm">
									Color grading looks great here!
								</p>
							</div>
							<div class="bg-white/10 rounded p-3">
								<div class="flex items-center gap-2 mb-1">
									<img src="/avatars/bob.jpg" class="w-6 h-6 rounded-full" />
									<span class="text-white text-sm">Bob</span>
								</div>
								<p class="text-white/80 text-sm">
									Consider trimming this section
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Timeline with Comment Markers -->
				<div class="bg-gray-100 rounded-lg p-4">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-sm font-medium">Timeline Comments</span>
						<button
							@click="showTimelineComments = !showTimelineComments"
							class="text-sm text-blue-600 hover:underline"
						>
							{{ showTimelineComments ? "Hide" : "Show" }} Comments
						</button>
					</div>
					<div class="flex gap-1 overflow-x-auto">
						<div
							v-for="frame in timelineFrames"
							:key="frame.time"
							class="flex-shrink-0 w-16 cursor-pointer"
							@click="selectedTime = frame.time;
							showTimelineComments = true;"
						>
							<div class="aspect-video bg-gray-300 rounded mb-1 relative">
								<img
									:src="frame.thumbnail"
									class="w-full h-full object-cover rounded"
								/>
								<div
									v-if="frame.comments > 0"
									class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
								>
									{{ frame.comments }}
								</div>
							</div>
							<div class="text-xs text-center text-gray-500">
								{{ formatTime(frame.time) }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Reviewers Panel -->
			<div class="space-y-4">
				<div
					v-for="stage in stages"
					:key="stage.id"
					class="bg-gray-50 rounded-lg p-4"
				>
					<div class="flex items-center justify-between mb-3">
						<h4 class="font-medium">{{ stage.name }}</h4>
						<span
							class="text-xs px-2 py-1 rounded"
							:class="{
								'bg-green-100 text-green-700': stage.status === 'completed',
								'bg-blue-100 text-blue-700': stage.status === 'in_progress',
								'bg-gray-100 text-gray-500': stage.status === 'pending',
							}"
						>
							{{ stage.status.replace("_", " ") }}
						</span>
					</div>

					<div class="space-y-2">
						<div
							v-for="reviewer in stage.reviewers"
							:key="reviewer.id"
							class="flex items-center gap-3 p-2 bg-white rounded"
						>
							<img :src="reviewer.avatar" class="w-8 h-8 rounded-full" />
							<div class="flex-1 min-w-0">
								<div class="text-sm font-medium truncate">
									{{ reviewer.name }}
								</div>
								<div class="text-xs text-gray-500">
									{{ reviewer.comments }} comments
								</div>
							</div>
							<Icon
								:name="reviewer.status === 'approved'
								? 'mdi:check-circle'
								: reviewer.status === 'rejected'
								? 'mdi:close-circle'
								: 'mdi:clock-outline'"
								:class="{
									'text-green-500': reviewer.status === 'approved',
									'text-red-500': reviewer.status === 'rejected',
									'text-gray-400': reviewer.status === 'pending'
										|| reviewer.status === 'reviewing',
								}"
							/>
						</div>
					</div>

					<!-- Add Reviewer -->
					<div v-if="stage.status === 'in_progress'" class="mt-3">
						<div class="flex gap-2">
							<input
								v-model="newReviewerEmail"
								type="email"
								placeholder="Add reviewer email..."
								class="flex-1 text-sm border rounded px-2 py-1"
							/>
							<button
								@click="addReviewer"
								class="px-2 py-1 bg-blue-600 text-white rounded text-sm"
							>
								<Icon name="mdi:plus" />
							</button>
						</div>
					</div>

					<!-- Stage Actions -->
					<div v-if="stage.status === 'in_progress'" class="flex gap-2 mt-3">
						<button
							@click="approveStage(stage.id)"
							class="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700"
						>
							<Icon name="mdi:check" class="mr-1" />
							Approve
						</button>
						<button
							@click="rejectStage(stage.id)"
							class="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700"
						>
							<Icon name="mdi:close" class="mr-1" />
							Request Changes
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Share Modal -->
		<div
			v-if="showShareModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-xl font-bold mb-4">Share for Review</h3>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Reviewer Email</label>
						<input
							v-model="newReviewerEmail"
							type="email"
							class="w-full border rounded-lg px-4 py-2"
							placeholder="reviewer@example.com"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Stage</label>
						<select class="w-full border rounded-lg px-4 py-2">
							<option
								v-for='stage in stages.filter(s => s.status !== "completed")'
								:key="stage.id"
							>
								{{ stage.name }}
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2"
						>Message (optional)</label>
						<textarea
							v-model="approvalMessage"
							rows="3"
							class="w-full border rounded-lg px-4 py-2"
							placeholder="Add instructions or context..."
						/>
					</div>

					<div class="flex items-center gap-2">
						<input type="checkbox" id="allowComments" checked class="rounded" />
						<label for="allowComments" class="text-sm"
						>Allow frame-accurate comments</label>
					</div>
					<div class="flex items-center gap-2">
						<input type="checkbox" id="allowDownload" class="rounded" />
						<label for="allowDownload" class="text-sm">Allow download</label>
					</div>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						@click="showShareModal = false"
						class="px-4 py-2 border rounded-lg"
					>
						Cancel
					</button>
					<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<Icon name="mdi:send" class="mr-1" />
						Send Invitation
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.video-review-approval {
	padding: 1.5rem;
}
</style>
