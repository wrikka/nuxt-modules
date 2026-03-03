<script setup lang="ts">
const teams = ref([
	{ id: 1, name: "Design Team", members: 5, role: "Editor" },
	{ id: 2, name: "Marketing", members: 3, role: "Viewer" },
]);
const invites = ref(["member@company.com"]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Team Management</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="t in teams"
				:key="t.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<div>
					<div class="font-medium">{{ t.name }}</div>
					<div class="text-gray-500">
						{{ t.members }} members • {{ t.role }}
					</div>
				</div>
				<button class="text-blue-600">Manage</button>
			</div>
		</div>
		<input
			placeholder="Invite by email..."
			class="w-full p-2 border rounded text-sm"
		>
	</div>
</template>
