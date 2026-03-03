import { nanoid } from "nanoid";
import { ref } from "vue";

export interface DesignerVersion {
	id: string;
	name: string;
	timestamp: number;
	json: string;
}

export interface UseDesignerVersionsOptions {
	getCanvas: () => any;
	canvasJsonExtraProps: string[];
	onVersionsChange?: () => void;
	onDirtyChange?: () => void;
	scheduleAutoSave?: () => void;
}

export const useDesignerVersions = (options: UseDesignerVersionsOptions) => {
	const versions = ref<DesignerVersion[]>([]);

	const saveVersion = (name: string) => {
		const c = options.getCanvas();
		if (!c) return;

		const json = JSON.stringify((c as any).toJSON(options.canvasJsonExtraProps));
		versions.value.unshift({
			id: nanoid(),
			name: name || `Version ${versions.value.length + 1}`,
			timestamp: Date.now(),
			json,
		});
		options.onVersionsChange?.();
		options.onDirtyChange?.();
		options.scheduleAutoSave?.();
	};

	const loadVersion = (versionId: string, loadFromJson: (json: string) => Promise<void>, pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const version = versions.value.find((v) => v.id === versionId);
		if (!version) return;

		c.clear();
		void c.loadFromJSON(version.json, () => {
			c.renderAll();
			rebuildLayers();
			pushHistory();
		});
	};

	const deleteVersion = (versionId: string) => {
		versions.value = versions.value.filter((v) => v.id !== versionId);
		options.onVersionsChange?.();
		options.onDirtyChange?.();
		options.scheduleAutoSave?.();
	};

	const renameVersion = (versionId: string, newName: string) => {
		const version = versions.value.find((v) => v.id === versionId);
		if (version) {
			version.name = newName;
			options.onVersionsChange?.();
		}
	};

	return {
		versions,
		saveVersion,
		loadVersion,
		deleteVersion,
		renameVersion,
	};
};
