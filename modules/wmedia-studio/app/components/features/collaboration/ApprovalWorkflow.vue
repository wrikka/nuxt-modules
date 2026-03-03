<script setup lang="ts">
interface Reviewer {
	id: string;
	name: string;
	avatar: string;
	status: "pending" | "reviewing" | "approved" | "rejected";
	comment?: string;
	reviewedAt?: string;
}

interface ApprovalStage {
	id: string;
	name: string;
	status: "completed" | "in-progress" | "pending";
	reviewers: Reviewer[];
}

const approvalStages = ref<ApprovalStage[]>([
	{
		id: "1",
		name: "Design Review",
		status: "completed",
		reviewers: [{
			id: "r1",
			name: "Alice Chen",
			avatar: "AC",
			status: "approved",
			comment: "Looks great!",
			reviewedAt: "2h ago",
		}],
	},
	{
		id: "2",
		name: "Brand Compliance",
		status: "in-progress",
		reviewers: [{
			id: "r2",
			name: "Bob Smith",
			avatar: "BS",
			status: "reviewing",
			comment: "Checking brand guidelines...",
		}],
	},
	{
		id: "3",
		name: "Final Approval",
		status: "pending",
		reviewers: [{
			id: "r3",
			name: "Carol White",
			avatar: "CW",
			status: "pending",
		}],
	},
]);

const getStatusColor = (status: string) => {
	const colors: Record<string, string> = {
		completed: "bg-green-500",
		"in-progress": "bg-blue-500",
		pending: "bg-gray-300",
		approved: "bg-green-500",
		rejected: "bg-red-500",
		reviewing: "bg-yellow-500",
	};
	return colors[status] || "bg-gray-300";
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Approval Workflow
			</h3>
			<button class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
				Request Review
			</button>
		</div>

		<!-- Progress Bar -->
		<div class="flex items-center mb-6">
			<div
				v-for="(stage, i) in approvalStages"
				:key="stage.id"
				class="flex items-center flex-1"
			>
				<div
					:class="getStatusColor(stage.status)"
					class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
				>
					<Icon
						v-if="stage.status === 'completed'"
						name="mdi:check"
						class="w-5 h-5"
					/>
					<span v-else>{{ i + 1 }}</span>
				</div>
				<div
					v-if="i < approvalStages.length - 1"
					:class="stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'"
					class="flex-1 h-1 mx-2"
				/>
			</div>
		</div>

		<!-- Stage Details -->
		<div class="space-y-4">
			<div
				v-for="stage in approvalStages"
				:key="stage.id"
				class="border-l-4 pl-4 py-2"
				:class="getStatusColor(stage.status).replace('bg-', 'border-')"
			>
				<div class="flex items-center justify-between mb-2">
					<h4 class="font-medium">{{ stage.name }}</h4>
					<span
						:class="getStatusColor(stage.status)"
						class="px-2 py-0.5 text-xs rounded-full text-white capitalize"
					>{{ stage.status.replace("-", " ") }}</span>
				</div>

				<div class="flex flex-wrap gap-2">
					<div
						v-for="reviewer in stage.reviewers"
						:key="reviewer.id"
						class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full"
					>
						<div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
							{{ reviewer.avatar }}
						</div>
						<span class="text-sm">{{ reviewer.name }}</span>
						<span
							v-if="reviewer.status === 'approved'"
							class="text-green-500"
						><Icon name="mdi:check-circle" class="w-4 h-4" /></span>
						<span
							v-else-if="reviewer.status === 'rejected'"
							class="text-red-500"
						><Icon name="mdi:close-circle" class="w-4 h-4" /></span>
						<span
							v-else-if="reviewer.status === 'reviewing'"
							class="text-yellow-500"
						><Icon name="mdi:clock" class="w-4 h-4" /></span>
					</div>
				</div>

				<p
					v-if="stage.reviewers[0]?.comment"
					class="mt-2 text-sm text-gray-500 italic"
				>
					"{{ stage.reviewers[0].comment }}"
				</p>
			</div>
		</div>
	</div>
</template>
