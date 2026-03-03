<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	invite: [email: string, role: "viewer" | "editor" | "admin"];
	removeUser: [userId: string];
	updateUserRole: [userId: string, role: "viewer" | "editor" | "admin"];
	toggleFollow: [userId: string];
}>();

interface Collaborator {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: "viewer" | "editor" | "admin" | "owner";
	status: "online" | "away" | "offline";
	cursorPosition?: { x: number; y: number };
	currentTime?: number;
	color: string;
	isFollowing: boolean;
	lastSeen: Date;
}

interface Activity {
	id: string;
	userId: string;
	userName: string;
	userColor: string;
	action: string;
	target: string;
	timestamp: Date;
}

const collaborators = ref<Collaborator[]>([
	{
		id: "user-1",
		name: "You",
		email: "you@example.com",
		role: "owner",
		status: "online",
		color: "#3b82f6",
		isFollowing: false,
		lastSeen: new Date(),
	},
	{
		id: "user-2",
		name: "Sarah Chen",
		email: "sarah@example.com",
		role: "editor",
		status: "online",
		cursorPosition: { x: 250, y: 180 },
		currentTime: 12.5,
		color: "#ec4899",
		isFollowing: false,
		lastSeen: new Date(),
	},
	{
		id: "user-3",
		name: "Mike Johnson",
		email: "mike@example.com",
		role: "editor",
		status: "away",
		color: "#10b981",
		isFollowing: true,
		lastSeen: new Date(Date.now() - 5 * 60 * 1000),
	},
]);

const recentActivity = ref<Activity[]>([
	{
		id: "act-1",
		userId: "user-2",
		userName: "Sarah Chen",
		userColor: "#ec4899",
		action: "trimmed",
		target: "Video Clip #3",
		timestamp: new Date(Date.now() - 2 * 60 * 1000),
	},
	{
		id: "act-2",
		userId: "user-3",
		userName: "Mike Johnson",
		userColor: "#10b981",
		action: "added",
		target: "Transition: Cross Dissolve",
		timestamp: new Date(Date.now() - 5 * 60 * 1000),
	},
	{
		id: "act-3",
		userId: "user-2",
		userName: "Sarah Chen",
		userColor: "#ec4899",
		action: "moved",
		target: "Audio Track 2",
		timestamp: new Date(Date.now() - 8 * 60 * 1000),
	},
]);

const inviteEmail = ref("");
const inviteRole = ref<"viewer" | "editor" | "admin">("editor");
const showInviteForm = ref(false);
const activeTab = ref<"users" | "activity">("users");
const followingUserId = ref<string | null>(null);

const onlineCount = computed(() =>
	collaborators.value.filter(c => c.status === "online").length
);

const canInvite = computed(() => {
	const me = collaborators.value.find(c => c.role === "owner");
	return me?.role === "owner" || me?.role === "admin";
});

const handleInvite = () => {
	if (!inviteEmail.value.trim()) return;
	emit("invite", inviteEmail.value.trim(), inviteRole.value);
	inviteEmail.value = "";
	showInviteForm.value = false;
};

const toggleFollow = (userId: string) => {
	if (followingUserId.value === userId) {
		followingUserId.value = null;
	} else {
		followingUserId.value = userId;
	}
	emit("toggleFollow", userId);
};

const removeCollaborator = (userId: string) => {
	const index = collaborators.value.findIndex(c => c.id === userId);
	if (index !== -1 && collaborators.value[index]!.role !== "owner") {
		collaborators.value.splice(index, 1);
		emit("removeUser", userId);
	}
};

const updateRole = (userId: string, newRole: "viewer" | "editor" | "admin") => {
	const user = collaborators.value.find(c => c.id === userId);
	if (user && user.role !== "owner") {
		user.role = newRole;
		emit("updateUserRole", userId, newRole);
	}
};

const getStatusIcon = (status: Collaborator["status"]): string => {
	const icons: Record<string, string> = {
		online: "mdi:circle",
		away: "mdi:moon-waning-crescent",
		offline: "mdi:circle-off",
	};
	return icons[status] ?? "mdi:help-circle";
};

const getRoleLabel = (role: Collaborator["role"]): string => {
	const labels: Record<string, string> = {
		owner: "Owner",
		admin: "Admin",
		editor: "Editor",
		viewer: "Viewer",
	};
	return labels[role] ?? role;
};

const formatTimeAgo = (date: Date): string => {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="collaboration-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[420px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:account-group" class="w-5 h-5 text-blue-500" />
				Collaboration
			</h3>
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
					<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
					<span
						class="text-xs text-green-700 dark:text-green-400 font-medium"
					>{{ onlineCount }} online</span>
				</div>
				<button
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
			<button
				class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
				:class="activeTab === 'users'
				? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="activeTab = 'users'"
			>
				<span class="flex items-center justify-center gap-1.5">
					<Icon name="mdi:account-group" class="w-4 h-4" />
					Users
				</span>
			</button>
			<button
				class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
				:class="activeTab === 'activity'
				? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="activeTab = 'activity'"
			>
				<span class="flex items-center justify-center gap-1.5">
					<Icon name="mdi:chart-timeline-variant" class="w-4 h-4" />
					Activity
				</span>
			</button>
		</div>

		<!-- Users Tab -->
		<div v-if="activeTab === 'users'" class="flex-1 overflow-y-auto">
			<!-- Invite Button -->
			<button
				v-if="canInvite && !showInviteForm"
				class="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="showInviteForm = true"
			>
				<Icon name="mdi:account-plus" class="w-4 h-4" />
				Invite Collaborator
			</button>

			<!-- Invite Form -->
			<div
				v-if="showInviteForm"
				class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
			>
				<div class="space-y-2">
					<input
						v-model="inviteEmail"
						type="email"
						placeholder="Enter email address..."
						class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						@keyup.enter="handleInvite"
					>
					<div class="flex gap-2">
						<select
							v-model="inviteRole"
							class="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="viewer">Viewer (View only)</option>
							<option value="editor">Editor (Can edit)</option>
							<option value="admin">Admin (Full access)</option>
						</select>
					</div>
					<div class="flex gap-2">
						<button
							class="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
							@click="showInviteForm = false"
						>
							Cancel
						</button>
						<button
							class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
							:disabled="!inviteEmail.trim()"
							@click="handleInvite"
						>
							Send Invite
						</button>
					</div>
				</div>
			</div>

			<!-- User List -->
			<div class="space-y-2">
				<div
					v-for="user in collaborators"
					:key="user.id"
					class="group p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
				>
					<div class="flex items-start gap-3">
						<!-- Avatar -->
						<div class="relative">
							<div
								class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
								:style="{ backgroundColor: user.color }"
							>
								{{ user.name.charAt(0).toUpperCase() }}
							</div>
							<!-- Status Indicator -->
							<div
								class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800"
								:class="{
									'bg-green-500': user.status === 'online',
									'bg-yellow-500': user.status === 'away',
									'bg-gray-400': user.status === 'offline',
								}"
							/>
						</div>

						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<span
									class="text-sm font-medium text-gray-900 dark:text-white"
								>{{ user.name }}</span>
								<span
									v-if="user.role === 'owner'"
									class="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-medium rounded"
								>
									OWNER
								</span>
							</div>
							<div class="text-xs text-gray-500">{{ user.email }}</div>

							<!-- Role Badge & Actions -->
							<div class="flex items-center gap-2 mt-1.5">
								<select
									v-if="user.role !== 'owner' && canInvite"
									v-model="user.role"
									class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									@change="updateRole(
										user.id,
										user.role as 'viewer' | 'editor' | 'admin',
									)"
								>
									<option value="viewer">Viewer</option>
									<option value="editor">Editor</option>
									<option value="admin">Admin</option>
								</select>
								<span
									v-else
									class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
								>
									{{ getRoleLabel(user.role) }}
								</span>

								<!-- Current Position -->
								<div
									v-if="user.currentTime !== undefined && user.status === 'online'"
									class="flex items-center gap-1 text-xs text-gray-400"
								>
									<Icon name="mdi:play-circle" class="w-3 h-3" />
									{{ formatTime(user.currentTime) }}
								</div>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex flex-col gap-1">
							<button
								v-if="user.id !== 'user-1' && user.status === 'online'"
								class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								:class="followingUserId === user.id
								? 'text-blue-500'
								: 'text-gray-400'"
								:title="followingUserId === user.id ? 'Stop following' : 'Follow user'"
								@click="toggleFollow(user.id)"
							>
								<Icon
									:name="followingUserId === user.id
									? 'mdi:account-check'
									: 'mdi:account'"
									class="w-4 h-4"
								/>
							</button>
							<button
								v-if="user.role !== 'owner' && canInvite"
								class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
								title="Remove"
								@click="removeCollaborator(user.id)"
							>
								<Icon name="mdi:account-remove" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Activity Tab -->
		<div v-else class="flex-1 overflow-y-auto">
			<div class="space-y-3">
				<div
					v-for="activity in recentActivity"
					:key="activity.id"
					class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
				>
					<div
						class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
						:style="{ backgroundColor: activity.userColor }"
					>
						{{ activity.userName.charAt(0).toUpperCase() }}
					</div>
					<div class="flex-1 min-w-0">
						<div class="text-sm text-gray-900 dark:text-white">
							<span class="font-medium">{{ activity.userName }}</span>
							<span class="text-gray-500">{{ activity.action }}</span>
							<span class="font-medium">{{ activity.target }}</span>
						</div>
						<div class="text-xs text-gray-400 mt-0.5">
							{{ formatTimeAgo(activity.timestamp) }}
						</div>
					</div>
				</div>
			</div>

			<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-blue-500 mt-0.5" />
					<div class="text-xs text-blue-700 dark:text-blue-300">
						Activity is logged for all collaborators. You can see who made
						changes and when.
					</div>
				</div>
			</div>
		</div>

		<!-- Cursor Preview Info -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between text-xs">
				<span class="text-gray-500 dark:text-gray-400">
					{{ collaborators.length }} total member{{
						collaborators.length === 1 ? "" : "s"
					}}
				</span>
				<span class="text-gray-500 dark:text-gray-400">
					{{ onlineCount }} online
				</span>
			</div>
		</div>
	</div>
</template>
