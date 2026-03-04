<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const position = defineModel<"left" | "right" | "bottom">("position", {
	default: "right",
});
const maxMessages = defineModel<number>("maxMessages", { default: 5 });
const showAvatars = defineModel<boolean>("showAvatars", { default: true });
const highlightMentions = defineModel<boolean>("highlightMentions", {
	default: true,
});
const filterSpam = defineModel<boolean>("filterSpam", { default: true });
const chatOpacity = defineModel<number>("opacity", { default: 80 });

const chatMessages = ref([
	{
		id: 1,
		username: "User1",
		message: "Great content! 🔥",
		avatar: "U1",
		color: "blue",
		isSubscriber: true,
	},
	{
		id: 2,
		username: "User2",
		message: "Love this topic",
		avatar: "U2",
		color: "green",
		isModerator: true,
	},
	{
		id: 3,
		username: "User3",
		message: "Question: How does this work?",
		avatar: "U3",
		color: "purple",
	},
]);

const sampleQuestions = ref([
	"What software are you using?",
	"Can you show that again?",
	"When is the next stream?",
	"Great explanation!",
]);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
					<Icon
						name="mdi:chat"
						class="w-5 h-5 text-pink-600 dark:text-pink-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Live Chat Overlay
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Display viewer comments on screen
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-pink-600 mt-0.5" />
					<p class="text-xs text-pink-700 dark:text-pink-300">
						Connects to YouTube/Twitch chat and displays messages as an overlay
						during recording or streaming.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Position</label>
				<div class="flex gap-2">
					<button
						v-for='pos in ["left", "right", "bottom"] as const'
						:key="pos"
						:class="[
							'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize',
							position === pos
								? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700'
								: 'border-gray-200 dark:border-gray-700 hover:border-pink-300',
						]"
						@click="position = pos"
					>
						{{ pos }}
					</button>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Opacity</span>
					<span class="text-gray-500">{{ chatOpacity }}%</span>
				</div>
				<input
					v-model.number="chatOpacity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-pink-600"
				>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Max Visible Messages</span>
					<span class="text-gray-500">{{ maxMessages }}</span>
				</div>
				<input
					v-model.number="maxMessages"
					type="range"
					min="1"
					max="10"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-pink-600"
				>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="showAvatars"
						type="checkbox"
						class="w-4 h-4 text-pink-600 rounded"
					>
					<Icon name="mdi:account-circle" class="w-4 h-4 text-pink-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Show Avatars</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="highlightMentions"
						type="checkbox"
						class="w-4 h-4 text-pink-600 rounded"
					>
					<Icon name="mdi:at" class="w-4 h-4 text-yellow-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Highlight @mentions</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="filterSpam"
						type="checkbox"
						class="w-4 h-4 text-pink-600 rounded"
					>
					<Icon name="mdi:filter" class="w-4 h-4 text-green-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Filter Spam</span>
				</label>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Preview
				</h4>
				<div
					:class="`p-3 rounded-lg bg-gray-900/90 space-y-2 ${
						chatOpacity < 50 ? 'opacity-50' : ''
					}`"
					:style="{ opacity: chatOpacity / 100 }"
				>
					<div
						v-for="msg in chatMessages.slice(0, maxMessages)"
						:key="msg.id"
						class="flex items-start gap-2"
					>
						<div
							v-if="showAvatars"
							:class="`w-6 h-6 rounded-full bg-${msg.color}-500 flex items-center justify-center text-xs text-white font-bold`"
						>
							{{ msg.avatar }}
						</div>
						<div class="flex-1 min-w-0">
							<span :class="`text-xs font-bold text-${msg.color}-400`">
								{{ msg.username }}
								<Icon
									v-if="msg.isSubscriber"
									name="mdi:star"
									class="w-3 h-3 inline text-yellow-400"
								/>
								<Icon
									v-if="msg.isModerator"
									name="mdi:shield"
									class="w-3 h-3 inline text-green-400"
								/>
							</span>
							<p class="text-sm text-white/90 truncate">{{ msg.message }}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
				<Icon name="mdi:connection" class="w-4 h-4 text-green-500" />
				<span class="text-xs text-gray-600 dark:text-gray-400"
				>Connected to chat • {{ chatMessages.length }} messages</span>
			</div>
		</div>
	</div>
</template>
