<script setup lang="ts">
const { audioBuffer, exportAudio } = useAudioEditor();

const exportFormat = ref<'wav' | 'mp3'>('wav');
const isExporting = ref(false);

const handleExport = async () => {
	if (!audioBuffer.value) return;

	isExporting.value = true;

	try {
		const blob = await exportAudio(exportFormat.value);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `audio-export.${exportFormat.value}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Export failed:', error);
		alert('Export failed. Please try again.');
	} finally {
		isExporting.value = false;
	}
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-gray-400 text-sm font-medium">Export</span>
				select
					v-model="exportFormat"
					class="bg-gray-800 text-white text-sm rounded px-3 py-1.5 border border-gray-700 focus:border-blue-500 focus:outline-none"
				>
					<option value="wav">WAV</option>
					<option value="mp3">MP3</option>
				</select>
			</div>

			<div class="flex items-center gap-2">
				<button
					:disabled="!audioBuffer || isExporting"
					@click="handleExport"
					:class="[
						'flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium',
						!audioBuffer || isExporting
							? 'bg-gray-700 text-gray-500 cursor-not-allowed'
							: 'bg-green-600 hover:bg-green-700 text-white'
					]"
				>
					<svg v-if="isExporting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
					{{ isExporting ? 'Exporting...' : 'Export Audio' }}
				</button>
			</div>
		</div>
	</div>
</template>
