<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	generate: [content: string, type: string];
}>();

const activeTab = ref<"text" | "image" | "data">("text");
const prompt = ref("");
const isGenerating = ref(false);

const presets = {
	text: [
		{
			id: "lorem",
			name: "Lorem Ipsum",
			description: "Standard placeholder text",
		},
		{
			id: "heading",
			name: "Sample Heading",
			description: "Catchy headline text",
		},
		{
			id: "cta",
			name: "Call to Action",
			description: "Action-oriented button text",
		},
		{ id: "bio", name: "Short Bio", description: "Professional biography" },
	],
	image: [
		{
			id: "avatar",
			name: "Avatar Placeholder",
			description: "User profile image",
		},
		{ id: "hero", name: "Hero Background", description: "Large hero image" },
		{ id: "icon", name: "App Icon", description: "Square app icon" },
		{ id: "card", name: "Card Image", description: "Card thumbnail" },
	],
	data: [
		{ id: "names", name: "Random Names", description: "Sample user names" },
		{ id: "dates", name: "Sample Dates", description: "Recent dates" },
		{ id: "prices", name: "Price List", description: "Product prices" },
		{ id: "addresses", name: "Addresses", description: "Sample addresses" },
	],
};

const generatedContent = ref<string[]>([]);

const generate = async (presetId: string) => {
	isGenerating.value = true;

	// Simulate generation
	await new Promise(resolve => setTimeout(resolve, 1000));

	const contents: Record<string, string[]> = {
		lorem: [
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		],
		heading: [
			"Transform Your Ideas Into Reality",
			"Build Something Amazing Today",
			"Create Without Limits",
		],
		cta: ["Get Started Now", "Learn More", "Sign Up Free", "Download Now"],
		bio: [
			"Creative designer with 10+ years of experience in digital products and brand identity.",
		],
		names: ["Sarah Johnson", "Michael Chen", "Emma Williams", "David Park"],
		dates: ["Jan 15, 2026", "Feb 3, 2026", "Mar 21, 2026"],
		prices: ["$29.99", "$49.99", "$99.00", "$199.00"],
		addresses: [
			"123 Main St, New York, NY 10001",
			"456 Oak Ave, Los Angeles, CA 90001",
		],
	};

	generatedContent.value = contents[presetId] || ["Generated content"];
	isGenerating.value = false;
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:magic-staff" class="w-6 h-6 text-purple-500" />
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">
						Content Generator
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<!-- Tabs -->
			<div class="flex border-b border-gray-200 dark:border-gray-700">
				<button
					v-for='tab in ["text", "image", "data"] as const'
					:key="tab"
					:class="[
						'flex-1 py-3 text-sm font-medium transition-colors capitalize',
						activeTab === tab
							? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-gray-500 dark:text-gray-400 hover:text-gray-700',
					]"
					@click="activeTab = tab"
				>
					{{ tab }}
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-6">
				<!-- Presets -->
				<div class="grid grid-cols-2 gap-3 mb-6">
					<button
						v-for="preset in presets[activeTab]"
						:key="preset.id"
						class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
						@click="generate(preset.id)"
					>
						<p class="font-medium text-gray-900 dark:text-white text-sm">
							{{ preset.name }}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{{ preset.description }}
						</p>
					</button>
				</div>

				<!-- Custom Prompt -->
				<div class="space-y-3">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Custom Prompt</label>
					<div class="flex gap-2">
						<input
							v-model="prompt"
							type="text"
							placeholder="Describe what you want to generate..."
							class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
						>
						<button
							class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
							:disabled="isGenerating || !prompt"
							@click="generate('custom')"
						>
							<Icon
								v-if="isGenerating"
								name="mdi:loading"
								class="w-4 h-4 animate-spin"
							/>
							<Icon v-else name="mdi:sparkles" class="w-4 h-4" />
						</button>
					</div>
				</div>

				<!-- Generated Results -->
				<div v-if="generatedContent.length > 0" class="mt-6 space-y-2">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Generated Content
					</h3>
					<div class="space-y-2">
						<div
							v-for="(content, i) in generatedContent"
							:key="i"
							class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
							@click="emit('generate', content, activeTab)"
						>
							<p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
								{{ content }}
							</p>
							<button class="opacity-0 group-hover:opacity-100 p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
								<Icon name="mdi:content-copy" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
