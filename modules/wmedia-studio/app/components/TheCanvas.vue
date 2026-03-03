<script setup lang="ts">
import type * as fabric from "fabric";
import type { Ref } from "vue";
import EditorCanvas from "~/components/editor/Canvas.vue";

const route = useRoute();
const projectStore = useProjectStore();
const elementStore = useElementStore();

const projectId = computed(() => route.params.id as string);

const canvasId = computed(() => `editor-${projectId.value}`);

const width = computed(() => projectStore.currentProject?.width ?? 1200);
const height = computed(() => projectStore.currentProject?.height ?? 800);
const backgroundColor = computed(() =>
	projectStore.currentProject?.backgroundColor ?? "#ffffff"
);

const canvasComponent = ref<{ canvas: fabric.Canvas | null } | null>(null);

const syncElementsToCanvas = async () => {
	const canvas = canvasComponent.value?.canvas;
	if (!canvas) return;

	const existing = new Map<string, fabric.Object>();
	canvas.getObjects().forEach((obj: fabric.Object) => {
		const elementId = (obj as any).elementId as string | undefined;
		if (elementId) existing.set(elementId, obj);
	});

	const desiredIds = new Set<string>();

	for (const [id, el] of elementStore.elements.entries()) {
		desiredIds.add(id);
		const current = existing.get(id);
		if (current) {
			current.set({
				left: el.x,
				top: el.y,
				angle: el.rotation,
				opacity: el.opacity,
				visible: el.visible,
				selectable: !el.locked,
			});
			if (typeof (current as any).set === "function") {
				if ("width" in el && "height" in el) {
					if (current.type === "rect") {
						(current as any).set({ width: el.width, height: el.height });
					}
					if (current.type === "textbox") {
						(current as any).set({ width: el.width });
					}
				}
			}
			current.setCoords();
			continue;
		}

		if (el.type === "text") {
			const obj = new (await import("fabric")).Textbox(el.content ?? "", {
				left: el.x,
				top: el.y,
				width: el.width,
				fontSize: el.fontSize,
				fill: el.color,
				opacity: el.opacity,
				angle: el.rotation,
				selectable: !el.locked,
				visible: el.visible,
			});
			(obj as any).elementId = id;
			canvas.add(obj);
		} else if (el.type === "shape") {
			const fabricMod = await import("fabric");
			let obj: fabric.Object;
			if (el.shape === "circle") {
				obj = new fabricMod.Circle({
					left: el.x,
					top: el.y,
					radius: Math.min(el.width, el.height) / 2,
					fill: el.fill,
					stroke: el.stroke,
					strokeWidth: el.strokeWidth,
					opacity: el.opacity,
					angle: el.rotation,
					selectable: !el.locked,
					visible: el.visible,
				});
			} else {
				obj = new fabricMod.Rect({
					left: el.x,
					top: el.y,
					width: el.width,
					height: el.height,
					fill: el.fill,
					stroke: el.stroke,
					strokeWidth: el.strokeWidth,
					rx: el.borderRadius ?? 0,
					ry: el.borderRadius ?? 0,
					opacity: el.opacity,
					angle: el.rotation,
					selectable: !el.locked,
					visible: el.visible,
				});
			}
			(obj as any).elementId = id;
			canvas.add(obj);
		}
	}

	for (const [id, obj] of existing.entries()) {
		if (!desiredIds.has(id)) {
			canvas.remove(obj);
		}
	}

	canvas.renderAll();
};

watch(
	() => Array.from(elementStore.elements.values()).map((e) => ({ ...e })),
	() => {
		void syncElementsToCanvas();
	},
	{ deep: true },
);

watch(
	() => [width.value, height.value, backgroundColor.value],
	() => {
		void syncElementsToCanvas();
	},
);
</script>

<template>
	<div class="flex-1 flex items-center justify-center overflow-auto p-6">
		<EditorCanvas
			ref="canvasComponent"
			:canvas-id="canvasId"
			:width="width"
			:height="height"
			:background-color="backgroundColor"
		/>
	</div>
</template>
