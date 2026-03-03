<script setup lang="ts">
const isOpen = ref(false);
const email = ref("");
const message = ref("Check out this design!");
const platforms = ["Email", "Slack", "Teams", "Link"];
const selected = ref("Link");
</script>
<template>
	<div>
		<button
			class="px-3 py-2 bg-green-600 text-white rounded-lg"
			@click="isOpen = true"
		>
			🔗 Share
		</button>
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
			@click.self="isOpen = false"
		>
			<div class="w-96 bg-white rounded-xl p-4">
				<h3 class="font-medium mb-3">Share Design</h3>
				<div class="flex gap-1 mb-3">
					<button
						v-for="p in platforms"
						:key="p"
						:class="[
							'flex-1 py-1 rounded text-xs',
							selected === p ? 'bg-green-600 text-white' : 'bg-gray-100',
						]"
						@click="selected = p"
					>
						{{ p }}
					</button>
				</div>
				<input
					v-model="email"
					placeholder="Enter email..."
					class="w-full p-2 border rounded mb-2"
				>
				<textarea
					v-model="message"
					class="w-full p-2 border rounded mb-2 h-16 text-sm"
				></textarea>
				<button
					class="w-full py-2 bg-green-600 text-white rounded"
					@click="isOpen = false"
				>
					Send
				</button>
			</div>
		</div>
	</div>
</template>
