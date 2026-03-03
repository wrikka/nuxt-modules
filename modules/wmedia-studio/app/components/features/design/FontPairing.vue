<script setup lang="ts">
const fonts = ["Inter", "Roboto", "Playfair", "Montserrat", "Open Sans"];
const pairs = ref([
	{ heading: "Playfair", body: "Inter", sample: "Aa" },
	{ heading: "Montserrat", body: "Open Sans", sample: "Aa" },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Font Pairing</h4>
		<div class="space-y-2">
			<div
				v-for="(pair, i) in pairs"
				:key="i"
				class="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
			>
				<div class="flex items-center gap-2">
					<span class="text-2xl">{{ pair.sample }}</span>
					<div class="text-xs">
						<div class="font-medium">{{ pair.heading }}</div>
						<div class="text-gray-500">+ {{ pair.body }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
