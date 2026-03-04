import { Ref } from 'vue';
import type { PerformanceState } from './monitoring-core';

export function startFrameRateMonitoring(
	state: PerformanceState,
	frameCount: { value: number },
	lastFrameTime: { value: number },
) {
	const measureFrame = () => {
		frameCount.value++;
		const currentTime = performance.now();
		const deltaTime = currentTime - lastFrameTime.value;

		if (deltaTime >= 1000) {
			state.currentMetrics["frame-rate"] = (frameCount.value * 1000) / deltaTime;
			state.averageFrameRate = state.currentMetrics["frame-rate"];
			frameCount.value = 0;
			lastFrameTime.value = currentTime;
		}

		if (state.isMonitoring) {
			requestAnimationFrame(measureFrame);
		}
	};

	requestAnimationFrame(measureFrame);
}
