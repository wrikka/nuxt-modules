<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRealtime } from "../composables/useRealtime";

const props = defineProps<{
	contentPath: string;
	currentUser?: {
		id: string;
		name: string;
		color?: string;
	};
}>();

const { events, isConnected, connect, disconnect } = useRealtime(
	props.contentPath,
);

const activeUsers = ref<
	Map<string, { id: string; name: string; color: string; lastActive: number }>
>(new Map());

const userColors = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#06b6d4",
	"#84cc16",
];

const assignColor = (userId: string) => {
	const index = userId.charCodeAt(0) % userColors.length;
	return userColors[index] || "#3b82f6";
};

const updateActiveUser = (userId: string, userName: string) => {
	if (!activeUsers.value.has(userId)) {
		activeUsers.value.set(userId, {
			id: userId,
			name: userName,
			color: assignColor(userId),
			lastActive: Date.now(),
		});
	} else {
		const user = activeUsers.value.get(userId);
		if (user) {
			user.lastActive = Date.now();
		}
	}
};

const removeInactiveUsers = () => {
	const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
	activeUsers.value.forEach((user, id) => {
		if (user.lastActive < fiveMinutesAgo && id !== props.currentUser?.id) {
			activeUsers.value.delete(id);
		}
	});
};

const sortedActiveUsers = computed(() => {
	return Array.from(activeUsers.value.values()).sort((a, b) =>
		a.name.localeCompare(b.name)
	);
});

const recentEvents = computed(() => {
	return events.value.slice(-10).reverse();
});

const formatTime = (timestamp: number) => {
	return new Date(timestamp).toLocaleTimeString("th-TH", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const getEventIcon = (type: string) => {
	const icons: Record<string, string> = {
		"content:created": "📝",
		"content:updated": "✏️",
		"content:deleted": "🗑️",
		"content:published": "🚀",
		"content:unpublished": "📤",
	};
	return icons[type] || "📄";
};

let cleanupInterval: ReturnType<typeof setInterval>;

onMounted(() => {
	connect();
	if (props.currentUser) {
		updateActiveUser(props.currentUser.id, props.currentUser.name);
	}
	cleanupInterval = setInterval(removeInactiveUsers, 60000);
});

onUnmounted(() => {
	disconnect();
	clearInterval(cleanupInterval);
});
</script>

<template>
	<div class="realtime-collaboration">
		<div class="collab-header">
			<div class="connection-status">
				<span
					class="status-dot"
					:class="{ connected: isConnected, disconnected: !isConnected }"
				/>
				<span class="status-text">{{
					isConnected ? "Connected" : "Disconnected"
				}}</span>
			</div>
			<div class="active-users-count">
				{{ sortedActiveUsers.length }} user{{
					sortedActiveUsers.length !== 1 ? "s" : ""
				}} online
			</div>
		</div>

		<div class="collab-users">
			<h4>Active Users</h4>
			<div
				v-if="sortedActiveUsers.length === 0"
				class="no-users"
			>
				No active users
			</div>
			<div
				v-else
				class="users-list"
			>
				<div
					v-for="user in sortedActiveUsers"
					:key="user.id"
					class="user-item"
				>
					<div
						class="user-avatar"
						:style="{ backgroundColor: user.color }"
					>
						{{ user.name.charAt(0).toUpperCase() }}
					</div>
					<span class="user-name">{{ user.name }}</span>
					<span
						v-if="user.id === currentUser?.id"
						class="user-badge"
					>
						You
					</span>
				</div>
			</div>
		</div>

		<div class="collab-activity">
			<h4>Recent Activity</h4>
			<div
				v-if="recentEvents.length === 0"
				class="no-activity"
			>
				No recent activity
			</div>
			<div
				v-else
				class="activity-list"
			>
				<div
					v-for="event in recentEvents"
					:key="event.timestamp"
					class="activity-item"
				>
					<span class="activity-icon">{{ getEventIcon(event.type) }}</span>
					<div class="activity-content">
						<span class="activity-type">{{
							event.type.replace("content:", "")
						}}</span>
						<span class="activity-path">{{ event.path }}</span>
					</div>
					<span class="activity-time">{{ formatTime(event.timestamp) }}</span>
				</div>
			</div>
		</div>

		<div class="collab-cursors">
			<h4>Live Cursors</h4>
			<div class="cursors-placeholder">
				<p>Cursor positions will appear here when other users are editing</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.realtime-collaboration {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

.collab-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid #e5e7eb;
}

.connection-status {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.status-dot.connected {
	background: #10b981;
}

.status-dot.disconnected {
	background: #ef4444;
}

.status-text {
	font-size: 0.875rem;
	color: #6b7280;
}

.active-users-count {
	font-size: 0.875rem;
	color: #374151;
	font-weight: 500;
}

.collab-users h4,
.collab-activity h4,
.collab-cursors h4 {
	margin: 0 0 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #374151;
}

.no-users,
.no-activity {
	padding: 1rem;
	text-align: center;
	color: #9ca3af;
	font-size: 0.875rem;
}

.users-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.user-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	background: #f9fafb;
	border-radius: 0.375rem;
}

.user-avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 0.75rem;
	font-weight: 600;
}

.user-name {
	flex: 1;
	font-size: 0.875rem;
	color: #374151;
}

.user-badge {
	padding: 0.125rem 0.375rem;
	background: #dbeafe;
	color: #1d4ed8;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-weight: 500;
}

.activity-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	max-height: 200px;
	overflow-y: auto;
}

.activity-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	background: #f9fafb;
	border-radius: 0.375rem;
}

.activity-icon {
	font-size: 1rem;
}

.activity-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.activity-type {
	font-size: 0.75rem;
	font-weight: 500;
	color: #374151;
	text-transform: capitalize;
}

.activity-path {
	font-size: 0.75rem;
	color: #6b7280;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.activity-time {
	font-size: 0.75rem;
	color: #9ca3af;
}

.cursors-placeholder {
	padding: 1rem;
	background: #f9fafb;
	border-radius: 0.375rem;
	text-align: center;
}

.cursors-placeholder p {
	margin: 0;
	font-size: 0.875rem;
	color: #9ca3af;
}
</style>
