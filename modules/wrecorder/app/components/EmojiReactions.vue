<script setup lang="ts">
const props = defineProps<{
	recordingId: string;
}>();

const emit = defineEmits<{
	select: [emoji: string];
}>();

const enabled = ref(false);
const selectedEmojis = ref<string[]>([]);
const displayDuration = ref(3);
const size = ref("medium");
const position = ref("bottom-right");

const emojiCategories = [
	{
		name: "Reactions",
		emojis: ["👍", "👎", "❤️", "🔥", "🎉", "👏", "😂", "😮", "😢", "🤔"],
	},
	{
		name: "Pointers",
		emojis: ["👆", "👇", "👈", "👉", "👍", "👎", "✌️", "🤞", "🤟", "🤘"],
	},
	{
		name: "Objects",
		emojis: ["⭐", "💡", "⚠️", "❌", "✅", "💯", "🎯", "🏆", "💎", "🔑"],
	},
];

const positions = [
	{ id: "top-left", name: "Top Left" },
	{ id: "top-right", name: "Top Right" },
	{ id: "bottom-left", name: "Bottom Left" },
	{ id: "bottom-right", name: "Bottom Right" },
];

const sizes = [
	{ id: "small", name: "Small", scale: 0.7 },
	{ id: "medium", name: "Medium", scale: 1 },
	{ id: "large", name: "Large", scale: 1.5 },
];

const toggleEmoji = (emoji: string) => {
	const index = selectedEmojis.value.indexOf(emoji);
	if (index > -1) {
		selectedEmojis.value.splice(index, 1);
	} else {
		selectedEmojis.value.push(emoji);
	}
};

const triggerEmoji = (emoji: string) => {
	emit("select", emoji);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Emoji Reactions
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<!-- Quick Reactions (Favorites) -->
			<div class="flex gap-2 flex-wrap">
				<button
					v-for="emoji in selectedEmojis.slice(0, 5)"
					:key="emoji"
					class="text-2xl p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-110 transition-transform"
					@click="triggerEmoji(emoji)"
				>
					{{ emoji }}
				</button>
			</div>

			<!-- Emoji Picker -->
			<div class="space-y-2">
				<div v-for="category in emojiCategories" :key="category.name">
					<p class="text-xs text-gray-500 mb-1">{{ category.name }}</p>
					<div class="flex gap-1 flex-wrap">
						<button
							v-for="emoji in category.emojis"
							:key="emoji"
							:class="[
								'text-xl p-1.5 rounded transition-all',
								selectedEmojis.includes(emoji)
									? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500'
									: 'hover:bg-gray-100 dark:hover:bg-gray-700',
							]"
							@click="toggleEmoji(emoji)"
						>
							{{ emoji }}
						</button>
					</div>
				</div>
			</div>

			<!-- Settings -->
			<div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
					>Position</label>
					<select
						v-model="position"
						class="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					>
						<option v-for="pos in positions" :key="pos.id" :value="pos.id">
							{{ pos.name }}
						</option>
					</select>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
					>Size</label>
					<select
						v-model="size"
						class="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					>
						<option v-for="s in sizes" :key="s.id" :value="s.id">
							{{ s.name }}
						</option>
					</select>
				</div>
			</div>

			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Display Duration: {{ displayDuration }}s</label>
				<input
					v-model.number="displayDuration"
					type="range"
					min="1"
					max="10"
					class="w-full"
				/>
			</div>
		</div>
	</div>
</template>
