<script setup lang="ts">
import { computed } from 'vue'
import { usePalette } from '../composables/usePalette'
import type { Command } from '../../core/types'

interface Props {
	paletteId?: string
	placeholder?: string
	emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
	paletteId: 'default',
	placeholder: 'Search commands...',
	emptyText: 'No commands found'
})

const emit = defineEmits<{
	select: [command: Command]
	execute: [command: Command]
}>()

const palette = usePalette({ id: props.paletteId })

const selectedCommand = computed(() => {
	return palette.results.value[palette.selectedIndex.value]
})

const handleKeydown = (event: KeyboardEvent) => {
	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault()
			palette.selectNext()
			break
		case 'ArrowUp':
			event.preventDefault()
			palette.selectPrev()
			break
		case 'Enter':
			event.preventDefault()
			if (selectedCommand.value) {
				emit('select', selectedCommand.value)
				emit('execute', selectedCommand.value)
				palette.execute(selectedCommand.value.id)
			}
			break
		case 'Escape':
			event.preventDefault()
			palette.close()
			break
	}
}

const selectCommand = (command: Command, index: number) => {
	palette.selectIndex(index)
	emit('select', command)
}

const executeCommand = (command: Command) => {
	emit('execute', command)
	palette.execute(command.id)
}
</script>

<template>
	<div v-if="palette.isOpen.value" class="command-palette-overlay" @click="palette.close">
		<div class="command-palette-modal" @click.stop>
			<div class="command-palette-header">
				<input
					v-model="palette.query.value"
					class="command-palette-input"
					:placeholder="placeholder"
					data-command-palette-input
					@keydown="handleKeydown"
				>
			</div>
			
			<div class="command-palette-body">
				<div v-if="palette.results.value.length === 0" class="command-palette-empty">
					{{ emptyText }}
				</div>
				
				<ul v-else class="command-palette-list">
					<li
						v-for="(command, index) in palette.results.value"
						:key="command.id"
						:class="[
							'command-palette-item',
							{ 'is-selected': index === palette.selectedIndex.value }
						]"
						@click="executeCommand(command)"
						@mouseenter="selectCommand(command, index)"
					>
						<span v-if="command.icon" class="command-palette-icon">{{ command.icon }}</span>
						<span class="command-palette-title">{{ command.title }}</span>
						<span v-if="command.description" class="command-palette-description">
							{{ command.description }}
						</span>
						<span v-if="command.shortcut" class="command-palette-shortcut">
							{{ command.shortcut }}
						</span>
					</li>
				</ul>
			</div>
			
			<div class="command-palette-footer">
				<span>↑↓ Navigate</span>
				<span>↵ Execute</span>
				<span>Esc Close</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.command-palette-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 20vh;
	z-index: 9999;
}

.command-palette-modal {
	background: white;
	border-radius: 8px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	width: 100%;
	max-width: 640px;
	overflow: hidden;
}

.command-palette-header {
	padding: 16px;
	border-bottom: 1px solid #e5e7eb;
}

.command-palette-input {
	width: 100%;
	border: none;
	outline: none;
	font-size: 16px;
	background: transparent;
}

.command-palette-body {
	max-height: 400px;
	overflow-y: auto;
}

.command-palette-empty {
	padding: 32px;
	text-align: center;
	color: #6b7280;
}

.command-palette-list {
	list-style: none;
	margin: 0;
	padding: 8px 0;
}

.command-palette-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	cursor: pointer;
	transition: background 0.15s;
}

.command-palette-item:hover,
.command-palette-item.is-selected {
	background: #f3f4f6;
}

.command-palette-icon {
	font-size: 18px;
}

.command-palette-title {
	flex: 1;
	font-weight: 500;
}

.command-palette-description {
	color: #6b7280;
	font-size: 14px;
}

.command-palette-shortcut {
	font-size: 12px;
	color: #9ca3af;
	background: #f3f4f6;
	padding: 2px 6px;
	border-radius: 4px;
}

.command-palette-footer {
	display: flex;
	gap: 16px;
	padding: 12px 16px;
	border-top: 1px solid #e5e7eb;
	font-size: 12px;
	color: #6b7280;
}
</style>
