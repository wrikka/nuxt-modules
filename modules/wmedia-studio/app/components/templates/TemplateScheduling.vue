<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "schedule", templateId: string, platforms: string[], date: Date): void;
	(e: "close"): void;
}>();

const selectedPlatforms = ref<string[]>([]);
const scheduledDate = ref("");
const scheduledTime = ref("");
const caption = ref("");
const hashtags = ref<string[]>([]);

const platforms = [
	{
		id: "instagram",
		name: "Instagram",
		icon: "i-mdi-instagram",
		color: "#E4405F",
	},
	{
		id: "facebook",
		name: "Facebook",
		icon: "i-mdi-facebook",
		color: "#1877F2",
	},
	{ id: "twitter", name: "Twitter/X", icon: "i-mdi-twitter", color: "#1DA1F2" },
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: "i-mdi-linkedin",
		color: "#0A66C2",
	},
	{
		id: "pinterest",
		name: "Pinterest",
		icon: "i-mdi-pinterest",
		color: "#BD081C",
	},
];

const suggestedHashtags = [
	"#marketing",
	"#design",
	"#branding",
	"#socialmedia",
	"#content",
];

const togglePlatform = (id: string) => {
	if (selectedPlatforms.value.includes(id)) {
		selectedPlatforms.value = selectedPlatforms.value.filter(p => p !== id);
	} else {
		selectedPlatforms.value.push(id);
	}
};

const addHashtag = (tag: string) => {
	if (!hashtags.value.includes(tag)) {
		hashtags.value.push(tag);
	}
};

const handleSchedule = () => {
	const date = new Date(`${scheduledDate.value}T${scheduledTime.value}`);
	emit("schedule", "template-id", selectedPlatforms.value, date);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Schedule Post
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6 space-y-6">
					<!-- Platforms -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
						>Select Platforms</label>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="platform in platforms"
								:key="platform.id"
								class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
								:class="selectedPlatforms.includes(platform.id)
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700'"
								@click="togglePlatform(platform.id)"
							>
								<i :class="platform.icon" :style="{ color: platform.color }" />
								<span class="text-sm">{{ platform.name }}</span>
							</button>
						</div>
					</div>

					<!-- Date & Time -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>Date</label>
							<input
								v-model="scheduledDate"
								type="date"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
							/>
						</div>
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>Time</label>
							<input
								v-model="scheduledTime"
								type="time"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
							/>
						</div>
					</div>

					<!-- Caption -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Caption</label>
						<textarea
							v-model="caption"
							rows="3"
							placeholder="Write your post caption..."
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none"
						/>
						<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{{ caption.length }}/2200 characters
						</div>
					</div>

					<!-- Hashtags -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Hashtags</label>
						<div class="flex flex-wrap gap-2 mb-2">
							<span
								v-for="tag in hashtags"
								:key="tag"
								class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1"
							>
								{{ tag }}
								<button @click="hashtags = hashtags.filter(t => t !== tag)">
									<i class="i-mdi-close text-xs" />
								</button>
							</span>
						</div>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="tag in suggestedHashtags"
								:key="tag"
								class="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
								@click="addHashtag(tag)"
							>
								+ {{ tag }}
							</button>
						</div>
					</div>

					<!-- Preview -->
					<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="flex items-center gap-3 mb-3">
							<div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg" />
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									Template Preview
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">
									Will be posted to {{ selectedPlatforms.length }} platforms
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						:disabled="selectedPlatforms.length === 0 || !scheduledDate || !scheduledTime"
						class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
						@click="handleSchedule"
					>
						<i class="i-mdi-calendar-clock mr-2" />
						Schedule Post
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
