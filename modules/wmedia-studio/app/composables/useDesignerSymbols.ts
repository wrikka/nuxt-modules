import * as fabric from "fabric";
import { nanoid } from "nanoid";
import { ref } from "vue";

export interface DesignerSymbol {
	id: string;
	name: string;
	json: any;
}

export interface UseDesignerSymbolsOptions {
	getCanvas: () => fabric.Canvas | null;
	onSymbolsChange?: () => void;
}

export const useDesignerSymbols = (options: UseDesignerSymbolsOptions) => {
	const symbols = ref<DesignerSymbol[]>([]);

	const createSymbol = (name: string) => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject) return;

		symbols.value.push({
			id: nanoid(),
			name,
			json: (activeObject as any).toJSON(["dataId", "name", "visible", "locked"]),
		});
		options.onSymbolsChange?.();
	};

	const insertSymbol = (symbolId: string, pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const symbol = symbols.value.find((s) => s.id === symbolId);
		if (!symbol) return;

		(fabric.util as any).enlivenObjects([symbol.json], (objects: fabric.Object[]) => {
			objects.forEach((obj) => {
				(obj as any).dataId = nanoid();
				c.add(obj);
			});
			c.renderAll();
			pushHistory();
			rebuildLayers();
		});
	};

	const deleteSymbol = (symbolId: string) => {
		symbols.value = symbols.value.filter((s) => s.id !== symbolId);
		options.onSymbolsChange?.();
	};

	const renameSymbol = (symbolId: string, newName: string) => {
		const symbol = symbols.value.find((s) => s.id === symbolId);
		if (symbol) {
			symbol.name = newName;
			options.onSymbolsChange?.();
		}
	};

	return {
		symbols,
		createSymbol,
		insertSymbol,
		deleteSymbol,
		renameSymbol,
	};
};
