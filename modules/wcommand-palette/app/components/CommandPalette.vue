<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { usePalette } from '../composables/usePalette'
import { useCommandChains } from '../composables/useCommandChains'
import { useSearchFilters } from '../composables/useSearchFilters'
import { useSearchHistory } from '../composables/useSearchHistory'
import { useAISuggestions } from '../composables/useAISuggestions'
import { useQuickActions } from '../composables/useQuickActions'
import { useTheme } from '../composables/useTheme'
import { useVoiceCommands } from '../composables/useVoiceCommands'
import { useFloatingMode } from '../composables/useFloatingMode'
import { useBreadcrumbs } from '../composables/useBreadcrumbs'
import { useDebugMode } from '../composables/useDebugMode'
import { useCloudSync } from '../composables/useCloudSync'
import { useUserAvatar } from '../composables/useUserAvatar'
import { useAnimation } from '../composables/useAnimation'
import { useCustomRenderer } from '../composables/useCustomRenderer'
import type { Command, PaletteTab, SuggestionItem, CommandHistoryEntry } from '../types'

interface Props {
	paletteId?: string
	placeholder?: string
	emptyText?: string
	enableTabs?: boolean
	enablePreview?: boolean
	enableVoice?: boolean
	enableFloating?: boolean
	enableDebug?: boolean
	enableCloudSync?: boolean
	enableUserAvatar?: boolean
	animationPreset?: 'default' | 'smooth' | 'bouncy' | 'minimal' | 'instant'
	userId?: string
	userName?: string
	userAvatar?: string
	customItemRenderer?: string
}

const props = withDefaults(defineProps<Props>(), {
	paletteId: 'default',
	placeholder: 'Search commands... (type "?" for help)',
	emptyText: 'No commands found',
	enableTabs: true,
	enablePreview: true,
	enableVoice: true,
	enableFloating: true,
	enableDebug: false,
	enableCloudSync: false,
	enableUserAvatar: true,
	animationPreset: 'default'
})

const emit = defineEmits<{
	select: [command: Command]
	execute: [command: Command]
	close: []
	open: []
}>()

// Core palette
const palette = usePalette({ id: props.paletteId })

// Feature composables
const chains = useCommandChains(props.paletteId)
const filters = useSearchFilters(palette.results)
const history = useSearchHistory()
const ai = useAISuggestions()
const quickActions = useQuickActions()
const theme = useTheme()
const voice = useVoiceCommands(props.paletteId)
const floating = useFloatingMode()
const breadcrumbs = useBreadcrumbs()
const debug = useDebugMode()
const cloudSync = useCloudSync({ paletteId: props.paletteId })
const userAvatar = useUserAvatar({ paletteId: props.paletteId })
const animation = useAnimation({ preset: props.animationPreset, paletteId: props.paletteId })
const customRenderer = useCustomRenderer({ paletteId: props.paletteId })

// Local state
const activeTab = ref<PaletteTab>('all')
const showPreview = ref(false)
const selectedCommand = ref<Command | null>(null)
const showShortcuts = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const suggestions = ref<SuggestionItem[]>([])
const showHistory = ref(false)
const historyEntries = ref<CommandHistoryEntry[]>([])

// Compute display results based on active tab
const displayResults = computed(() => {
	switch (activeTab.value) {
		case 'recent':
			return palette.recent.value
				.map(r => palette.results.value.find(c => c.id === r.id))
				.filter(Boolean) as Command[]
		case 'pinned':
			return palette.results.value.filter(c => quickActions.isPinned(c))
		case 'ai':
			return suggestions.value
				.filter(s => s.type === 'ai' || s.type === 'command')
				.map(s => s.command)
				.filter(Boolean) as Command[]
		default:
			return filters.filteredCommands.value
	}
})

// Selected command tracking
const currentSelectedCommand = computed(() => {
	return displayResults.value[palette.selectedIndex.value] || null
})

watch(currentSelectedCommand, (cmd) => {
	selectedCommand.value = cmd
	if (props.enablePreview && cmd) {
		showPreview.value = true
	}
}, { immediate: true })

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
	// Debug mode toggle
	if (event.key === 'F12' && event.ctrlKey) {
		debug.toggleDebug()
		return
	}

	// Show shortcuts help
	if (event.key === '?' && !event.shiftKey) {
		showShortcuts.value = !showShortcuts.value
		return
	}

	// Tab switching
	if (event.key === 'Tab' && !event.shiftKey) {
		event.preventDefault()
		cycleTab()
		return
	}

	// Theme toggle
	if (event.key === 't' && event.ctrlKey) {
		event.preventDefault()
		theme.cycleTheme()
		return
	}

	// Floating mode toggle
	if (event.key === 'f' && event.ctrlKey && props.enableFloating) {
		event.preventDefault()
		floating.toggleFloating()
		return
	}

	// Voice toggle
	if (event.key === 'v' && event.ctrlKey && props.enableVoice) {
		event.preventDefault()
		voice.toggleListening()
		return
	}

	// Chain mode toggle
	if (event.key === 'c' && event.ctrlKey) {
		event.preventDefault()
		if (chains.isChaining.value) {
			chains.stopChain()
		} else if (currentSelectedCommand.value) {
			chains.startChain([currentSelectedCommand.value.id])
		}
		return
	}

	// Navigation
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
			if (currentSelectedCommand.value) {
				executeCommand(currentSelectedCommand.value)
			}
			break
		case 'Escape':
			event.preventDefault()
			if (showShortcuts.value) {
				showShortcuts.value = false
			} else if (chains.isChaining.value) {
				chains.stopChain()
			} else {
				palette.close()
				emit('close')
			}
			break
		case 'p':
			// Quick pin
			if (currentSelectedCommand.value && !event.ctrlKey && !event.metaKey) {
				event.preventDefault()
				togglePin(currentSelectedCommand.value)
			}
			break
	}
}

const selectCommand = (command: Command, index: number) => {
	palette.selectIndex(index)
	emit('select', command)
}

const executeCommand = async (command: Command) => {
	emit('select', command)

	if (chains.isChaining.value) {
		await chains.executeChained(command)
		emit('execute', command)
	} else {
		await palette.execute(command.id)
		emit('execute', command)
		palette.close()
		emit('close')
	}
}

const cycleTab = () => {
	const tabs: PaletteTab[] = ['all', 'recent', 'pinned', 'ai']
	const currentIndex = tabs.indexOf(activeTab.value)
	const nextIndex = (currentIndex + 1) % tabs.length
	activeTab.value = tabs[nextIndex] ?? 'all'
}

const togglePin = (command: Command) => {
	if (quickActions.isPinned(command)) {
		quickActions.unpinCommand(command)
	} else {
		quickActions.pinCommand(command)
	}
}

const onInputFocus = () => {
	showHistory.value = true
	historyEntries.value = history.getRecent(5)
}

const onInputBlur = () => {
	setTimeout(() => {
		showHistory.value = false
	}, 200)
}

const selectHistoryEntry = (entry: CommandHistoryEntry) => {
	palette.query.value = entry.query
	showHistory.value = false
	inputRef.value?.focus()
}

const clearHistory = () => {
	history.clearHistory()
	historyEntries.value = []
	showHistory.value = false
}

// Filter badges display
const filterBadges = computed(() => {
	const badges: { type: string; label: string }[] = []

	if (filters.filters.value.files?.length) {
		badges.push({ type: 'file', label: `@${filters.filters.value.files[0]}` })
	}
	if (filters.filters.value.tags?.length) {
		badges.push({ type: 'tag', label: `#${filters.filters.value.tags[0]}` })
	}
	if (filters.filters.value.actionType) {
		badges.push({ type: 'action', label: `>${filters.filters.value.actionType}` })
	}
	if (filters.filters.value.group) {
		badges.push({ type: 'group', label: `group:${filters.filters.value.group}` })
	}

	return badges
})

// Watch for palette open to focus input
watch(() => palette.isOpen.value, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			inputRef.value?.focus()
			emit('open')
			debug.recordMetric('openTime', Date.now())
		})
	}
})

// Initialize user from props
watch(() => props.userId, (userId) => {
	if (userId && props.enableUserAvatar) {
		userAvatar.setUser({
			id: userId,
			name: props.userName ?? 'User',
			avatar: props.userAvatar,
			status: 'online'
		})
	}
}, { immediate: true })

// Enable cloud sync when enabled
watch(() => props.enableCloudSync, (enabled) => {
	if (enabled && props.userId) {
		cloudSync.enableSync(props.userId)
	} else {
		cloudSync.disableSync()
	}
}, { immediate: true })

// Sync theme on mount
if (typeof document !== 'undefined') {
	theme.applyTheme()
}
</script>

<template>
	<div
		v-if="palette.isOpen.value"
		:class="[
			'command-palette-container',
			{ 'is-floating': floating.isFloating.value },
			{ 'is-dark': theme.isDark.value },
			animation.animationClass.value
		]"
		:style="floating.isFloating.value ? {
			position: 'fixed',
			left: `${floating.position.value.x}px`,
			top: `${floating.position.value.y}px`,
			zIndex: 10000
		} : {}"
	>
		<!-- Overlay (only in non-floating mode) -->
		<div
			v-if="!floating.isFloating.value"
			class="command-palette-overlay"
			@click="palette.close(); emit('close')"
		/>

		<!-- Modal -->
		<div
			class="command-palette-modal"
			:class="{ 'is-dragging': floating.isDragging.value }"
			@click.stop
		>
			<!-- Drag handle (floating mode) -->
			<div
				v-if="floating.isFloating.value"
				class="drag-handle"
				@mousedown="floating.startDrag"
			>
				<div class="drag-dots" />
			</div>

			<!-- Header -->
			<div class="command-palette-header">
				<!-- User avatar row -->
				<div v-if="props.enableUserAvatar && userAvatar.user.value" class="user-row">
					<div class="user-avatar">
						<img
							v-if="userAvatar.avatarUrl.value"
							:src="userAvatar.avatarUrl.value"
							:alt="userAvatar.user.value?.name"
							class="avatar-img"
						>
						<div
							v-else
							class="avatar-fallback"
							:style="{ background: userAvatar.avatarUrl.value }"
						>
							{{ userAvatar.userInitials.value }}
						</div>
						<span
							v-if="userAvatar.user.value?.status"
							class="status-dot"
							:style="{ backgroundColor: userAvatar.statusIndicator.value }"
						/>
					</div>
					<span class="user-name">{{ userAvatar.user.value?.name }}</span>
					<span
						v-if="cloudSync.isEnabled.value"
						class="sync-status"
						:class="cloudSync.syncStatus.value"
						:title="cloudSync.syncError.value ?? 'Sync enabled'"
					>
						{{ cloudSync.isSyncing.value ? '⏳' : cloudSync.syncStatus.value === 'error' ? '⚠️' : '☁️' }}
					</span>
				</div>

				<!-- Breadcrumbs -->
				<div v-if="breadcrumbs.isNested.value" class="breadcrumbs">
					<span
						v-for="(crumb, index) in breadcrumbs.breadcrumbs.value"
						:key="crumb.id"
						class="breadcrumb-item"
					>
						<span @click="breadcrumbs.goTo(index)">{{ crumb.title }}</span>
						<span v-if="index < breadcrumbs.breadcrumbs.value.length - 1" class="separator">/</span>
					</span>
				</div>

				<!-- Tabs -->
				<div v-if="props.enableTabs" class="tabs">
					<button
						v-for="tab in ['all', 'recent', 'pinned', 'ai']"
						:key="tab"
						:class="['tab', { active: activeTab === tab }]"
						@click="activeTab = tab as PaletteTab"
					>
						{{ tab === 'all' ? 'All' : tab === 'recent' ? 'Recent' : tab === 'pinned' ? 'Pinned' : 'AI' }}
					</button>
				</div>

				<!-- Filter badges -->
				<div v-if="filterBadges.length" class="filter-badges">
					<span
						v-for="badge in filterBadges"
						:key="badge.type"
						:class="['badge', badge.type]"
					>
						{{ badge.label }}
					</span>
					<button class="clear-filters" @click="filters.clearFilters()">
						Clear
					</button>
				</div>

				<!-- Search input -->
				<div class="input-wrapper">
					<span class="search-icon">🔍</span>
					<input
						ref="inputRef"
						v-model="palette.query.value"
						class="command-palette-input"
						:placeholder="placeholder"
						data-command-palette-input
						@keydown="handleKeydown"
						@focus="onInputFocus"
						@blur="onInputBlur"
					>

					<!-- Voice button -->
					<button
						v-if="props.enableVoice && voice.isSupported"
						:class="['voice-btn', { listening: voice.isListening.value }]"
						@click="voice.toggleListening"
						title="Voice search (Ctrl+V)"
					>
						{{ voice.isListening.value ? '🔴' : '🎤' }}
					</button>

					<!-- Chain indicator -->
					<div v-if="chains.isChaining.value" class="chain-indicator">
						Chain mode ({{ chains.chainHistory.value.length }})
					</div>
				</div>

				<!-- Voice transcript -->
				<div v-if="voice.transcript.value" class="voice-transcript">
					"{{ voice.transcript.value }}"
					<span v-if="voice.lastMatch.value?.matchedCommand" class="match">
						→ {{ voice.lastMatch.value.matchedCommand.title }}
					</span>
				</div>
			</div>

			<!-- Search history dropdown -->
			<div v-if="showHistory && historyEntries.length" class="history-dropdown">
				<div class="history-header">
					<span>Recent searches</span>
					<button class="clear-history" @click="clearHistory">Clear</button>
				</div>
				<div
					v-for="entry in historyEntries"
					:key="entry.timestamp"
					class="history-item"
					@click="selectHistoryEntry(entry)"
				>
					<span class="history-icon">🕐</span>
					<span class="history-query">{{ entry.query }}</span>
				</div>
			</div>

			<!-- AI Suggestions -->
			<div v-if="showSuggestions && activeTab !== 'ai'" class="ai-suggestions">
				<div class="suggestions-header">
					<span>🤖 AI Suggestions</span>
				</div>
				<div
					v-for="suggestion in suggestions.slice(0, 3)"
					:key="suggestion.id"
					class="suggestion-item"
					@click="suggestion.command && executeCommand(suggestion.command)"
				>
					<span v-if="suggestion.icon" class="suggestion-icon">{{ suggestion.icon }}</span>
					<div class="suggestion-content">
						<span class="suggestion-title">{{ suggestion.title }}</span>
						<span v-if="suggestion.description" class="suggestion-desc">{{ suggestion.description }}</span>
					</div>
				</div>
			</div>

			<!-- Body -->
			<div class="command-palette-body">
				<!-- Empty state with suggestions -->
				<div v-if="displayResults.length === 0" class="command-palette-empty">
					<div class="empty-icon">🔍</div>
					<p>{{ emptyText }}</p>
					<div class="empty-suggestions">
						<p>Try:</p>
						<ul>
							<li>Type <code>@filename</code> to filter by file</li>
							<li>Type <code>#tag</code> to filter by tag</li>
							<li>Type <code>>action</code> to filter by action</li>
							<li>Press <kbd>?</kbd> for keyboard shortcuts</li>
						</ul>
					</div>
				</div>

				<!-- Results list -->
				<ul v-else class="command-palette-list" role="listbox">
					<li
						v-for="(command, index) in displayResults"
						:key="command.id"
						:class="[
							'command-palette-item',
							{ 'is-selected': index === palette.selectedIndex.value }
						]"
						role="option"
						:aria-selected="index === palette.selectedIndex.value"
						@click="executeCommand(command)"
						@mouseenter="selectCommand(command, index)"
					>
						<span v-if="command.icon" class="command-palette-icon">{{ command.icon }}</span>
						<div class="command-palette-content">
							<div class="command-palette-main">
								<span class="command-palette-title">{{ command.title }}</span>
								<span v-if="command.description" class="command-palette-description">
									{{ command.description }}
								</span>
							</div>
							<div class="command-palette-meta">
								<!-- Pin indicator -->
								<span v-if="quickActions.isPinned(command)" class="pin-indicator">📌</span>
								<!-- Chain indicator -->
								<span v-if="command.chainable" class="chainable-indicator">🔗</span>
								<!-- Shortcut -->
								<span v-if="command.shortcut" class="command-palette-shortcut">
									{{ command.shortcut }}
								</span>
							</div>
						</div>
					</li>
				</ul>

				<!-- Preview pane -->
				<div v-if="props.enablePreview && showPreview && selectedCommand" class="preview-pane">
					<div class="preview-header">
						<h4>{{ selectedCommand.title }}</h4>
						<button class="close-preview" @click="showPreview = false">×</button>
					</div>
					<div class="preview-content">
						<div v-if="selectedCommand.preview?.type === 'markdown'" class="preview-markdown">
							{{ selectedCommand.preview.data }}
						</div>
						<div v-else-if="selectedCommand.preview?.type === 'json'" class="preview-json">
							<pre>{{ JSON.stringify(selectedCommand.preview.data, null, 2) }}</pre>
						</div>
						<div v-else class="preview-default">
							<p>{{ selectedCommand.description || 'No preview available' }}</p>
							<div v-if="selectedCommand.args?.length" class="preview-args">
								<h5>Arguments:</h5>
								<ul>
									<li v-for="arg in selectedCommand.args" :key="arg.name">
										<code>{{ arg.name }}</code>
										({{ arg.type }}{{ arg.required ? ', required' : '' }})
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="command-palette-footer">
				<div class="footer-left">
					<span class="key-hint"><kbd>↑↓</kbd> Navigate</span>
					<span class="key-hint"><kbd>↵</kbd> Execute</span>
					<span class="key-hint"><kbd>Esc</kbd> Close</span>
					<span v-if="chains.isChaining.value" class="key-hint chain-hint">
						<kbd>Ctrl+C</kbd> Stop Chain
					</span>
				</div>
				<div class="footer-right">
					<!-- Quick actions -->
					<button
						v-if="selectedCommand"
						class="action-btn"
						:title="quickActions.isPinned(selectedCommand) ? 'Unpin' : 'Pin'"
						@click.stop="togglePin(selectedCommand)"
					>
						{{ quickActions.isPinned(selectedCommand) ? '📌' : '📍' }}
					</button>
					<button
						class="action-btn"
						title="Theme (Ctrl+T)"
						@click.stop="theme.cycleTheme()"
					>
						{{ theme.isDark.value ? '🌙' : '☀️' }}
					</button>
					<button
						v-if="props.enableFloating"
						class="action-btn"
						title="Floating mode (Ctrl+F)"
						@click.stop="floating.toggleFloating()"
					>
						{{ floating.isFloating.value ? '📌' : '🪟' }}
					</button>
					<button
						class="action-btn"
						title="Help (?)"
						@click.stop="showShortcuts = true"
					>
						❓
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Keyboard shortcuts overlay -->
	<div v-if="showShortcuts" class="shortcuts-overlay" @click="showShortcuts = false">
		<div class="shortcuts-modal" @click.stop>
			<h3>Keyboard Shortcuts</h3>
			<div class="shortcuts-grid">
				<div class="shortcut-item">
					<kbd>↑</kbd> <kbd>↓</kbd>
					<span>Navigate commands</span>
				</div>
				<div class="shortcut-item">
					<kbd>↵</kbd>
					<span>Execute command</span>
				</div>
				<div class="shortcut-item">
					<kbd>Esc</kbd>
					<span>Close palette / Stop chain</span>
				</div>
				<div class="shortcut-item">
					<kbd>Tab</kbd>
					<span>Cycle tabs</span>
				</div>
				<div class="shortcut-item">
					<kbd>P</kbd>
					<span>Pin/unpin command</span>
				</div>
				<div class="shortcut-item">
					<kbd>Ctrl</kbd> + <kbd>C</kbd>
					<span>Toggle chain mode</span>
				</div>
				<div class="shortcut-item">
					<kbd>Ctrl</kbd> + <kbd>T</kbd>
					<span>Toggle theme</span>
				</div>
				<div class="shortcut-item">
					<kbd>Ctrl</kbd> + <kbd>F</kbd>
					<span>Toggle floating mode</span>
				</div>
				<div class="shortcut-item">
					<kbd>Ctrl</kbd> + <kbd>V</kbd>
					<span>Voice search</span>
				</div>
				<div class="shortcut-item">
					<kbd>?</kbd>
					<span>Show this help</span>
				</div>
			</div>
			<button class="close-help" @click="showShortcuts = false">Close (Esc)</button>
		</div>
	</div>

	<!-- Debug panel -->
	<div v-if="debug.isDebug.value" class="debug-panel">
		<h4>Debug</h4>
		<div class="debug-metrics">
			<div>Results: {{ displayResults.length }}</div>
			<div>Query: "{{ palette.query.value }}"</div>
			<div>Tab: {{ activeTab }}</div>
			<div>Theme: {{ theme.theme.value }}</div>
			<div>Floating: {{ floating.isFloating.value }}</div>
			<div>Chaining: {{ chains.isChaining.value }}</div>
			<div>Voice: {{ voice.isListening.value ? 'listening' : 'off' }}</div>
		</div>
		<div v-if="cloudSync.isEnabled.value" class="debug-sync">
			<div>Cloud Sync: {{ cloudSync.isSyncing.value ? 'syncing' : cloudSync.syncStatus.value }}</div>
			<div>Last Sync: {{ cloudSync.lastSync.value ? new Date(cloudSync.lastSync.value).toLocaleTimeString() : 'never' }}</div>
		</div>
		<details>
			<summary>Recent Logs ({{ debug.logs.value.length }})</summary>
			<pre>{{ debug.logs.value.slice(-10).map(l => `${new Date(l.timestamp).toLocaleTimeString()}: ${l.event}`).join('\n') }}</pre>
		</details>
	</div>
</template>

<style scoped>
.command-palette-container {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 15vh;
	z-index: 9999;
}

.command-palette-container.is-floating {
	padding-top: 0;
	align-items: flex-start;
	justify-content: flex-start;
	pointer-events: none;
}

.command-palette-container.is-floating .command-palette-modal {
	pointer-events: auto;
}

.command-palette-overlay {
	position: absolute;
	inset: 0;
	background: var(--palette-bg-overlay, rgba(0, 0, 0, 0.5));
	backdrop-filter: blur(4px);
}

.command-palette-modal {
	position: relative;
	background: var(--palette-surface, white);
	border-radius: var(--palette-radius, 12px);
	box-shadow: var(--palette-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
	width: 100%;
	max-width: 700px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	max-height: 80vh;
	border: 1px solid var(--palette-border, #e5e7eb);
}

.command-palette-modal.is-dragging {
	opacity: 0.9;
}

/* Drag handle */
.drag-handle {
	padding: 8px;
	display: flex;
	justify-content: center;
	cursor: grab;
	background: var(--palette-hover, #f3f4f6);
}

.drag-handle:active {
	cursor: grabbing;
}

.drag-dots {
	width: 32px;
	height: 4px;
	background: var(--palette-text-muted, #9ca3af);
	border-radius: 2px;
}

/* Header */
.command-palette-header {
	padding: 16px;
	border-bottom: 1px solid var(--palette-border, #e5e7eb);
	display: flex;
	flex-direction: column;
	gap: 12px;
}

/* User row */
.user-row {
	display: flex;
	align-items: center;
	gap: 12px;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--palette-border, #e5e7eb);
}

.user-avatar {
	position: relative;
	width: 32px;
	height: 32px;
	flex-shrink: 0;
}

.avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}

.avatar-fallback {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
	color: white;
}

.status-dot {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	border: 2px solid var(--palette-surface, white);
}

.user-name {
	font-size: 14px;
	font-weight: 500;
	color: var(--palette-text, #111827);
	flex: 1;
}

.sync-status {
	font-size: 14px;
	padding: 4px;
	border-radius: 4px;
	cursor: help;
}

.sync-status.syncing {
	animation: pulse 1s infinite;
}

.sync-status.error {
	color: #ef4444;
}

/* Animation presets */
.animate-smooth .command-palette-item {
	transition: all 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.animate-bouncy .command-palette-item {
	transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-minimal .command-palette-item,
.animate-instant .command-palette-item {
	transition: none;
}

.animate-smooth .command-palette-modal {
	animation: smooth-in 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.animate-bouncy .command-palette-modal {
	animation: bouncy-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes smooth-in {
	from {
		opacity: 0;
		transform: translateY(-20px) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

@keyframes bouncy-in {
	0% {
		opacity: 0;
		transform: translateY(-30px) scale(0.95);
	}
	50% {
		transform: translateY(5px) scale(1.02);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

/* Stagger animations for list items */
.animate-smooth .command-palette-item,
.animate-bouncy .command-palette-item {
	animation: fade-in-up 300ms ease-out backwards;
}

.animate-smooth .command-palette-item:nth-child(1) { animation-delay: 0ms; }
.animate-smooth .command-palette-item:nth-child(2) { animation-delay: 30ms; }
.animate-smooth .command-palette-item:nth-child(3) { animation-delay: 60ms; }
.animate-smooth .command-palette-item:nth-child(4) { animation-delay: 90ms; }
.animate-smooth .command-palette-item:nth-child(5) { animation-delay: 120ms; }

.animate-bouncy .command-palette-item:nth-child(1) { animation-delay: 0ms; }
.animate-bouncy .command-palette-item:nth-child(2) { animation-delay: 40ms; }
.animate-bouncy .command-palette-item:nth-child(3) { animation-delay: 80ms; }
.animate-bouncy .command-palette-item:nth-child(4) { animation-delay: 120ms; }
.animate-bouncy .command-palette-item:nth-child(5) { animation-delay: 160ms; }

@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.breadcrumbs {
	display: flex;
	gap: 8px;
	font-size: 14px;
	color: var(--palette-text-secondary, #6b7280);
}

.breadcrumb-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.breadcrumb-item span:first-child {
	cursor: pointer;
	color: var(--palette-accent, #3b82f6);
}

.breadcrumb-item span:first-child:hover {
	text-decoration: underline;
}

.separator {
	color: var(--palette-text-muted, #9ca3af);
}

/* Tabs */
.tabs {
	display: flex;
	gap: 4px;
}

.tab {
	padding: 6px 12px;
	border: none;
	background: transparent;
	color: var(--palette-text-secondary, #6b7280);
	font-size: 13px;
	cursor: pointer;
	border-radius: 6px;
	transition: all 0.15s;
}

.tab:hover {
	background: var(--palette-hover, #f3f4f6);
}

.tab.active {
	background: var(--palette-selected, #eff6ff);
	color: var(--palette-accent, #3b82f6);
	font-weight: 500;
}

/* Filter badges */
.filter-badges {
	display: flex;
	gap: 8px;
	align-items: center;
	flex-wrap: wrap;
}

.badge {
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
}

.badge.file {
	background: #dbeafe;
	color: #1e40af;
}

.badge.tag {
	background: #dcfce7;
	color: #166534;
}

.badge.action {
	background: #fce7f3;
	color: #9d174d;
}

.badge.group {
	background: #f3e8ff;
	color: #6b21a8;
}

.clear-filters {
	padding: 2px 8px;
	border: none;
	background: transparent;
	color: var(--palette-text-muted, #9ca3af);
	font-size: 12px;
	cursor: pointer;
}

.clear-filters:hover {
	color: var(--palette-text-secondary, #6b7280);
}

/* Input */
.input-wrapper {
	display: flex;
	align-items: center;
	gap: 12px;
	position: relative;
}

.search-icon {
	font-size: 18px;
	color: var(--palette-text-muted, #9ca3af);
}

.command-palette-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 16px;
	background: transparent;
	color: var(--palette-text, #111827);
}

.command-palette-input::placeholder {
	color: var(--palette-text-muted, #9ca3af);
}

.voice-btn {
	padding: 6px;
	border: none;
	background: transparent;
	font-size: 18px;
	cursor: pointer;
	border-radius: 6px;
	transition: all 0.15s;
}

.voice-btn:hover {
	background: var(--palette-hover, #f3f4f6);
}

.voice-btn.listening {
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.chain-indicator {
	padding: 4px 8px;
	background: var(--palette-accent, #3b82f6);
	color: white;
	font-size: 12px;
	border-radius: 4px;
	font-weight: 500;
}

.voice-transcript {
	margin-top: 8px;
	padding: 8px 12px;
	background: var(--palette-hover, #f3f4f6);
	border-radius: 6px;
	font-size: 14px;
	color: var(--palette-text-secondary, #6b7280);
}

.voice-transcript .match {
	color: var(--palette-accent, #3b82f6);
	font-weight: 500;
}

/* History dropdown */
.history-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: var(--palette-surface, white);
	border: 1px solid var(--palette-border, #e5e7eb);
	border-top: none;
	border-radius: 0 0 8px 8px;
	z-index: 10;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	font-size: 12px;
	color: var(--palette-text-muted, #9ca3af);
	border-bottom: 1px solid var(--palette-border, #e5e7eb);
}

.clear-history {
	border: none;
	background: transparent;
	color: var(--palette-text-secondary, #6b7280);
	cursor: pointer;
	font-size: 12px;
}

.clear-history:hover {
	color: var(--palette-accent, #3b82f6);
}

.history-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 16px;
	cursor: pointer;
	font-size: 14px;
}

.history-item:hover {
	background: var(--palette-hover, #f3f4f6);
}

.history-icon {
	font-size: 14px;
	color: var(--palette-text-muted, #9ca3af);
}

/* AI Suggestions */
.ai-suggestions {
	padding: 8px 16px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.suggestions-header {
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-bottom: 8px;
	opacity: 0.9;
}

.suggestion-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px;
	cursor: pointer;
	border-radius: 6px;
	transition: background 0.15s;
}

.suggestion-item:hover {
	background: rgba(255, 255, 255, 0.1);
}

.suggestion-icon {
	font-size: 18px;
}

.suggestion-content {
	display: flex;
	flex-direction: column;
}

.suggestion-title {
	font-weight: 500;
	font-size: 14px;
}

.suggestion-desc {
	font-size: 12px;
	opacity: 0.8;
}

/* Body */
.command-palette-body {
	display: flex;
	flex: 1;
	overflow: hidden;
}

/* Empty state */
.command-palette-empty {
	flex: 1;
	padding: 48px;
	text-align: center;
	color: var(--palette-text-secondary, #6b7280);
}

.empty-icon {
	font-size: 48px;
	margin-bottom: 16px;
}

.empty-suggestions {
	margin-top: 24px;
	text-align: left;
	max-width: 300px;
	margin-left: auto;
	margin-right: auto;
}

.empty-suggestions p {
	margin-bottom: 8px;
	font-weight: 500;
}

.empty-suggestions ul {
	list-style: none;
	padding: 0;
}

.empty-suggestions li {
	padding: 4px 0;
	font-size: 14px;
}

.empty-suggestions code {
	background: var(--palette-hover, #f3f4f6);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

.empty-suggestions kbd {
	background: var(--palette-hover, #f3f4f6);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

/* List */
.command-palette-list {
	flex: 1;
	list-style: none;
	margin: 0;
	padding: 8px 0;
	overflow-y: auto;
	max-height: 400px;
}

.command-palette-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	cursor: pointer;
	transition: background 0.15s;
	border-left: 3px solid transparent;
}

.command-palette-item:hover,
.command-palette-item.is-selected {
	background: var(--palette-hover, #f3f4f6);
	border-left-color: var(--palette-accent, #3b82f6);
}

.command-palette-icon {
	font-size: 20px;
	width: 24px;
	text-align: center;
}

.command-palette-content {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.command-palette-main {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.command-palette-title {
	font-weight: 500;
	font-size: 14px;
	color: var(--palette-text, #111827);
}

.command-palette-description {
	font-size: 13px;
	color: var(--palette-text-secondary, #6b7280);
}

.command-palette-meta {
	display: flex;
	align-items: center;
	gap: 8px;
}

.pin-indicator,
.chainable-indicator {
	font-size: 14px;
}

.command-palette-shortcut {
	font-size: 11px;
	color: var(--palette-text-muted, #9ca3af);
	background: var(--palette-hover, #f3f4f6);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

/* Preview pane */
.preview-pane {
	width: 300px;
	border-left: 1px solid var(--palette-border, #e5e7eb);
	background: var(--palette-hover, #f9fafb);
	display: flex;
	flex-direction: column;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	border-bottom: 1px solid var(--palette-border, #e5e7eb);
}

.preview-header h4 {
	margin: 0;
	font-size: 14px;
	color: var(--palette-text, #111827);
}

.close-preview {
	border: none;
	background: transparent;
	font-size: 20px;
	cursor: pointer;
	color: var(--palette-text-muted, #9ca3af);
}

.preview-content {
	flex: 1;
	padding: 16px;
	overflow-y: auto;
	font-size: 13px;
}

.preview-markdown {
	line-height: 1.6;
}

.preview-json pre {
	background: var(--palette-surface, white);
	padding: 12px;
	border-radius: 6px;
	overflow-x: auto;
	font-size: 12px;
}

.preview-args h5 {
	margin: 16px 0 8px;
	font-size: 12px;
	text-transform: uppercase;
	color: var(--palette-text-secondary, #6b7280);
}

.preview-args ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.preview-args li {
	padding: 4px 0;
	font-size: 13px;
}

.preview-args code {
	background: var(--palette-surface, white);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

/* Footer */
.command-palette-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	padding: 12px 16px;
	border-top: 1px solid var(--palette-border, #e5e7eb);
	font-size: 12px;
	color: var(--palette-text-muted, #9ca3af);
}

.footer-left {
	display: flex;
	gap: 16px;
	align-items: center;
}

.key-hint {
	display: flex;
	align-items: center;
	gap: 4px;
}

.key-hint kbd {
	background: var(--palette-hover, #f3f4f6);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 11px;
}

.chain-hint {
	color: var(--palette-accent, #3b82f6);
	font-weight: 500;
}

.footer-right {
	display: flex;
	gap: 8px;
}

.action-btn {
	padding: 6px;
	border: none;
	background: transparent;
	font-size: 16px;
	cursor: pointer;
	border-radius: 6px;
	transition: background 0.15s;
}

.action-btn:hover {
	background: var(--palette-hover, #f3f4f6);
}

/* Shortcuts overlay */
.shortcuts-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10000;
}

.shortcuts-modal {
	background: var(--palette-surface, white);
	border-radius: var(--palette-radius, 12px);
	padding: 24px;
	max-width: 500px;
	max-height: 80vh;
	overflow-y: auto;
	box-shadow: var(--palette-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
}

.shortcuts-modal h3 {
	margin: 0 0 24px;
	font-size: 18px;
	color: var(--palette-text, #111827);
}

.shortcuts-grid {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 12px 24px;
	margin-bottom: 24px;
}

.shortcut-item {
	display: contents;
}

.shortcut-item kbd {
	background: var(--palette-hover, #f3f4f6);
	padding: 4px 8px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 13px;
	justify-self: start;
}

.shortcut-item span {
	color: var(--palette-text-secondary, #6b7280);
	font-size: 14px;
}

.close-help {
	width: 100%;
	padding: 12px;
	border: none;
	background: var(--palette-accent, #3b82f6);
	color: white;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 500;
}

.close-help:hover {
	background: var(--palette-accent-hover, #2563eb);
}

/* Debug panel */
.debug-panel {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 300px;
	background: var(--palette-surface, white);
	border: 2px solid #ef4444;
	border-radius: 8px;
	padding: 16px;
	font-size: 12px;
	z-index: 10001;
	max-height: 400px;
	overflow-y: auto;
}

.debug-panel h4 {
	margin: 0 0 12px;
	color: #ef4444;
}

.debug-metrics {
	display: grid;
	gap: 4px;
	margin-bottom: 12px;
}

.debug-metrics div {
	font-family: monospace;
}

.debug-panel details summary {
	cursor: pointer;
	color: var(--palette-text-secondary, #6b7280);
}

.debug-panel pre {
	background: var(--palette-hover, #f3f4f6);
	padding: 8px;
	border-radius: 4px;
	font-size: 10px;
	overflow-x: auto;
}

.debug-sync {
	margin: 8px 0;
	padding: 8px;
	background: rgba(59, 130, 246, 0.1);
	border-radius: 4px;
	font-size: 11px;
}

.debug-sync div {
	font-family: monospace;
}

/* Dark mode adjustments */
.is-dark .command-palette-modal {
	background: #1f2937;
	border-color: #374151;
}

.is-dark .command-palette-header,
.is-dark .command-palette-footer,
.is-dark .preview-header,
.is-dark .preview-pane {
	border-color: #374151;
}

.is-dark .tab.active {
	background: #374151;
}

.is-dark .command-palette-item:hover,
.is-dark .command-palette-item.is-selected {
	background: #374151;
}

.is-dark .command-palette-input {
	color: #f9fafb;
}

.is-dark .command-palette-title {
	color: #f9fafb;
}

.is-dark .command-palette-shortcut,
.is-dark kbd {
	background: #374151;
}
</style>
