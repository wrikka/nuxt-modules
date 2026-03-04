import { reactive, Ref } from "vue";
import type {
	PerformanceMetric,
	AlertLevel,
	PerformanceSnapshot,
	PerformanceAlert,
	PerformanceOptions,
} from "../../types/performance";

export interface PerformanceState {
	isMonitoring: boolean;
	currentMetrics: Record<PerformanceMetric, number>;
	history: PerformanceSnapshot[];
	alerts: PerformanceAlert[];
	averageFrameRate: number;
	memoryUsage: number;
	totalRenderTime: number;
	renderCount: number;
}

export type { AlertLevel, PerformanceAlert, PerformanceMetric };

export function createPerformanceState(): PerformanceState {
	return reactive<PerformanceState>({
		isMonitoring: false,
		currentMetrics: {} as Record<PerformanceMetric, number>,
		history: [],
		alerts: [],
		averageFrameRate: 0,
		memoryUsage: 0,
		totalRenderTime: 0,
		renderCount: 0,
	});
}

export function getMemoryUsage(enableMemoryMonitoring: boolean): number {
	if (!enableMemoryMonitoring) return 0;

	if ("memory" in performance) {
		const memory = (performance as any).memory;
		return memory.usedJSHeapSize || 0;
	}

	return 0;
}

export function takeSnapshot(
	state: PerformanceState,
	enableMemoryMonitoring: boolean,
	maxHistorySize: number,
) {
	const snapshot: PerformanceSnapshot = {
		timestamp: new Date(),
		metrics: { ...state.currentMetrics },
		memoryUsage: getMemoryUsage(enableMemoryMonitoring),
		frameRate: state.averageFrameRate,
		renderTime:
			state.renderCount > 0 ? state.totalRenderTime / state.renderCount : 0,
	};

	state.history.push(snapshot);

	if (state.history.length > maxHistorySize) {
		state.history.shift();
	}

	state.memoryUsage = snapshot.memoryUsage;
}

export function recordRenderStart(renderStartTime: Ref<number>) {
	renderStartTime.value = performance.now();
}

export function recordRenderEnd(state: PerformanceState, renderStartTime: Ref<number>) {
	if (renderStartTime.value > 0) {
		const renderTime = performance.now() - renderStartTime.value;
		state.currentMetrics["render-time"] = renderTime;
		state.totalRenderTime += renderTime;
		state.renderCount++;
		renderStartTime.value = 0;
	}
}
