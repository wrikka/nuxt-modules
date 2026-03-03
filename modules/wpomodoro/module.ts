/// <reference types="nuxt" />
import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import type { NuxtModule } from "@nuxt/schema"
import { defu } from "defu"

export interface PomodoroModuleOptions {
	// Durations (in minutes)
	workDuration?: number
	shortBreakDuration?: number
	longBreakDuration?: number
	longBreakInterval?: number

	// Auto-start options
	autoStartBreaks?: boolean
	autoStartPomodoros?: boolean

	// Features
	enableAudio?: boolean
	enableNotifications?: boolean
	enableSoundscapes?: boolean
	enableFocusMode?: boolean
	enableMiniTimer?: boolean
	enableStats?: boolean
	enableKeyboardShortcuts?: boolean
	enableTaskIntegration?: boolean

	// Audio settings
	workSound?: string
	breakSound?: string
	completeSound?: string
	volume?: number
}

export default defineNuxtModule({
	meta: {
		name: "@wrikka/pomodoro",
		configKey: "pomodoro",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},
	defaults: {
		workDuration: 25,
		shortBreakDuration: 5,
		longBreakDuration: 15,
		longBreakInterval: 4,
		autoStartBreaks: false,
		autoStartPomodoros: false,
		enableAudio: true,
		enableNotifications: true,
		enableSoundscapes: true,
		enableFocusMode: true,
		enableMiniTimer: true,
		enableStats: true,
		enableKeyboardShortcuts: true,
		enableTaskIntegration: true,
		workSound: "/sounds/work-start.mp3",
		breakSound: "/sounds/break-start.mp3",
		completeSound: "/sounds/complete.mp3",
		volume: 0.5,
	} as PomodoroModuleOptions,
	setup(options: PomodoroModuleOptions, nuxt) {
		const resolver = createResolver(import.meta.url)
		const logger = useLogger("@wrikka/pomodoro")

		// Merge user options with defaults
		const config = defu(nuxt.options.runtimeConfig.public.pomodoro, options)

		// Add runtime config
		nuxt.options.runtimeConfig.public.pomodoro = config

		// Register runtime directory
		nuxt.options.alias["#pomodoro"] = resolver.resolve("./runtime")
		nuxt.options.alias["#pomodoro/types"] = resolver.resolve("./app/types")

		// Register composables
		addImportsDir(resolver.resolve("./app/composables"))

		// Register components
		addComponentsDir({
			path: resolver.resolve("./app/components"),
			prefix: "WPomodoro",
		})

		// Register plugin
		addPlugin(resolver.resolve("./app/plugins/pomodoro.client"))

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: resolver.resolve("./app/types"),
			})
		})

		logger.success("Pomodoro module loaded with all features enabled")
	},
}) as NuxtModule<PomodoroModuleOptions, PomodoroModuleOptions>
