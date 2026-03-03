<script setup lang="ts">
const isLoading = ref(false);
const url = ref("");
const embedCode = ref("");
const platforms = ["YouTube", "Vimeo", "TikTok", "Instagram"];
const selected = ref("YouTube");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Embed External Media</h4>
		<select v-model="selected" class="w-full p-2 border rounded text-sm mb-2">
			<option v-for="p in platforms" :key="p">{{ p }}</option>
		</select>
		<input
			v-model="url"
			placeholder="Paste URL..."
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<button
			:disabled="!url"
			class="w-full py-2 bg-red-600 text-white rounded text-sm"
			@click="isLoading = true"
		>
			Embed
		</button>
	</div>
</template>
