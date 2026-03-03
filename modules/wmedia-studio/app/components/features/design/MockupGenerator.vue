<script setup lang="ts">
const mockups = ref([
	{ id: "1", name: "iPhone 15", category: "Devices", thumbnail: "" },
	{ id: "2", name: "MacBook Pro", category: "Devices", thumbnail: "" },
	{ id: "3", name: "T-Shirt", category: "Apparel", thumbnail: "" },
	{ id: "4", name: "Coffee Mug", category: "Products", thumbnail: "" },
	{ id: "5", name: "Tote Bag", category: "Products", thumbnail: "" },
	{ id: "6", name: "Billboard", category: "Outdoor", thumbnail: "" },
]);

const selectedMockup = ref<string | null>(null);
const uploadedDesign = ref<string | null>(null);
const isGenerating = ref(false);

const categories = ["All", "Devices", "Apparel", "Products", "Outdoor"];
const activeCategory = ref("All");

const filteredMockups = computed(() => {
	if (activeCategory.value === "All") return mockups.value;
	return mockups.value.filter(m => m.category === activeCategory.value);
});

const handleUpload = (e: Event) => {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (file) uploadedDesign.value = URL.createObjectURL(file);
};

const generateMockup = async () => {
	isGenerating.value = true;
	await new Promise(r => setTimeout(r, 2000));
	isGenerating.value = false;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Mockup Generator
			</h3>
			<span
				class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
			>3D Preview</span>
		</div>

		<!-- Upload Design -->
		<div
			v-if="!uploadedDesign"
			class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
		>
			<input
				type="file"
				accept="image/*"
				@change="handleUpload"
				class="hidden"
				id="mockup-upload"
			/>
			<label for="mockup-upload" class="cursor-pointer">
				<Icon
					name="mdi:image-plus"
					class="w-10 h-10 text-gray-400 mx-auto mb-2"
				/>
				<p class="text-sm text-gray-500">Upload your design</p>
			</label>
		</div>
		<div v-else class="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
			<img :src="uploadedDesign" class="w-16 h-16 object-cover rounded" />
			<div class="flex-1">
				<p class="text-sm font-medium">Design uploaded</p>
				<button @click="uploadedDesign = null" class="text-xs text-red-500">
					Remove
				</button>
			</div>
		</div>

		<!-- Category Filter -->
		<div class="flex gap-2 mb-3 overflow-x-auto">
			<button
				v-for="cat in categories"
				:key="cat"
				@click="activeCategory = cat"
				:class="{ 'bg-blue-500 text-white': activeCategory === cat }"
				class="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700"
			>
				{{ cat }}
			</button>
		</div>

		<!-- Mockup Grid -->
		<div class="grid grid-cols-3 gap-2 mb-4">
			<button
				v-for="mockup in filteredMockups"
				:key="mockup.id"
				@click="selectedMockup = mockup.id"
				:class="{ 'ring-2 ring-blue-500': selectedMockup === mockup.id }"
				class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2 hover:bg-gray-200 transition-colors"
			>
				<Icon name="mdi:cube" class="w-8 h-8 text-gray-400 mb-1" />
				<span class="text-xs text-center">{{ mockup.name }}</span>
			</button>
		</div>

		<!-- Generate Button -->
		<button
			@click="generateMockup"
			:disabled="!selectedMockup || !uploadedDesign || isGenerating"
			class="w-full py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin"
			/>
			<span>{{ isGenerating ? "Generating..." : "Generate Mockup" }}</span>
		</button>
	</div>
</template>
