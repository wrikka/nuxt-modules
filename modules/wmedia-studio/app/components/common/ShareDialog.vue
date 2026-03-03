<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	users: {
		id: string;
		name: string;
		avatar?: string;
		status: "online" | "offline" | "away";
	}[];
}>();

const emit = defineEmits<{
	close: [];
	invite: [email: string];
	remove: [userId: string];
}>();

const inviteEmail = ref("");
const activeTab = ref<"members" | "invite">("members");
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Share Project
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Tabs -->
			<div class="flex border-b border-gray-200 dark:border-gray-700">
				<button
					@click="activeTab = 'members'"
					:class="[
						'flex-1 py-3 text-sm font-medium',
						activeTab === 'members'
							? 'text-blue-500 border-b-2 border-blue-500'
							: 'text-gray-500',
					]"
				>
					Members ({{ users.length }})
				</button>
				<button
					@click="activeTab = 'invite'"
					:class="[
						'flex-1 py-3 text-sm font-medium',
						activeTab === 'invite'
							? 'text-blue-500 border-b-2 border-blue-500'
							: 'text-gray-500',
					]"
				>
					Invite
				</button>
			</div>

			<!-- Members Tab -->
			<div v-if="activeTab === 'members'" class="p-4 max-h-80 overflow-y-auto">
				<div class="space-y-2">
					<div
						v-for="user in users"
						:key="user.id"
						class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
					>
						<div class="relative">
							<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
								{{ user.name[0] }}
							</div>
							<span
								:class="[
									'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800',
									user.status === 'online'
										? 'bg-green-500'
										: user.status === 'away'
										? 'bg-yellow-500'
										: 'bg-gray-400',
								]"
							/>
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-white">
								{{ user.name }}
							</p>
							<p class="text-xs text-gray-500 capitalize">{{ user.status }}</p>
						</div>
						<button
							@click="emit('remove', user.id)"
							class="p-2 hover:bg-red-100 hover:text-red-500 rounded-lg transition-colors"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<!-- Invite Tab -->
			<div v-else class="p-4">
				<div class="flex gap-2">
					<input
						v-model="inviteEmail"
						type="email"
						placeholder="Enter email address"
						class="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg"
						@keyup.enter='emit("invite", inviteEmail);
						inviteEmail = "";'
					/>
					<button
						@click='emit("invite", inviteEmail);
						inviteEmail = "";'
						:disabled="!inviteEmail"
						class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
					>
						Invite
					</button>
				</div>
				<p class="text-xs text-gray-500 mt-2">
					Invite team members by email address
				</p>
			</div>
		</div>
	</div>
</template>
