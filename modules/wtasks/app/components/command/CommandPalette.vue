<script setup lang="ts">
import { useCommandPalette } from "../../composables/useCommandPalette"

const { isOpen, searchQuery, groupedCommands, selectedIndex, close, executeSelected } = useCommandPalette()

const paletteRef = ref<HTMLElement>()

function getTotalIndex(sectionIndex: number, itemIndex: number): number {
	let count = 0
	for (let i = 0; i < sectionIndex; i++) {
		count += groupedCommands.value[i][1].length
	}
	return count + itemIndex
}
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50"
		@click.self="close"
	>
		<div
			ref="paletteRef"
			class="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
		>
			<div class="flex items-center gap-3 px-4 py-3 border-b">
				<span class="i-lucide-search text-gray-400" />
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Type a command or search..."
					class="flex-1 outline-none text-lg"
					autofocus
				>
				<span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC to close</span>
			</div>

			<div class="max-h-96 overflow-y-auto py-2">
				<div v-for="[section, items] in groupedCommands" :key="section" class="mb-2">
					<div class="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
						{{ section }}
					</div>

					<button
						v-for="(cmd, idx) in items"
						:key="cmd.id"
						class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
						:class="{ 'bg-blue-50': getTotalIndex(groupedCommands.findIndex(g => g[0] === section), idx) === selectedIndex }"
						@click="executeSelected"
					>
						<span v-if="cmd.icon" :class="[cmd.icon, 'text-gray-500']" />
						<div class="flex-1 text-left">
							<div class="font-medium">{{ cmd.label }}</div>
							<div v-if="cmd.description" class="text-sm text-gray-500">{{ cmd.description }}</div>
						</div>
						<span v-if="cmd.shortcut" class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
							{{ cmd.shortcut }}
						</span>
					</button>
				</div>

				<div v-if="groupedCommands.length === 0" class="px-4 py-8 text-center text-gray-500">
					No commands found
				</div>
			</div>
		</div>
	</div>
</template>
