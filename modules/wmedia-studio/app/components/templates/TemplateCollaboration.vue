<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "invite", email: string, role: string): void;
	(e: "remove", userId: string): void;
	(e: "updateRole", userId: string, role: string): void;
	(e: "close"): void;
}>();

const collaborators = ref([
	{
		id: "c1",
		name: "John Doe",
		email: "john@example.com",
		role: "owner",
		avatar: "https://i.pravatar.cc/150?u=10",
		status: "active",
	},
	{
		id: "c2",
		name: "Jane Smith",
		email: "jane@example.com",
		role: "editor",
		avatar: "https://i.pravatar.cc/150?u=11",
		status: "active",
	},
	{
		id: "c3",
		name: "Bob Wilson",
		email: "bob@example.com",
		role: "viewer",
		avatar: "https://i.pravatar.cc/150?u=12",
		status: "pending",
	},
]);

const inviteEmail = ref("");
const inviteRole = ref("editor");

const roles = [
	{
		value: "viewer",
		label: "Viewer",
		description: "Can view and use template",
	},
	{ value: "editor", label: "Editor", description: "Can modify template" },
	{
		value: "admin",
		label: "Admin",
		description: "Full access including sharing",
	},
];

const getRoleColor = (role: string) => {
	const colors: Record<string, string> = {
		owner:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
		admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
		editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
		viewer: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
	};
	return colors[role] || colors.viewer;
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Template Collaboration
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6">
					<!-- Invite -->
					<div class="mb-6">
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Invite Collaborator</label>
						<div class="flex gap-2">
							<input
								v-model="inviteEmail"
								type="email"
								placeholder="Enter email address"
								class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
							<select
								v-model="inviteRole"
								class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option
									v-for="role in roles"
									:key="role.value"
									:value="role.value"
								>
									{{ role.label }}
								</option>
							</select>
							<button
								class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
								@click="$emit('invite', inviteEmail, inviteRole)"
							>
								Invite
							</button>
						</div>
					</div>

					<!-- Collaborators List -->
					<div class="space-y-3">
						<h3 class="font-medium text-gray-900 dark:text-white mb-3">
							Team Members
						</h3>
						<div
							v-for="user in collaborators"
							:key="user.id"
							class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
						>
							<img :src="user.avatar" class="w-10 h-10 rounded-full" />
							<div class="flex-1 min-w-0">
								<div class="font-medium text-gray-900 dark:text-white truncate">
									{{ user.name }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 truncate">
									{{ user.email }}
								</div>
							</div>
							<span
								class="px-2 py-1 rounded-full text-xs font-medium capitalize"
								:class="getRoleColor(user.role)"
							>
								{{ user.role }}
							</span>
							<span
								v-if="user.status === 'pending'"
								class="text-xs text-yellow-600 dark:text-yellow-400"
							>Pending</span>
							<button
								v-if="user.role !== 'owner'"
								class="p-1.5 text-gray-400 hover:text-red-500"
								@click="$emit('remove', user.id)"
							>
								<i class="i-mdi-delete" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
