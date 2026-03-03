import * as fabric from "fabric";
import { computed, ref } from "vue";

export interface GuideLine {
	type: "horizontal" | "vertical";
	position: number;
	color?: string;
	opacity?: number;
}

export interface SmartGuideConfig {
	enabled: boolean;
	snapToGuides: boolean;
	snapThreshold: number;
	guideColor: string;
	guideOpacity: number;
	showCenterGuides: boolean;
	showEdgeGuides: boolean;
	showSpacingGuides: boolean;
}

export const DEFAULT_SMART_GUIDE_CONFIG: SmartGuideConfig = {
	enabled: true,
	snapToGuides: true,
	snapThreshold: 10,
	guideColor: "#00BFFF",
	guideOpacity: 0.7,
	showCenterGuides: true,
	showEdgeGuides: true,
	showSpacingGuides: true,
};

export function useSmartGuides(canvas: Ref<fabric.Canvas | null>, config: Partial<SmartGuideConfig> = {}) {
	const settings = ref<SmartGuideConfig>({ ...DEFAULT_SMART_GUIDE_CONFIG, ...config });
	const activeGuides = ref<GuideLine[]>([]);
	const isSnapping = ref(false);

	const guidesEnabled = computed(() => settings.value.enabled);

	const createGuide = (type: "horizontal" | "vertical", position: number): GuideLine => ({
		type,
		position,
		color: settings.value.guideColor,
		opacity: settings.value.guideOpacity,
	});

	const getCanvasCenter = () => {
		if (!canvas.value) return { x: 0, y: 0 };
		return {
			x: canvas.value.width! / 2,
			y: canvas.value.height! / 2,
		};
	};

	const getObjectBounds = (obj: fabric.Object) => {
		const bounds = obj.getBoundingRect();
		return {
			left: bounds.left,
			top: bounds.top,
			right: bounds.left + bounds.width,
			bottom: bounds.top + bounds.height,
			centerX: bounds.left + bounds.width / 2,
			centerY: bounds.top + bounds.height / 2,
			width: bounds.width,
			height: bounds.height,
		};
	};

	const findGuides = (movingObj: fabric.Object) => {
		if (!canvas.value || !settings.value.enabled) {
			activeGuides.value = [];
			return;
		}

		const guides: GuideLine[] = [];
		const movingBounds = getObjectBounds(movingObj);
		const canvasCenter = getCanvasCenter();
		const objects = canvas.value.getObjects().filter((obj: fabric.Object) => obj !== movingObj);

		if (settings.value.showCenterGuides) {
			if (Math.abs(movingBounds.centerX - canvasCenter.x) < settings.value.snapThreshold) {
				guides.push(createGuide("vertical", canvasCenter.x));
			}
			if (Math.abs(movingBounds.centerY - canvasCenter.y) < settings.value.snapThreshold) {
				guides.push(createGuide("horizontal", canvasCenter.y));
			}
		}

		if (settings.value.showEdgeGuides) {
			objects.forEach((obj: fabric.Object) => {
				const bounds = getObjectBounds(obj);

				if (Math.abs(movingBounds.left - bounds.left) < settings.value.snapThreshold) {
					guides.push(createGuide("vertical", bounds.left));
				}
				if (Math.abs(movingBounds.right - bounds.right) < settings.value.snapThreshold) {
					guides.push(createGuide("vertical", bounds.right));
				}
				if (Math.abs(movingBounds.top - bounds.top) < settings.value.snapThreshold) {
					guides.push(createGuide("horizontal", bounds.top));
				}
				if (Math.abs(movingBounds.bottom - bounds.bottom) < settings.value.snapThreshold) {
					guides.push(createGuide("horizontal", bounds.bottom));
				}

				if (Math.abs(movingBounds.centerX - bounds.centerX) < settings.value.snapThreshold) {
					guides.push(createGuide("vertical", bounds.centerX));
				}
				if (Math.abs(movingBounds.centerY - bounds.centerY) < settings.value.snapThreshold) {
					guides.push(createGuide("horizontal", bounds.centerY));
				}
			});
		}

		if (settings.value.showSpacingGuides) {
			objects.forEach((obj: fabric.Object) => {
				const bounds = getObjectBounds(obj);

				const horizontalSpacing = Math.abs(movingBounds.left - bounds.right);
				if (horizontalSpacing < settings.value.snapThreshold && horizontalSpacing > 0) {
					guides.push(createGuide("vertical", bounds.right));
				}

				const verticalSpacing = Math.abs(movingBounds.top - bounds.bottom);
				if (verticalSpacing < settings.value.snapThreshold && verticalSpacing > 0) {
					guides.push(createGuide("horizontal", bounds.bottom));
				}
			});
		}

		activeGuides.value = guides;
	};

	const snapToGuides = (obj: fabric.Object) => {
		if (!canvas.value || !settings.value.snapToGuides || !settings.value.enabled) {
			return;
		}

		const movingBounds = getObjectBounds(obj);
		const canvasCenter = getCanvasCenter();
		const objects = canvas.value.getObjects().filter((o: fabric.Object) => o !== obj);
		let snapped = false;

		if (settings.value.showCenterGuides) {
			if (Math.abs(movingBounds.centerX - canvasCenter.x) < settings.value.snapThreshold) {
				obj.left = canvasCenter.x - movingBounds.width / 2;
				snapped = true;
			}
			if (Math.abs(movingBounds.centerY - canvasCenter.y) < settings.value.snapThreshold) {
				obj.top = canvasCenter.y - movingBounds.height / 2;
				snapped = true;
			}
		}

		if (settings.value.showEdgeGuides) {
			objects.forEach((otherObj: fabric.Object) => {
				const bounds = getObjectBounds(otherObj);

				if (Math.abs(movingBounds.left - bounds.left) < settings.value.snapThreshold) {
					obj.left = bounds.left;
					snapped = true;
				}
				if (Math.abs(movingBounds.right - bounds.right) < settings.value.snapThreshold) {
					obj.left = bounds.right - movingBounds.width;
					snapped = true;
				}
				if (Math.abs(movingBounds.top - bounds.top) < settings.value.snapThreshold) {
					obj.top = bounds.top;
					snapped = true;
				}
				if (Math.abs(movingBounds.bottom - bounds.bottom) < settings.value.snapThreshold) {
					obj.top = bounds.bottom - movingBounds.height;
					snapped = true;
				}

				if (Math.abs(movingBounds.centerX - bounds.centerX) < settings.value.snapThreshold) {
					obj.left = bounds.centerX - movingBounds.width / 2;
					snapped = true;
				}
				if (Math.abs(movingBounds.centerY - bounds.centerY) < settings.value.snapThreshold) {
					obj.top = bounds.centerY - movingBounds.height / 2;
					snapped = true;
				}
			});
		}

		if (snapped) {
			obj.setCoords();
			canvas.value.renderAll();
			isSnapping.value = true;
			setTimeout(() => {
				isSnapping.value = false;
			}, 100);
		}
	};

	const drawGuides = () => {
		if (!canvas.value) return;

		canvas.value.clearContext(canvas.value.contextTop || canvas.value.getContext());

		activeGuides.value.forEach((guide) => {
			const ctx = canvas.value?.contextTop || canvas.value?.getContext();
			if (!ctx) return;

			ctx.save();
			ctx.strokeStyle = guide.color || settings.value.guideColor;
			ctx.lineWidth = 1;
			ctx.globalAlpha = guide.opacity || settings.value.guideOpacity;
			ctx.setLineDash([5, 5]);

			if (guide.type === "horizontal") {
				ctx.beginPath();
				ctx.moveTo(0, guide.position);
				ctx.lineTo(canvas.value!.width!, guide.position);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(guide.position, 0);
				ctx.lineTo(guide.position, canvas.value!.height!);
				ctx.stroke();
			}

			ctx.restore();
		});
	};

	const clearGuides = () => {
		activeGuides.value = [];
		if (canvas.value) {
			canvas.value.clearContext(canvas.value.contextTop || canvas.value.getContext());
			canvas.value.renderAll();
		}
	};

	const updateConfig = (newConfig: Partial<SmartGuideConfig>) => {
		settings.value = { ...settings.value, ...newConfig };
	};

	const toggleGuides = () => {
		settings.value.enabled = !settings.value.enabled;
	};

	const toggleSnap = () => {
		settings.value.snapToGuides = !settings.value.snapToGuides;
	};

	return {
		guidesEnabled,
		activeGuides,
		isSnapping,
		settings,
		findGuides,
		snapToGuides,
		drawGuides,
		clearGuides,
		updateConfig,
		toggleGuides,
		toggleSnap,
	};
}
