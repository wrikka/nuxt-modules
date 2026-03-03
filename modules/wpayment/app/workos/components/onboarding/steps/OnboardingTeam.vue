<script setup lang="ts">
interface TeamMember {
	id: string;
	name: string;
	role: string;
	avatar?: string;
}

const props = defineProps<{
	members: TeamMember[];
}>();

const emit = defineEmits<{
	message: [member: TeamMember];
}>();

const getInitials = (name: string) => {
	return name.split(" ").map(n => n.charAt(0)).join("").toUpperCase();
};
</script>

<template>
	<div class="step-team">
		<h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Meet Your Team</h2>
		<p class="text-gray-600 text-center mb-6">Here are some people you might work with</p>

		<div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
			<div
				v-for="member in members"
				:key="member.id"
				class="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
			>
				<div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mb-3">
					<img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" />
					<div v-else class="w-full h-full flex items-center justify-center text-lg font-bold text-gray-500">
						{{ getInitials(member.name) }}
					</div>
				</div>
				<div class="text-center mb-3">
					<h4 class="font-medium text-gray-800 text-sm">{{ member.name }}</h4>
					<p class="text-xs text-gray-600">{{ member.role }}</p>
				</div>
				<WorkOSButton variant="secondary" sm @click="emit('message', member)">Message</WorkOSButton>
			</div>
		</div>
	</div>
</template>
