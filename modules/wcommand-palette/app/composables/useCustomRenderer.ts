import { ref, h, type Ref, type Component, type VNode } from 'vue'
import type { Command } from '../types'

export type ItemRenderFunction = (props: {
	command: Command
	index: number
	isSelected: boolean
	isPinned: boolean
	isRecent: boolean
	onSelect: () => void
	onExecute: () => void
}) => VNode

export interface ItemRenderer {
	/** Renderer ID */
	id: string
	/** Renderer name */
	name: string
	/** Check if this renderer can handle the command */
	canRender: (command: Command) => boolean
	/** Render function */
	render: ItemRenderFunction
}

export interface UseCustomRendererOptions {
	/** Palette ID */
	paletteId: string
	/** Default renderer ID */
	defaultRenderer?: string
}

export interface UseCustomRendererReturn {
	/** Registered renderers */
	renderers: Ref<ItemRenderer[]>
	/** Currently active renderer ID */
	activeRenderer: Ref<string | null>
	/** Register a custom renderer */
	registerRenderer: (renderer: ItemRenderer) => () => void
	/** Unregister a renderer */
	unregisterRenderer: (id: string) => void
	/** Set active renderer */
	setActiveRenderer: (id: string | null) => void
	/** Get renderer for a command */
	getRenderer: (command: Command) => ItemRenderer | null
	/** Render a command item */
	renderItem: (props: {
		command: Command
		index: number
		isSelected: boolean
		isPinned: boolean
		isRecent: boolean
		onSelect: () => void
		onExecute: () => void
	}) => VNode | null
	/** Create a simple custom renderer */
	createSimpleRenderer: (options: {
		id: string
		name: string
		match?: (cmd: Command) => boolean
		component: Component
	}) => ItemRenderer
	/** Reset to default renderer */
	resetRenderer: () => void
}

/**
 * Default renderer that matches all commands
 */
const defaultRenderer: ItemRenderer = {
	id: 'default',
	name: 'Default',
	canRender: () => true,
	render: ({ command, index, isSelected, onSelect, onExecute }) => {
		return h('div', {
			class: ['command-item', { 'is-selected': isSelected }],
			onClick: onExecute,
			onMouseenter: onSelect
		}, [
			command.icon && h('span', { class: 'command-icon' }, command.icon),
			h('div', { class: 'command-content' }, [
				h('span', { class: 'command-title' }, command.title),
				command.description && h('span', { class: 'command-description' }, command.description)
			]),
			command.shortcut && h('span', { class: 'command-shortcut' }, command.shortcut)
		])
	}
}

export function useCustomRenderer(options: UseCustomRendererOptions): UseCustomRendererReturn {
	const renderers = ref<ItemRenderer[]>([defaultRenderer])
	const activeRenderer = ref<string | null>(options.defaultRenderer ?? null)

	/**
	 * Register a custom renderer
	 */
	const registerRenderer = (renderer: ItemRenderer): (() => void) => {
		// Remove existing renderer with same ID
		const existingIndex = renderers.value.findIndex(r => r.id === renderer.id)
		if (existingIndex >= 0) {
			renderers.value.splice(existingIndex, 1)
		}

		// Add new renderer (after default, before other custom)
		renderers.value.splice(1, 0, renderer)

		// Return unregister function
		return () => unregisterRenderer(renderer.id)
	}

	/**
	 * Unregister a renderer
	 */
	const unregisterRenderer = (id: string): void => {
		if (id === 'default') return // Can't remove default

		const index = renderers.value.findIndex(r => r.id === id)
		if (index >= 0) {
			renderers.value.splice(index, 1)
		}

		if (activeRenderer.value === id) {
			activeRenderer.value = null
		}
	}

	/**
	 * Set active renderer
	 */
	const setActiveRenderer = (id: string | null): void => {
		activeRenderer.value = id
	}

	/**
	 * Get renderer for a command
	 */
	const getRenderer = (command: Command): ItemRenderer | null => {
		// If active renderer is set and can render this command, use it
		if (activeRenderer.value) {
			const active = renderers.value.find(r => r.id === activeRenderer.value)
			if (active?.canRender(command)) {
				return active
			}
		}

		// Find first renderer that can handle this command
		for (const renderer of renderers.value) {
			if (renderer.canRender(command)) {
				return renderer
			}
		}

		return defaultRenderer
	}

	/**
	 * Render a command item
	 */
	const renderItem = (props: {
		command: Command
		index: number
		isSelected: boolean
		isPinned: boolean
		isRecent: boolean
		onSelect: () => void
		onExecute: () => void
	}): VNode | null => {
		const renderer = getRenderer(props.command)
		if (!renderer) return null

		return renderer.render(props)
	}

	/**
	 * Create a simple custom renderer from a Vue component
	 */
	const createSimpleRenderer = (options: {
		id: string
		name: string
		match?: (cmd: Command) => boolean
		component: Component
	}): ItemRenderer => {
		return {
			id: options.id,
			name: options.name,
			canRender: options.match ?? (() => true),
			render: (props) => {
				return h(options.component, {
					...props,
					key: props.command.id
				})
			}
		}
	}

	/**
	 * Reset to default renderer
	 */
	const resetRenderer = (): void => {
		activeRenderer.value = null
	}

	return {
		renderers,
		activeRenderer,
		registerRenderer,
		unregisterRenderer,
		setActiveRenderer,
		getRenderer,
		renderItem,
		createSimpleRenderer,
		resetRenderer
	}
}
