<script setup lang="ts">
const {
	teamMembers,
	activities,
	loading,
	error,
	fetchTeamMembers,
	fetchActivities,
	updateMemberRole,
	removeMember,
} = useCollaboration();

const showInviteModal = ref(false);

const recentActivities = ref(activities.value.slice(0, 10));

onMounted(() => {
	fetchTeamMembers("default");
	fetchActivities();
});

const handleUpdateRole = async (memberId: string, role: string) => {
	await updateMemberRole("default", memberId, role);
};

const handleRemoveMember = async (memberId: string) => {
	if (confirm("Are you sure you want to remove this member?")) {
		await removeMember("default", memberId);
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Manage your team members and permissions
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
								Team Members
							</h2>
							<button
								@click="showInviteModal = true"
								class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
							>
								<i class="i-mdi-plus mr-1" />
								Invite Member
							</button>
						</div>

						<div v-if="loading" class="flex items-center justify-center py-12">
							<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
						</div>

						<div
							v-else-if="error"
							class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
						>
							{{ error }}
						</div>

						<div v-else class="space-y-3">
							<TeamMemberCard
								v-for="member in teamMembers"
								:key="member.userId"
								:member="member"
								@update-role="handleUpdateRole"
								@remove="handleRemoveMember"
							/>
						</div>
					</div>
				</div>

				<div>
					<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Recent Activity
						</h2>
						<div v-if="loading" class="flex items-center justify-center py-12">
							<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
						</div>
						<div v-else class="space-y-2">
							<ActivityItem
								v-for="activity in recentActivities"
								:key="activity.id"
								:activity="activity"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
