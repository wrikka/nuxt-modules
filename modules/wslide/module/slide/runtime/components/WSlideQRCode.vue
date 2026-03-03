<script setup lang="ts">
const props = defineProps<{
	url: string;
}>();

const emit = defineEmits<{
	close: [];
}>();

// Simple QR code generation using API
const qrCodeUrl = computed(() => {
	// Using qrserver API for demo
	return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.url)}`;
});

function copyUrl() {
	navigator.clipboard.writeText(props.url);
}
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
			@click.self="emit('close')"
		>
			<div class="bg-gray-900 rounded-xl p-6 max-w-sm w-full">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-white">Scan to Follow</h2>
					<button
						class="p-2 text-gray-400 hover:text-white"
						@click="emit('close')"
					>
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
					<img :src="qrCodeUrl" alt="QR Code" class="w-48 h-48" />
				</div>

				<div class="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
					<input
						:value="url"
						readonly
						class="flex-1 bg-transparent text-sm text-gray-300 outline-none"
					/>
					<button
						class="p-2 text-gray-400 hover:text-white transition-colors"
						@click="copyUrl"
					>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
