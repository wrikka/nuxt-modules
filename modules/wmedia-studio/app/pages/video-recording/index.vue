<script setup lang="ts">
useHead({
	title: "Video Recording - Media Studio",
});
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
		<div class="container mx-auto px-4 py-8">
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
					Video Recording
				</h1>
				<p class="text-gray-600 dark:text-gray-300">
					Record your screen, camera, or both with ease
				</p>
			</div>

			<VideoRecorder />
		</div>
	</div>
</template>
