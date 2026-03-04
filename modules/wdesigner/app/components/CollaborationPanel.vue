<script setup lang="ts">
import type { CollaborationUser } from "../composables/useDesignerCollaboration";
import { computed, ref } from "vue";

const props = defineProps<{
	isConnected: boolean;
	isHost: boolean;
	roomId: string | null;
	localUserName: string;
	users: CollaborationUser[];
	userCount: number;
}>();

const emit = defineEmits<{
	createRoom: [userName: string];
	joinRoom: [roomId: string, userName: string];
	leaveRoom: [];
	updateUserName: [name: string];
}>();

const showCreateModal = ref(false);
const showJoinModal = ref(false);
const newUserName = ref(props.localUserName || "");
const joinRoomId = ref("");
const isExpanded = ref(true);

const onlineUsers = computed(() => props.users.filter((u) => u.isOnline));

const handleCreateRoom = () => {
	emit("createRoom", newUserName.value);
	showCreateModal.value = false;
};

const handleJoinRoom = () => {
	emit("joinRoom", joinRoomId.value, newUserName.value);
	showJoinModal.value = false;
	joinRoomId.value = "";
};

const handleLeaveRoom = () => {
	emit("leaveRoom");
};

const copyRoomLink = async () => {
	if (!props.roomId) return;
	const link = `${window.location.origin}/design?room=${props.roomId}`;
	try {
		await navigator.clipboard.writeText(link);
		console.log("Room link copied to clipboard");
	} catch {
		console.error("Failed to copy room link");
	}
};
</script>

<template>
	<div class="collaboration-panel">
		<!-- Header -->
		<div class="panel-header" @click="isExpanded = !isExpanded">
			<div class="header-left">
				<div class="status-indicator" :class="{ connected: isConnected }" />
				<span class="panel-title">Collaboration</span>
				<span v-if="isConnected" class="user-count">({{ userCount }})</span>
			</div>
			<div class="header-actions">
				<button v-if="isConnected" class="icon-btn" @click.stop="copyRoomLink" title="Copy room link">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
				</button>
				<button class="icon-btn" @click.stop="isExpanded = !isExpanded">
					<svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m18 15-6-6-6 6" />
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Content -->
		<div v-if="isExpanded" class="panel-content">
			<!-- Not Connected State -->
			<div v-if="!isConnected" class="connect-section">
				<p class="section-desc">Collaborate in real-time with your team</p>
				<div class="connect-buttons">
					<button class="btn btn-primary" @click="showCreateModal = true">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 5v14" />
							<path d="M5 12h14" />
						</svg>
						Create Room
					</button>
					<button class="btn btn-secondary" @click="showJoinModal = true">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
							<polyline points="10 17 15 12 10 7" />
							<line x1="15" x2="3" y1="12" y2="12" />
						</svg>
						Join Room
					</button>
				</div>
			</div>

			<!-- Connected State -->
			<div v-else class="connected-section">
				<div class="room-info">
					<div class="info-row">
						<span class="info-label">Room ID:</span>
						<span class="info-value room-id">{{ roomId }}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Role:</span>
						<span class="info-value">{{ isHost ? "Host" : "Guest" }}</span>
					</div>
				</div>

				<div class="users-list">
					<h4 class="list-title">Online Users ({{ onlineUsers.length }})</h4>
					<div class="users">
						<div
							v-for="user in onlineUsers"
							:key="user.id"
							class="user-item"
						>
							<div class="user-avatar" :style="{ backgroundColor: user.color }">
								{{ user.name.charAt(0).toUpperCase() }}
							</div>
							<div class="user-info">
								<span class="user-name">
									{{ user.name }}
									<span v-if="user.id === $props.localUserName" class="you-badge">You</span>
								</span>
								<span class="user-status">{{ user.isOnline ? "Online" : "Offline" }}</span>
							</div>
							<div
								v-if="user.cursor"
								class="cursor-indicator"
								:style="{ backgroundColor: user.color }"
							/>
						</div>
					</div>
				</div>

				<button class="btn btn-danger" @click="handleLeaveRoom">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" x2="9" y1="12" y2="12" />
					</svg>
					Leave Room
				</button>
			</div>
		</div>

		<!-- Create Room Modal -->
		<div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
			<div class="modal" @click.stop>
				<h3>Create Collaboration Room</h3>
				<div class="form-group">
					<label>Your Name</label>
					<input v-model="newUserName" type="text" placeholder="Enter your name" />
				</div>
				<div class="modal-actions">
					<button class="btn btn-secondary" @click="showCreateModal = false">Cancel</button>
					<button class="btn btn-primary" :disabled="!newUserName.trim()" @click="handleCreateRoom">
						Create Room
					</button>
				</div>
			</div>
		</div>

		<!-- Join Room Modal -->
		<div v-if="showJoinModal" class="modal-overlay" @click="showJoinModal = false">
			<div class="modal" @click.stop>
				<h3>Join Collaboration Room</h3>
				<div class="form-group">
					<label>Your Name</label>
					<input v-model="newUserName" type="text" placeholder="Enter your name" />
				</div>
				<div class="form-group">
					<label>Room ID</label>
					<input v-model="joinRoomId" type="text" placeholder="Enter room ID" />
				</div>
				<div class="modal-actions">
					<button class="btn btn-secondary" @click="showJoinModal = false">Cancel</button>
					<button class="btn btn-primary" :disabled="!newUserName.trim() || !joinRoomId.trim()" @click="handleJoinRoom">
						Join Room
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.collaboration-panel {
	background: var(--panel-bg, #1e1e1e);
	border-radius: 8px;
	border: 1px solid var(--panel-border, #333);
	overflow: hidden;
	font-family: system-ui, -apple-system, sans-serif;
	font-size: 14px;
}

.panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: var(--header-bg, #252525);
	cursor: pointer;
	user-select: none;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-indicator {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #6b7280;
	transition: background 0.2s;
}

.status-indicator.connected {
	background: #10b981;
	box-shadow: 0 0 8px #10b981;
}

.panel-title {
	font-weight: 600;
	color: var(--text-primary, #fff);
}

.user-count {
	color: var(--text-secondary, #9ca3af);
	font-size: 12px;
}

.header-actions {
	display: flex;
	gap: 4px;
}

.icon-btn {
	background: transparent;
	border: none;
	color: var(--text-secondary, #9ca3af);
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: all 0.2s;
}

.icon-btn:hover {
	background: var(--hover-bg, #374151);
	color: var(--text-primary, #fff);
}

.panel-content {
	padding: 16px;
}

.connect-section {
	text-align: center;
}

.section-desc {
	color: var(--text-secondary, #9ca3af);
	margin-bottom: 16px;
	font-size: 13px;
}

.connect-buttons {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 10px 16px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: #3b82f6;
	color: white;
}

.btn-primary:hover:not(:disabled) {
	background: #2563eb;
}

.btn-secondary {
	background: #374151;
	color: #f3f4f6;
}

.btn-secondary:hover {
	background: #4b5563;
}

.btn-danger {
	background: #dc2626;
	color: white;
	width: 100%;
}

.btn-danger:hover {
	background: #b91c1c;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.connected-section {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.room-info {
	background: var(--info-bg, #252525);
	padding: 12px;
	border-radius: 6px;
}

.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}

.info-row:last-child {
	margin-bottom: 0;
}

.info-label {
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
}

.info-value {
	color: var(--text-primary, #fff);
	font-weight: 500;
	font-size: 13px;
}

.room-id {
	font-family: monospace;
	font-size: 11px;
	background: var(--code-bg, #1e1e1e);
	padding: 2px 6px;
	border-radius: 4px;
}

.users-list {
	background: var(--info-bg, #252525);
	padding: 12px;
	border-radius: 6px;
}

.list-title {
	margin: 0 0 12px 0;
	font-size: 13px;
	color: var(--text-secondary, #9ca3af);
	font-weight: 500;
}

.users {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.user-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px;
	border-radius: 6px;
	background: var(--item-bg, #1e1e1e);
}

.user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 14px;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.user-name {
	color: var(--text-primary, #fff);
	font-weight: 500;
	font-size: 13px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.you-badge {
	font-size: 10px;
	background: #3b82f6;
	color: white;
	padding: 1px 4px;
	border-radius: 3px;
	font-weight: 400;
}

.user-status {
	font-size: 11px;
	color: var(--text-secondary, #9ca3af);
}

.cursor-indicator {
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: var(--modal-bg, #1e1e1e);
	border-radius: 12px;
	padding: 24px;
	width: 100%;
	max-width: 400px;
	border: 1px solid var(--modal-border, #333);
}

.modal h3 {
	margin: 0 0 20px 0;
	color: var(--text-primary, #fff);
	font-size: 18px;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 6px;
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
}

.form-group input {
	width: 100%;
	padding: 10px 12px;
	border: 1px solid var(--input-border, #374151);
	border-radius: 6px;
	background: var(--input-bg, #252525);
	color: var(--text-primary, #fff);
	font-size: 14px;
	box-sizing: border-box;
}

.form-group input:focus {
	outline: none;
	border-color: #3b82f6;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 24px;
}
</style>
