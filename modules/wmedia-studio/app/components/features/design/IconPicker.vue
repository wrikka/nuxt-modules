<script setup lang="ts">
const icons = ["star", "heart", "thumb-up", "share", "bookmark", "comment"];
const selectedIcon = ref("star");
const color = ref("#FFD700");
const size = ref(24);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Icon Picker</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="i in icons"
				:key="i"
				:class="[
					'p-2 rounded',
					selectedIcon === i
						? 'bg-yellow-100 ring-2 ring-yellow-400'
						: 'bg-gray-50',
				]"
				@click="selectedIcon = i"
			>
				<span class="text-lg">{{
					i === "star"
					? "⭐"
					: i === "heart"
					? "❤️"
					: i === "thumb-up"
					? "👍"
					: i === "share"
					? "🔗"
					: i === "bookmark"
					? "🔖"
					: "💬"
				}}</span>
			</button>
		</div>
		<div class="flex items-center gap-2">
			<input v-model="color" type="color" class="w-8 h-8 rounded">
			<input v-model="size" type="range" min="12" max="64" class="flex-1">
			<span class="text-xs w-8">{{ size }}px</span>
		</div>
	</div>
</template>
