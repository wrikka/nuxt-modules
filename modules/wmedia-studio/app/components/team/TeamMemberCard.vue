<script setup lang="ts">
import type { TeamMember } from "#shared/types/collaboration";
import { ref, watch } from "vue";

const props = defineProps<{
	member: TeamMember;
}>();

const emit = defineEmits<{
	updateRole: [memberId: string, role: string];
	remove: [memberId: string];
}>();

const localRole = ref(props.member.role);

watch(
	() => props.member.role,
	(newRole) => {
		localRole.value = newRole;
	},
);

const handleRoleChange = () => {
	emit("updateRole", props.member.userId, localRole.value);
};
</script>

<template>
	<div class="team-member-card flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
		<div class="flex items-center gap-3">
			<div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
				{{ member.userName.charAt(0).toUpperCase() }}
			</div>
			<div>
				<p class="text-sm font-medium text-gray-900 dark:text-white">
					{{ member.userName }}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					{{ member.role }}
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<select
				v-model="localRole"
				@change="handleRoleChange"
				class="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				:disabled="member.role === 'owner'"
			>
				<option value="owner">Owner</option>
				<option value="admin">Admin</option>
				<option value="member">Member</option>
			</select>
			<button
				v-if="member.role !== 'owner'"
				@click="$emit('remove', member.userId)"
				class="p-1 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
			>
				<i class="i-mdi-close" />
			</button>
		</div>
	</div>
</template>
