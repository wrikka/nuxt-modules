import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface UseDebugModeReturn {
	/** Debug mode enabled */
	isDebug: Ref<boolean>
	/** Performance metrics */
	metrics: Ref<{
		openTime: number
		searchTime: number
		renderTime: number
		lastExecution: number
	}>
	/** Event log */
	logs: Ref<{ timestamp: number; event: string; data?: unknown }[]>
	/** Enable debug mode */
	enableDebug: () => void
	/** Disable debug mode */
	disableDebug: () => void
	/** Toggle debug mode */
	toggleDebug: () => void
	/** Record metric */
	recordMetric: (key: keyof UseDebugModeReturn['metrics']['value'], value: number) => void
	/** Log event */
	logEvent: (event: string, data?: unknown) => void
	/** Clear logs */
	clearLogs: () => void
	/** Export debug data */
	exportDebugData: () => string
}

export function useDebugMode(): UseDebugModeReturn {
	const isDebug = ref(false)
	const metrics = ref({
		openTime: 0,
		searchTime: 0,
		renderTime: 0,
		lastExecution: 0,
	})
	const logs = ref<{ timestamp: number; event: string; data?: unknown }[]>([])

	const enableDebug = () => {
		isDebug.value = true
		logEvent('debug_enabled')
	}

	const disableDebug = () => {
		isDebug.value = false
	}

	const toggleDebug = () => {
		if (isDebug.value) {
			disableDebug()
		} else {
			enableDebug()
		}
	}

	const recordMetric = (key: keyof typeof metrics.value, value: number) => {
		metrics.value[key] = value
		if (isDebug.value) {
			logEvent(`metric_${key}`, value)
		}
	}

	const logEvent = (event: string, data?: unknown) => {
		if (!isDebug.value) return

		logs.value.push({
			timestamp: Date.now(),
			event,
			data,
		})

		// Keep only last 100 logs
		if (logs.value.length > 100) {
			logs.value = logs.value.slice(-100)
		}
	}

	const clearLogs = () => {
		logs.value = []
	}

	const exportDebugData = () => {
		return JSON.stringify({
			metrics: metrics.value,
			logs: logs.value,
		}, null, 2)
	}

	return {
		isDebug,
		metrics,
		logs,
		enableDebug,
		disableDebug,
		toggleDebug,
		recordMetric,
		logEvent,
		clearLogs,
		exportDebugData,
	}
}
