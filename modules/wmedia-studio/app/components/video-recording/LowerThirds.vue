<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const name = defineModel<string>("name", { default: "" });
const title = defineModel<string>("title", { default: "" });
const selectedTemplate = defineModel<string>("template", { default: "modern" });
const position = defineModel<"lower" | "upper" | "sidebar">("position", {
	default: "lower",
});
const animation = defineModel<"slide" | "fade" | "bounce" | "none">(
	"animation",
	{ default: "slide" },
);
const duration = defineModel<number>("duration", { default: 5 });
const showSocial = defineModel<boolean>("showSocial", { default: false });
const socialHandle = defineModel<string>("social", { default: "" });

const templates = [
	{
		id: "modern",
		name: "Modern",
		icon: "mdi:rectangle",
		color: "from-blue-500 to-purple-600",
	},
	{
		id: "minimal",
		name: "Minimal",
		icon: "mdi:minus",
		color: "from-gray-700 to-gray-900",
	},
	{
		id: "gradient",
		name: "Gradient",
		icon: "mdi:gradient",
		color: "from-pink-500 to-orange-400",
	},
	{
		id: "corporate",
		name: "Corporate",
		icon: "mdi:office-building",
		color: "from-blue-600 to-blue-800",
	},
	{
		id: "creative",
		name: "Creative",
		icon: "mdi:palette",
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "news",
		name: "News Style",
		icon: "mdi:newspaper",
		color: "from-red-600 to-red-800",
	},
] as const;

const animationOptions = [
	{ value: "slide", label: "Slide In", icon: "mdi:arrow-right" },
	{ value: "fade", label: "Fade", icon: "mdi:fade" },
	{ value: "bounce", label: "Bounce", icon: "mdi:arrow-up-down" },
	{ value: "none", label: "No Animation", icon: "mdi:minus" },
] as const;
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
					<Icon
						name="mdi:text-box"
						class="w-5 h-5 text-rose-600 dark:text-rose-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Lower Thirds / Titles
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Animated name & title overlays
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-rose-600 mt-0.5" />
					<p class="text-xs text-rose-700 dark:text-rose-300">
						Display professional lower thirds with your name, title, and social
						handles. Trigger with hotkey or show automatically on recording
						start.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Name</label>
					<input
						v-model="name"
						type="text"
						placeholder="John Doe"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Title</label>
					<input
						v-model="title"
						type="text"
						placeholder="Product Designer"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Template Style</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="tpl in templates"
						:key="tpl.id"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							selectedTemplate === tpl.id
								? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-500'
								: 'border-gray-200 dark:border-gray-700 hover:border-rose-300',
						]"
						@click="selectedTemplate = tpl.id"
					>
						<div :class="`w-full h-6 rounded bg-gradient-to-r ${tpl.color} mb-1`" />
						<div
							class="text-xs font-medium"
							:class="selectedTemplate === tpl.id
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>
							{{ tpl.name }}
						</div>
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
					>Position</label>
					<select
						v-model="position"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="lower">Lower Third</option>
						<option value="upper">Upper Third</option>
						<option value="sidebar">Sidebar</option>
					</select>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
					>Animation</label>
					<select
						v-model="animation"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option
							v-for="opt in animationOptions"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }}
						</option>
					</select>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Display Duration</span>
					<span class="text-gray-500">{{ duration }}s</span>
				</div>
				<input
					v-model.number="duration"
					type="range"
					min="1"
					max="60"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-rose-600"
				>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="showSocial"
					type="checkbox"
					class="w-4 h-4 text-rose-600 rounded"
				>
				<div class="flex-1">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Show Social Handle</span>
				</div>
			</div>

			<div v-if="showSocial" class="pl-6">
				<div class="flex gap-2">
					<select class="px-2 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
						<option value="twitter">Twitter/X</option>
						<option value="instagram">Instagram</option>
						<option value="linkedin">LinkedIn</option>
						<option value="youtube">YouTube</option>
						<option value="tiktok">TikTok</option>
					</select>
					<input
						v-model="socialHandle"
						type="text"
						placeholder="@username"
						class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Preview
				</h4>
				<div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:video" class="w-12 h-12 text-gray-700" />
					</div>
					<div
						:class="`absolute ${
							position === 'lower'
								? 'bottom-8 left-8 right-8'
								: position === 'upper'
								? 'top-8 left-8 right-8'
								: 'top-1/2 right-4 -translate-y-1/2'
						} flex`"
					>
						<div
							:class="`px-4 py-2 bg-gradient-to-r ${
								templates.find(t => t.id === selectedTemplate)?.color
								|| 'from-blue-500 to-purple-600'
							} rounded-lg shadow-lg max-w-xs`"
						>
							<div class="text-white font-bold">{{ name || "Your Name" }}</div>
							<div class="text-white/80 text-sm">
								{{ title || "Your Title" }}
							</div>
							<div
								v-if="showSocial && socialHandle"
								class="text-white/60 text-xs mt-1"
							>
								{{ socialHandle }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
					<Icon name="mdi:play" class="w-4 h-4" />
					Preview Animation
				</button>
				<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<Icon name="mdi:content-save" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
