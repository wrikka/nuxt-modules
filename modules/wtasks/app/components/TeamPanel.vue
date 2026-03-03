<script setup lang="ts">
const {
	teamMembers,
	activityLog,
	mentions,
	fetchTeamMembers,
	fetchActivityLog,
	markMentionAsRead,
	getUserStatus,
	getStatusColor,
} = useTeamCollaboration()

const activeTab = ref<"members" | "activity" | "mentions">("members")

onMounted(() => {
	fetchTeamMembers()
	fetchActivityLog()
})
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
		<!-- Tabs -->
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				v-for="tab in ['members', 'activity', 'mentions']"
				:key="tab"
				class="flex-1 px-4 py-3 text-sm font-medium capitalize"
				:class="activeTab === tab
					? 'text-blue-600 border-b-2 border-blue-600'
					: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="activeTab = tab as typeof activeTab"
			>
				{{ tab }}
				<span v-if="tab === 'mentions' && mentions.filter(m => !m.read).length > 0" class="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
					{{ mentions.filter(m => !m.read).length }}
				</span>
			</button>
		</div>

		<!-- Team Members -->
		<div v-if="activeTab === 'members'" class="p-4">
			<div class="space-y-3">
				<div
					v-for="member in teamMembers"
					:key="member.id"
					class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
				>
					<div class="relative">
						<img
							:src="member.avatarUrl"
							:alt="member.name"
							class="w-10 h-10 rounded-full"
						>
						<span
							class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
							:class="getStatusColor(getUserStatus(member.id))"
						/>
					</div>
					<div class="flex-1">
						<p class="font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
						<p class="text-sm text-gray-500">{{ member.role }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Activity Feed -->
		<div v-if="activeTab === 'activity'" class="p-4">
			<div class="space-y-3">
				<div
					v-for="activity in activityLog.slice(0, 20)"
					:key="activity.id"
					class="flex gap-3 p-3"
				>
					<img
						:src="activity.user.avatarUrl"
						:alt="activity.user.name"
						class="w-8 h-8 rounded-full"
					>
					<div class="flex-1">
						<p class="text-sm text-gray-900 dark:text-white">
							<span class="font-medium">{{ activity.user.name }}</span>
							{{ activity.type.replace('_', ' ') }}
							<span v-if="activity.taskTitle" class="font-medium">{{ activity.taskTitle }}</span>
						</p>
						<p class="text-xs text-gray-500">
							{{ new Date(activity.createdAt).toLocaleString() }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Mentions -->
		<div v-if="activeTab === 'mentions'" class="p-4">
			<div v-if="mentions.length === 0" class="text-center py-8 text-gray-500">
				No mentions yet
			</div>
			<div v-else class="space-y-3">
				<div
					v-for="mention in mentions"
					:key="mention.id"
					class="flex items-center gap-3 p-3 rounded-lg"
					:class="mention.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'"
				>
					<Icon name="mdi:at" class="w-5 h-5 text-blue-500" />
					<div class="flex-1">
						<p class="text-sm text-gray-900 dark:text-white">
							{{ mention.mentionedBy }} mentioned you in a comment
						</p>
						<p class="text-xs text-gray-500">
							{{ new Date(mention.createdAt).toLocaleString() }}
						</p>
					</div>
					<button
						v-if="!mention.read"
						class="text-xs text-blue-600 hover:text-blue-700"
						@click="markMentionAsRead(mention.id)"
					>
						Mark read
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
