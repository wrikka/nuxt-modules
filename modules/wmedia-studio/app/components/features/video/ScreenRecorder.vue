<script setup lang="ts">
const isRecording = ref(false);
const duration = ref(0);
const quality = ref("1080p");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Screen Recorder</h4>
		<div class="flex items-center gap-2 mb-2">
			<button
				:class="[
					'p-2 rounded-full',
					isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200',
				]"
				@click="isRecording = !isRecording"
			>
				<div class="w-3 h-3 bg-white rounded-sm" />
			</button>
			<span class="text-sm">{{
				isRecording ? "Recording..." : "Click to record"
			}}</span>
		</div>
		<select v-model="quality" class="w-full p-1 border rounded text-xs">
			<option>720p</option>
			<option>1080p</option>
			<option>4K</option>
		</select>
	</div>
</template>
