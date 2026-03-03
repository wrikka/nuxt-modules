<script setup lang="ts">
import AudioEditor from "~/components/audio-editor/AudioEditor.vue";
import EditorHeader from "~/components/audio-editor/EditorHeader.vue";

useHead({
	title: "Audio Editor - Media Studio",
});
</script>

<template>
	<div class="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
		<EditorHeader />
		<div class="flex-1 flex overflow-hidden">
			<AudioEditor />
		</div>
	</div>
</template>
