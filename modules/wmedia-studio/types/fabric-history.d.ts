import { Canvas } from "fabric";

declare module "fabric" {
	interface Canvas {
		history?: {
			undo(): void;
			redo(): void;
			clear(): void;
			dispose(): void;
		};
		undo(): void;
		redo(): void;
	}

	interface CanvasEvents {
		"history:save": void;
	}
}

declare module "fabric-history" {
	const fabricHistory: (canvas: Canvas) => void;
	export default fabricHistory;
}
