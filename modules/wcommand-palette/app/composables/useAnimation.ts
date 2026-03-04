import { ref, computed, type Ref } from 'vue'

export type AnimationPreset = 'default' | 'smooth' | 'bouncy' | 'minimal' | 'instant'

export interface AnimationConfig {
	/** Opening animation duration in ms */
	openDuration: number
	/** Closing animation duration in ms */
	closeDuration: number
	/** Easing function */
	easing: string
	/** Whether to use spring physics */
	useSpring: boolean
	/** Spring stiffness (if useSpring) */
	stiffness?: number
	/** Spring damping (if useSpring) */
	damping?: number
	/** List item stagger delay in ms */
	staggerDelay: number
	/** Whether to animate list items */
	animateListItems: boolean
	/** Backdrop fade duration */
	backdropDuration: number
}

export interface UseAnimationOptions {
	/** Initial preset */
	preset?: AnimationPreset
	/** Custom config override */
	config?: Partial<AnimationConfig>
	/** Palette ID */
	paletteId?: string
}

export interface UseAnimationReturn {
	/** Current preset */
	preset: Ref<AnimationPreset>
	/** Available presets */
	presets: AnimationPreset[]
	/** Current animation config */
	config: Ref<AnimationConfig>
	/** Set animation preset */
	setPreset: (preset: AnimationPreset) => void
	/** Custom config override */
	setConfig: (config: Partial<AnimationConfig>) => void
	/** Get CSS transition string */
	getTransition: (property?: string) => string
	/** Get list item transition delay */
	getStaggerDelay: (index: number) => string
	/** Get CSS animation class */
	animationClass: Ref<string>
}

const STORAGE_KEY = 'palette-animation'

/**
 * Preset configurations
 */
const presetConfigs: Record<AnimationPreset, AnimationConfig> = {
	default: {
		openDuration: 200,
		closeDuration: 150,
		easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
		useSpring: false,
		staggerDelay: 30,
		animateListItems: true,
		backdropDuration: 200
	},
	smooth: {
		openDuration: 350,
		closeDuration: 250,
		easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
		useSpring: false,
		staggerDelay: 50,
		animateListItems: true,
		backdropDuration: 300
	},
	bouncy: {
		openDuration: 400,
		closeDuration: 300,
		easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
		useSpring: true,
		stiffness: 300,
		damping: 20,
		staggerDelay: 60,
		animateListItems: true,
		backdropDuration: 250
	},
	minimal: {
		openDuration: 100,
		closeDuration: 80,
		easing: 'ease-out',
		useSpring: false,
		staggerDelay: 0,
		animateListItems: false,
		backdropDuration: 100
	},
	instant: {
		openDuration: 0,
		closeDuration: 0,
		easing: 'linear',
		useSpring: false,
		staggerDelay: 0,
		animateListItems: false,
		backdropDuration: 0
	}
}

export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
	const preset = ref<AnimationPreset>(options.preset ?? 'default')
	const customConfig = ref<Partial<AnimationConfig>>(options.config ?? {})

	const presets: AnimationPreset[] = ['default', 'smooth', 'bouncy', 'minimal', 'instant']

	/**
	 * Computed full config (preset + overrides)
	 */
	const config = computed<AnimationConfig>(() => ({
		...presetConfigs[preset.value],
		...customConfig.value
	}))

	/**
	 * Animation class based on preset
	 */
	const animationClass = computed(() => `animate-${preset.value}`)

	/**
	 * Set animation preset
	 */
	const setPreset = (newPreset: AnimationPreset): void => {
		preset.value = newPreset
		localStorage.setItem(STORAGE_KEY, newPreset)
	}

	/**
	 * Set custom config override
	 */
	const setConfig = (newConfig: Partial<AnimationConfig>): void => {
		customConfig.value = { ...customConfig.value, ...newConfig }
	}

	/**
	 * Get CSS transition string
	 */
	const getTransition = (property: string = 'all'): string => {
		const { openDuration, easing, useSpring } = config.value

		if (useSpring) {
			// Spring physics doesn't use CSS transitions, use keyframes instead
			return `${property} ${openDuration}ms ${easing}`
		}

		return `${property} ${openDuration}ms ${easing}`
	}

	/**
	 * Get stagger delay for list item
	 */
	const getStaggerDelay = (index: number): string => {
		const { staggerDelay, animateListItems } = config.value

		if (!animateListItems || staggerDelay === 0) {
			return '0ms'
		}

		// Cap at 10 items to prevent long waits
		const cappedIndex = Math.min(index, 10)
		return `${cappedIndex * staggerDelay}ms`
	}

	/**
	 * Load saved preset on mount
	 */
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved && presets.includes(saved as AnimationPreset)) {
			preset.value = saved as AnimationPreset
		}
	}

	return {
		preset,
		presets,
		config,
		setPreset,
		setConfig,
		getTransition,
		getStaggerDelay,
		animationClass
	}
}
