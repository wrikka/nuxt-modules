import type { fabric } from "fabric";
import { nanoid } from "nanoid";

export interface UseDesignerExportOptions {
	getCanvas: () => fabric.Canvas | null;
	projectId: string;
}

export const useDesignerExport = (options: UseDesignerExportOptions) => {
	const exportPng = (exportOptions?: {
		multiplier?: number;
		includeBackground?: boolean;
		selectionOnly?: boolean;
	}) => {
		const c = options.getCanvas();
		if (!c) return;

		const exportCanvas = exportOptions?.selectionOnly ? c.getActiveObject() : c;
		if (!exportCanvas) return;

		const dataUrl = (exportCanvas as any).toDataURL({
			format: "png",
			multiplier: exportOptions?.multiplier || 2,
		});

		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `designer-${options.projectId}.png`;
		a.click();
	};

	const exportWebP = (exportOptions?: { multiplier?: number; selectionOnly?: boolean }) => {
		const c = options.getCanvas();
		if (!c) return;

		const dataUrl = c.toDataURL({
			format: "webp",
			quality: 0.9,
			multiplier: exportOptions?.multiplier ?? 1,
			...(exportOptions?.selectionOnly
				? {
					left: c.getActiveObject()?.getBoundingRect().left,
					top: c.getActiveObject()?.getBoundingRect().top,
					width: c.getActiveObject()?.getBoundingRect().width,
					height: c.getActiveObject()?.getBoundingRect().height,
				}
				: {}),
		});

		const link = document.createElement("a");
		link.download = `design-${Date.now()}.webp`;
		link.href = dataUrl;
		link.click();
	};

	const exportSvg = () => {
		const c = options.getCanvas();
		if (!c) return;

		const svg = c.toSVG();
		const blob = new Blob([svg], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `designer-${options.projectId}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportJson = () => {
		const c = options.getCanvas();
		if (!c) return;

		const json = JSON.stringify(c.toJSON(), null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `designer-${options.projectId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportCss = (): string => {
		const c = options.getCanvas();
		if (!c) return "";

		let css = "";
		c.getObjects().forEach((obj: any) => {
			css += `.${obj.name || "object"} {\n`;
			css += `  position: absolute;\n`;
			css += `  left: ${obj.left}px;\n`;
			css += `  top: ${obj.top}px;\n`;
			css += `  width: ${obj.getScaledWidth?.() || obj.width}px;\n`;
			css += `  height: ${obj.getScaledHeight?.() || obj.height}px;\n`;
			if (obj.fill) css += `  background: ${obj.fill};\n`;
			css += `}\n\n`;
		});
		return css;
	};

	const downloadCss = () => {
		const css = exportCss();
		const blob = new Blob([css], { type: "text/css" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `design-${options.projectId}.css`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return {
		exportPng,
		exportWebP,
		exportSvg,
		exportJson,
		exportCss,
		downloadCss,
	};
};
