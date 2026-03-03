<script setup lang="ts">
const emit = defineEmits<
	{ close: []; invite: [email: string, role: string] }
>();
const members = ref([{
	id: "1",
	name: "John Doe",
	email: "john@example.com",
	role: "admin",
	avatar: "JD",
	status: "online",
}, {
	id: "2",
	name: "Jane Smith",
	email: "jane@example.com",
	role: "editor",
	avatar: "JS",
	status: "offline",
}]);
const inviteEmail = ref("");
const inviteRole = ref("editor");
const roles = [
	{ id: "admin", name: "Admin" },
	{ id: "editor", name: "Editor" },
	{ id: "viewer", name: "Viewer" },
];
const invite = () => {
	if (!inviteEmail.value.trim()) return;
	emit("invite", inviteEmail.value, inviteRole.value);
	inviteEmail.value = "";
};
const removeMember = (id: string) => {
	members.value = members.value.filter(m => m.id !== id);
};
</script>
<template>
	<div class="team-collaboration bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-users" class="w-5 h-5" />Team Collaboration
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="mb-4 p-3 bg-gray-700/50 rounded-lg">
			<h4 class="text-gray-300 text-sm mb-2">Invite Member</h4>
			<div class="flex gap-2">
				<input
					v-model="inviteEmail"
					type="email"
					placeholder="Email address"
					class="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
				/>
				<select
					v-model="inviteRole"
					class="bg-gray-700 text-white px-2 py-2 rounded-lg text-sm"
				>
					<option v-for="r in roles" :key="r.id" :value="r.id">
						{{ r.name }}
					</option>
				</select>
				<button
					class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
					@click="invite"
				>
					Invite
				</button>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto">
			<h4 class="text-gray-400 text-xs mb-2">
				Team Members ({{ members.length }})
			</h4>
			<div class="space-y-2">
				<div
					v-for="member in members"
					:key="member.id"
					class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
				>
					<div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
						{{ member.avatar }}
					</div>
					<div class="flex-1">
						<div class="text-white text-sm">{{ member.name }}</div>
						<div class="text-gray-400 text-xs">{{ member.email }}</div>
					</div>
					<span class="px-2 py-0.5 bg-gray-600 text-gray-300 rounded text-xs">{{
						member.role
					}}</span>
					<div
						class="w-2 h-2 rounded-full"
						:class="member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'"
					/>
					<button
						class="text-gray-400 hover:text-red-400"
						@click="removeMember(member.id)"
					>
						<Icon name="i-ph-trash" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
