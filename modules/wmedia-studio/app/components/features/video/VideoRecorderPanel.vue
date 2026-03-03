<script setup lang="ts">
const isRecording = ref(false);
const duration = ref(0);
const quality = ref("high");
const audioSource = ref("system");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Video Recorder</h4>
		<div class="flex items-center gap-2 mb-2">
			<button
				:class="[
					'p-2 rounded-full',
					isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200',
				]"
				@click="isRecording = !isRecording"
			>
				<div class="w-3 h-3 bg-white rounded-full" />
			</button>
			<span class="text-sm">{{
				isRecording ? "Recording " + duration + "s" : "Click to record"
			}}</span>
		</div>
		<select v-model="quality" class="w-full p-1 border rounded text-xs mb-1">
			<option value="low">720p</option>
			<option value="high">1080p</option>
			<option value="4k">4K</option>
		</select>
		<select v-model="audioSource" class="w-full p-1 border rounded text-xs">
			<option value="system">System Audio</option>
			<option value="mic">Microphone</option>
			<option value="both">Both</option>
		</select>
	</div>
</template>
