<script setup lang="ts">
interface Font {
	id: string;
	name: string;
	family: string;
	formats: string[];
	subset: string[];
	uploadedAt: string;
	size: string;
}

const fonts = ref<Font[]>([
	{
		id: "1",
		name: "CustomBrand-Bold",
		family: "CustomBrand",
		formats: ["woff2", "woff"],
		subset: ["latin", "latin-ext"],
		uploadedAt: "2 days ago",
		size: "124 KB",
	},
	{
		id: "2",
		name: "CustomBrand-Regular",
		family: "CustomBrand",
		formats: ["woff2", "woff", "ttf"],
		subset: ["latin"],
		uploadedAt: "2 days ago",
		size: "98 KB",
	},
]);

const isUploading = ref(false);
const uploadProgress = ref(0);

const handleFontUpload = async (e: Event) => {
	const files = (e.target as HTMLInputElement).files;
	if (!files) return;

	isUploading.value = true;
	uploadProgress.value = 0;

	const interval = setInterval(() => {
		uploadProgress.value += 10;
		if (uploadProgress.value >= 100) {
			clearInterval(interval);
			isUploading.value = false;
		}
	}, 100);
};

const deleteFont = (id: string) => {
	fonts.value = fonts.value.filter(f => f.id !== id);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Custom Fonts
			</h3>
			<span
				class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
			>{{ fonts.length }} fonts</span>
		</div>

		<!-- Upload Area -->
		<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center mb-4">
			<input
				type="file"
				accept=".ttf,.otf,.woff,.woff2"
				multiple
				@change="handleFontUpload"
				class="hidden"
				id="font-upload"
			/>
			<label for="font-upload" class="cursor-pointer">
				<Icon
					name="mdi:font-download"
					class="w-8 h-8 text-gray-400 mx-auto mb-2"
				/>
				<p class="text-sm text-gray-500">Drop font files or click to upload</p>
				<p class="text-xs text-gray-400">Supports TTF, OTF, WOFF, WOFF2</p>
			</label>

			<!-- Progress -->
			<div v-if="isUploading" class="mt-3">
				<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-500 transition-all"
						:style="{ width: `${uploadProgress}%` }"
					/>
				</div>
				<p class="text-xs text-gray-500 mt-1">{{ uploadProgress }}%</p>
			</div>
		</div>

		<!-- Font List -->
		<div class="space-y-3">
			<div
				v-for="font in fonts"
				:key="font.id"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
							<span class="text-lg font-bold text-blue-600">{{
								font.name[0]
							}}</span>
						</div>
						<div>
							<p class="font-medium text-sm">{{ font.name }}</p>
							<p class="text-xs text-gray-500">
								{{ font.family }} • {{ font.size }}
							</p>
						</div>
					</div>
					<button
						@click="deleteFont(font.id)"
						class="p-1.5 text-red-500 hover:bg-red-50 rounded"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
				<div class="flex gap-1 mt-2">
					<span
						v-for="fmt in font.formats"
						:key="fmt"
						class="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs"
					>{{ fmt }}</span>
					<span
						v-for="sub in font.subset"
						:key="sub"
						class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
					>{{ sub }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
