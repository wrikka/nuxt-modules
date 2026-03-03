<script setup lang="ts">
interface FigmaFile {
	id: string;
	name: string;
	thumbnail: string;
	lastModified: string;
	pages: number;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	import: [fileId: string, pageId: string];
}>();

const step = ref<"auth" | "files" | "importing">("auth");
const figmaToken = ref("");
const selectedFile = ref<string | null>(null);
const selectedPage = ref<string>("");

const files = ref<FigmaFile[]>([
	{
		id: "f1",
		name: "Mobile App Design",
		thumbnail: "",
		lastModified: "2 days ago",
		pages: 12,
	},
	{
		id: "f2",
		name: "Website Redesign",
		thumbnail: "",
		lastModified: "1 week ago",
		pages: 8,
	},
	{
		id: "f3",
		name: "Brand Guidelines",
		thumbnail: "",
		lastModified: "2 weeks ago",
		pages: 24,
	},
	{
		id: "f4",
		name: "Dashboard UI",
		thumbnail: "",
		lastModified: "3 days ago",
		pages: 6,
	},
]);

const pages = ref([
	{ id: "p1", name: "Home Screen" },
	{ id: "p2", name: "Profile" },
	{ id: "p3", name: "Settings" },
	{ id: "p4", name: "Login" },
]);

const connectFigma = () => {
	if (!figmaToken.value.trim()) return;
	step.value = "files";
};

const startImport = () => {
	if (!selectedFile.value || !selectedPage.value) return;
	step.value = "importing";

	// Simulate import
	setTimeout(() => {
		emit("import", selectedFile.value!, selectedPage.value);
		emit("close");
	}, 3000);
};

const importProgress = ref(0);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:vector-combine" class="w-7 h-7 text-purple-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Import from Figma
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<div class="p-6">
				<!-- Step 1: Authentication -->
				<div v-if="step === 'auth'" class="space-y-4">
					<div class="text-center mb-6">
						<div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Icon name="mdi:vector-combine" class="w-8 h-8 text-purple-500" />
						</div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white">
							Connect to Figma
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
							Enter your Figma personal access token to import files
						</p>
					</div>

					<div>
						<label class="block text-sm text-gray-700 dark:text-gray-300 mb-2"
						>Personal Access Token</label>
						<input
							v-model="figmaToken"
							type="password"
							placeholder="figd_xxxxx..."
							class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm"
						>
						<p class="text-xs text-gray-500 mt-2">
							💡 You can generate a token in Figma Settings → Personal Access
							Tokens
						</p>
					</div>

					<button
						class="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
						:disabled="!figmaToken.trim()"
						@click="connectFigma"
					>
						Connect to Figma
					</button>
				</div>

				<!-- Step 2: Select File -->
				<div v-if="step === 'files'" class="space-y-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white">
							Select a File
						</h3>
						<button
							class="text-sm text-purple-500 hover:text-purple-600"
							@click="step = 'auth'"
						>
							Change Token
						</button>
					</div>

					<!-- Files List -->
					<div class="space-y-2 mb-6">
						<div
							v-for="file in files"
							:key="file.id"
							:class="[
								'p-4 border rounded-xl cursor-pointer transition-all',
								selectedFile === file.id
									? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
									: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
							]"
							@click="selectedFile = file.id"
						>
							<div class="flex items-center gap-4">
								<div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
									<Icon
										name="mdi:file-document"
										class="w-6 h-6 text-gray-400"
									/>
								</div>
								<div class="flex-1">
									<h4 class="font-medium text-gray-900 dark:text-white">
										{{ file.name }}
									</h4>
									<p class="text-sm text-gray-500">
										{{ file.pages }} pages • Modified {{ file.lastModified }}
									</p>
								</div>
								<span v-if="selectedFile === file.id">
									<Icon
										name="mdi:check-circle"
										class="w-6 h-6 text-purple-500"
									/>
								</span>
							</div>
						</div>
					</div>

					<!-- Select Page -->
					<div v-if="selectedFile">
						<label class="block text-sm text-gray-700 dark:text-gray-300 mb-2"
						>Select Page to Import</label>
						<select
							v-model="selectedPage"
							class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm"
						>
							<option value="">Choose a page...</option>
							<option v-for="page in pages" :key="page.id" :value="page.id">
								{{ page.name }}
							</option>
						</select>
					</div>

					<button
						class="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
						:disabled="!selectedFile || !selectedPage"
						@click="startImport"
					>
						Import Selected Page
					</button>
				</div>

				<!-- Step 3: Importing -->
				<div v-if="step === 'importing'" class="text-center py-12">
					<div class="relative w-20 h-20 mx-auto mb-6">
						<div class="absolute inset-0 border-4 border-purple-100 dark:border-purple-900/30 rounded-full" />
						<div class="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin" />
						<span
							class="absolute inset-0 flex items-center justify-center text-purple-500 font-bold"
						>
							{{ importProgress }}%
						</span>
					</div>
					<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
						Importing...
					</h3>
					<p class="text-sm text-gray-500">This may take a few moments</p>
				</div>
			</div>
		</div>
	</div>
</template>
