<script setup lang="ts">
const videoRef = ref<HTMLVideoElement | null>(null);
const isEnabled = ref(false);
const position = ref<"bottom-left" | "bottom-right" | "top-left" | "top-right">("bottom-right");

const positionClasses = computed(() => ({
	"bottom-right": "bottom-20 right-4",
	"bottom-left": "bottom-20 left-4",
	"top-right": "top-20 right-4",
	"top-left": "top-20 left-4",
})[position.value]);

async function startCamera() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		if (videoRef.value) {
			videoRef.value.srcObject = stream;
		}
		isEnabled.value = true;
	} catch (err) {
		console.error("Failed to access camera:", err);
	}
}

function stopCamera() {
	if (videoRef.value?.srcObject) {
		const stream = videoRef.value.srcObject as MediaStream;
		stream.getTracks().forEach(track => track.stop());
		videoRef.value.srcObject = null;
	}
	isEnabled.value = false;
}

function toggle() {
	if (isEnabled.value) {
		stopCamera();
	} else {
		startCamera();
	}
}

defineExpose({
	toggle,
	startCamera,
	stopCamera,
});
</script>

<template>
	<div
		v-if="isEnabled"
		:class="`fixed ${positionClasses} z-40 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white/50 bg-gray-900`"
	>
		<video
			ref="videoRef"
			autoplay
			playsinline
			muted
			class="w-full h-full object-cover transform scale-x-[-1]"
		/>
		<button
			class="absolute top-2 right-2 p-1 bg-black/50 rounded text-white hover:bg-black/70 transition-colors"
			@click="stopCamera"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	</div>
</template>
