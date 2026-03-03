<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	title?: string;
}>();

const emit = defineEmits<{
	close: [];
	select: [emoji: string];
}>();

const categories = [
	{
		name: "Smileys",
		emojis: [
			"😀",
			"😃",
			"😄",
			"😁",
			"😆",
			"😅",
			"😂",
			"🤣",
			"😊",
			"😇",
			"🙂",
			"🙃",
			"😉",
			"😌",
			"😍",
			"🥰",
		],
	},
	{
		name: "Gestures",
		emojis: [
			"👍",
			"👎",
			"👌",
			"✌️",
			"🤞",
			"🤟",
			"🤘",
			"🤙",
			"👈",
			"👉",
			"👆",
			"👇",
			"☝️",
			"👋",
			"🤚",
			"🖐️",
		],
	},
	{
		name: "Hearts",
		emojis: [
			"❤️",
			"🧡",
			"💛",
			"💚",
			"💙",
			"💜",
			"🖤",
			"🤍",
			"🤎",
			"❣️",
			"💕",
			"💞",
			"💓",
			"💗",
			"💖",
			"💘",
		],
	},
	{
		name: "Objects",
		emojis: [
			"🎨",
			"🎬",
			"🎤",
			"🎧",
			"🎼",
			"🎹",
			"🎸",
			"🎺",
			"🎻",
			"🥁",
			"📷",
			"📸",
			"📹",
			"🎥",
			"📽️",
			"🎞️",
		],
	},
];

const activeCategory = ref(0);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl p-4 w-full max-w-sm shadow-2xl">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold text-gray-900 dark:text-white">
					{{ title || "Select Emoji" }}
				</h3>
				<button
					@click="emit('close')"
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Categories -->
			<div class="flex gap-2 mb-3 overflow-x-auto pb-2">
				<button
					v-for="(cat, i) in categories"
					:key="cat.name"
					@click="activeCategory = i"
					:class="[
						'px-3 py-1 text-xs rounded-full whitespace-nowrap',
						activeCategory === i
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-600',
					]"
				>
					{{ cat.name }}
				</button>
			</div>

			<!-- Emoji Grid -->
			<div class="grid grid-cols-8 gap-1">
				<button
					v-for="emoji in categories[activeCategory]?.emojis ?? []"
					:key="emoji"
					@click='emit("select", emoji);
					emit("close");'
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-2xl"
				>
					{{ emoji }}
				</button>
			</div>
		</div>
	</div>
</template>
