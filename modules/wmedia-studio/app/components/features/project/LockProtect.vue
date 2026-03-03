<script setup lang="ts">
const isLocked = ref(false);
const password = ref("");
const permissions = ref({ view: true, comment: false, edit: false });
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Lock / Protect</h4>
		<div class="space-y-2 mb-2">
			<label class="flex items-center gap-2 text-xs">
				<input v-model="isLocked" type="checkbox"> Lock editing
			</label>
			<input
				v-model="password"
				type="password"
				placeholder="Password (optional)"
				class="w-full p-2 border rounded text-sm"
			>
		</div>
		<div class="text-xs text-gray-500 mb-2">Permissions:</div>
		<div class="space-y-1 text-xs">
			<label class="flex items-center gap-2"><input
					v-model="permissions.view"
					type="checkbox"
				> View</label>
			<label class="flex items-center gap-2"><input
					v-model="permissions.comment"
					type="checkbox"
				> Comment</label>
			<label class="flex items-center gap-2"><input
					v-model="permissions.edit"
					type="checkbox"
				> Edit</label>
		</div>
	</div>
</template>
