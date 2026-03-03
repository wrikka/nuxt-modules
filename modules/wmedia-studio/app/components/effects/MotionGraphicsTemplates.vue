<script setup lang="ts">
const emit = defineEmits<
	{ close: []; apply: [template: string, text: string] }
>();
const selectedTemplate = ref("lower-third");
const customText = ref("Your Text Here");
const animation = ref("fade");
const duration = ref(3);

const templates = [
	{ id: "lower-third", name: "Lower Third", icon: "i-ph-text-t" },
	{ id: "title", name: "Title Card", icon: "i-ph-type-h" },
	{ id: "subscribe", name: "Subscribe Button", icon: "i-ph-bell" },
	{ id: "social", name: "Social Media", icon: "i-ph-share-network" },
	{ id: "logo", name: "Logo Reveal", icon: "i-ph-aperture" },
	{ id: "counter", name: "Number Counter", icon: "iph-number" },
];

const animations = ["fade", "slide", "bounce", "zoom", "typewriter"];

const apply = () => emit("apply", selectedTemplate.value, customText.value);
</script>
<template>
	<div class="motion-graphics-templates bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="iph-magic-wand" class="w-5 h-5" />Motion Graphics
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
			<div class="text-center">
				<div class="px-6 py-3 bg-purple-600 rounded-lg text-white text-xl font-bold animate-pulse">
					{{ customText }}
				</div>
			</div>
		</div>
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Template</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="t in templates"
					:key="t.id"
					class="p-3 rounded-lg text-center"
					:class="selectedTemplate === t.id
					? 'bg-purple-600/30 ring-1 ring-purple-500'
					: 'bg-gray-700/50'"
					@click="selectedTemplate = t.id"
				>
					<Icon :name="t.icon" class="w-5 h-5 mx-auto mb-1 text-gray-400" />
					<div class="text-white text-xs">{{ t.name }}</div>
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-1 block">Text Content</label>
			<input
				v-model="customText"
				type="text"
				class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
			/>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label class="text-gray-400 text-xs mb-1 block">Animation</label>
				<select
					v-model="animation"
					class="w-full bg-gray-700 text-white px-2 py-2 rounded-lg text-sm"
				>
					<option v-for="a in animations" :key="a" :value="a">{{ a }}</option>
				</select>
			</div>
			<div>
				<label class="text-gray-400 text-xs mb-1 block">Duration (s)</label>
				<input
					v-model="duration"
					type="number"
					min="1"
					max="10"
					class="w-full bg-gray-700 text-white px-2 py-2 rounded-lg text-sm"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium"
			@click="apply"
		>
			Add to Timeline
		</button>
	</div>
</template>
