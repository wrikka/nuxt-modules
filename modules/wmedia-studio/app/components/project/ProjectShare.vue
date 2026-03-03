<script setup lang="ts">
import { computed, ref } from "vue";

interface Member {
	id: string;
	name: string;
	email: string;
	role: "owner" | "admin" | "editor" | "viewer";
}

const props = defineProps<{
	projectId: string;
	loading?: boolean;
}>();

const emit = defineEmits<{
	invite: [email: string, role: string];
	updateRole: [memberId: string, role: string];
	remove: [memberId: string];
}>();

const members = ref<Member[]>([
	{ id: "1", name: "John Doe", email: "john@example.com", role: "owner" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com", role: "editor" },
]);

const inviteEmail = ref("");
const inviteRole = ref<"editor" | "viewer">("editor");

const shareLink = computed(() =>
	`${window.location.origin}/projects/${props.projectId}`
);

const copyShareLink = async () => {
	await navigator.clipboard.writeText(shareLink.value);
};

const inviteMember = () => {
	if (!inviteEmail.value) return;
	emit("invite", inviteEmail.value, inviteRole.value);
	inviteEmail.value = "";
};

const updateMemberRole = (memberId: string, role: string) => {
	emit("updateRole", memberId, role);
};

const removeMember = (memberId: string) => {
	emit("remove", memberId);
};
</script>

<template>
	<div class="project-share space-y-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Share Project
			</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Share this project with your team members
			</p>
		</div>

		<div>
			<label
				for="shareLink"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Share Link</label>
			<div class="mt-1 flex gap-2">
				<input
					id="shareLink"
					:value="shareLink"
					readonly
					class="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
				/>
				<button
					@click="copyShareLink"
					type="button"
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					<i class="i-mdi-content-copy" />
				</button>
			</div>
		</div>

		<div>
			<h4 class="text-base font-medium text-gray-900 dark:text-white">
				Team Members
			</h4>
			<div class="mt-3 space-y-2">
				<div
					v-for="member in members"
					:key="member.id"
					class="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700"
				>
					<div class="flex items-center gap-3">
						<div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
							{{ member.name.charAt(0).toUpperCase() }}
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{{ member.name }}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{{ member.email }}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<select
							v-model="member.role"
							@change="updateMemberRole(member.id, member.role)"
							class="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="owner">Owner</option>
							<option value="admin">Admin</option>
							<option value="editor">Editor</option>
							<option value="viewer">Viewer</option>
						</select>
						<button
							v-if="member.role !== 'owner'"
							@click="removeMember(member.id)"
							type="button"
							class="p-1 text-red-500 hover:bg-red-50 rounded"
						>
							<i class="i-mdi-close" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h4 class="text-base font-medium text-gray-900 dark:text-white">
				Invite Member
			</h4>
			<div class="mt-3 flex gap-2">
				<input
					v-model="inviteEmail"
					type="email"
					placeholder="Enter email address"
					class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
				<select
					v-model="inviteRole"
					class="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<option value="editor">Editor</option>
					<option value="viewer">Viewer</option>
				</select>
				<button
					@click="inviteMember"
					:disabled="loading"
					type="button"
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
				>
					<i v-if="loading" class="i-mdi-loading animate-spin" />
					Invite
				</button>
			</div>
		</div>
	</div>
</template>
