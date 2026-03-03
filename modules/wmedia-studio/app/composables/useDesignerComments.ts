import * as fabric from "fabric";
import { nanoid } from "nanoid";
import { ref } from "vue";

export interface UseDesignerCommentsOptions {
	getCanvas: () => fabric.Canvas | null;
	onCommentsChange?: () => void;
}

export const useDesignerComments = (options: UseDesignerCommentsOptions) => {
	const addComment = (x: number, y: number, text: string, pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const comment = new fabric.Circle({
			left: x,
			top: y,
			radius: 12,
			fill: "#fbbf24",
			stroke: "#f59e0b",
			strokeWidth: 2,
		});
		(comment as any).dataId = nanoid();
		(comment as any).name = "Comment";
		(comment as any).commentText = text;
		(comment as any).isComment = true;
		(comment as any).visible = true;
		(comment as any).locked = false;
		c.add(comment);
		c.renderAll();
		pushHistory();
		rebuildLayers();
	};

	const resolveComment = (commentId: string, pushHistory: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		const comment = objects.find((obj: any) => obj.dataId === commentId && obj.isComment);
		if (comment) {
			(comment as any).set({
				fill: "#10B981",
				stroke: "#059669",
				resolved: true,
			});
			c.renderAll();
			pushHistory();
		}
	};

	const deleteComment = (commentId: string, pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		const comment = objects.find((obj: any) => obj.dataId === commentId && obj.isComment);
		if (comment) {
			c.remove(comment);
			c.renderAll();
			pushHistory();
			rebuildLayers();
		}
	};

	const getComments = (): Array<{ id: string; x: number; y: number; text: string; resolved: boolean }> => {
		const c = options.getCanvas();
		if (!c) return [];

		return c.getObjects()
			.filter((obj: any) => obj.isComment)
			.map((obj: any) => ({
				id: obj.dataId,
				x: obj.left,
				y: obj.top,
				text: obj.commentText || "",
				resolved: obj.resolved || false,
			}));
	};

	return {
		addComment,
		resolveComment,
		deleteComment,
		getComments,
	};
};
