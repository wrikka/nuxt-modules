<script setup lang="ts">
import { useFigmaIntegration } from "../../composables/useFigmaIntegration"

const props = defineProps<{
	taskId: string
}>()

const { linkedFiles, linkFigmaFile, unlinkFigmaFile, fetchFileFrames, linkFrameToTask, extractFileId, getEmbedUrl } = useFigmaIntegration()

const showAddModal = ref(false)
const figmaUrl = ref("")
const figmaToken = ref("")
const selectedFile = ref<string | null>(null)
const frames = ref<Array<{ id: string, name: string, thumbnailUrl: string }>>([])

async function addFigmaFile() {
	if (!figmaUrl.value || !figmaToken.value) return
	await linkFigmaFile(figmaUrl.value, figmaToken.value)
	showAddModal.value = false
	figmaUrl.value = ""
	figmaToken.value = ""
}

async function loadFrames(fileId: string) {
	selectedFile.value = fileId
	frames.value = await fetchFileFrames(fileId)
}

async function selectFrame(frameId: string) {
	if (selectedFile.value) {
		await linkFrameToTask(props.taskId, frameId, selectedFile.value)
	}
}
</script>

<template>
	<div class="figma-integration-panel">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold">
				<span class="i-simple-icons-figma mr-2" />
				Figma
			</h3>
			<button
				class="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
				@click="showAddModal = true"
			>
				Link File
			</button>
		</div>

		<div v-if="linkedFiles.length === 0" class="text-gray-500 text-center py-8">
			No Figma files linked
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="file in linkedFiles"
				:key="file.id"
				class="border rounded-lg overflow-hidden"
			>
				<div class="flex items-center justify-between p-3 bg-gray-50 border-b">
					<div class="flex items-center gap-2">
						<span class="i-simple-icons-figma text-purple-500" />
						<span class="font-medium truncate">{{ file.name }}</span>
					</div>
					<div class="flex items-center gap-1">
						<button
							class="p-1 text-gray-500 hover:text-blue-500"
							@click="loadFrames(file.id)"
							title="View frames"
						>
							<span class="i-lucide-layout-grid" />
						</button>
						<a
							:href="file.url"
							target="_blank"
							class="p-1 text-gray-500 hover:text-blue-500"
							title="Open in Figma"
						>
							<span class="i-lucide-external-link" />
						</a>
						<button
							class="p-1 text-gray-500 hover:text-red-500"
							@click="unlinkFigmaFile(file.id)"
							title="Unlink file"
						>
							<span class="i-lucide-unlink" />
						</button>
					</div>
				</div>

				<!-- Frame Preview -->
				<div v-if="selectedFile === file.id && frames.length > 0" class="p-3">
					<p class="text-sm font-medium mb-2">Select a frame:</p>
					<div class="grid grid-cols-2 gap-2">
						<button
							v-for="frame in frames"
							:key="frame.id"
							class="p-2 text-left border rounded hover:bg-gray-50"
							@click="selectFrame(frame.id)"
						>
							<img
								v-if="frame.thumbnailUrl"
								:src="frame.thumbnailUrl"
								:alt="frame.name"
								class="w-full h-24 object-cover rounded mb-1"
							>
							<p class="text-xs truncate">{{ frame.name }}</p>
						</button>
					</div>
				</div>

				<!-- Embedded Preview -->
				<div v-if="file.thumbnailUrl" class="p-3">
					<iframe
						:src="getEmbedUrl(file.id)"
						class="w-full h-64 border-0 rounded"
						allowfullscreen
					/>
				</div>
			</div>
		</div>

		<!-- Add Figma File Modal -->
		<div
			v-if="showAddModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			@click.self="showAddModal = false"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-lg font-semibold mb-4">Link Figma File</h3>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1">Figma URL</label>
						<input
							v-model="figmaUrl"
							type="url"
							class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="https://www.figma.com/file/..."
						>
						<p class="text-xs text-gray-500 mt-1">
							Paste the Figma file URL
						</p>
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Figma Access Token</label>
						<input
							v-model="figmaToken"
							type="password"
							class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="figd_..."
						>
						<p class="text-xs text-gray-500 mt-1">
							Get your token from Figma Settings → Personal Access Tokens
						</p>
					</div>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
						@click="showAddModal = false"
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
						:disabled="!figmaUrl || !figmaToken"
						@click="addFigmaFile"
					>
						Link File
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
