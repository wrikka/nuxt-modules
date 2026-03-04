import type { DesignerSelectedObject } from "#shared/types/element";
import * as fabric from "fabric";
import { ref } from "vue";
import { useDesignerAI } from "./useDesignerAI";
import { useDesignerComments } from "./useDesignerComments";
import { useDesignerExport } from "./useDesignerExport";
import { useDesignerGrid } from "./useDesignerGrid";
import { useDesignerHistory } from "./useDesignerHistory";
import { useDesignerLayers } from "./useDesignerLayers";
import { useDesignerObjectActions } from "./useDesignerObjectActions";
import { useDesignerObjectCreation } from "./useDesignerObjectCreation";
import { useDesignerPersistence } from "./useDesignerPersistence";
import { useDesignerCollaboration } from "./useDesignerCollaboration";
import { useDesignerPlugins } from "./useDesignerPlugins";
import { useDesignerSymbols } from "./useDesignerSymbols";
import { useDesignerVersions } from "./useDesignerVersions";
import { useDesignerZoom } from "./useDesignerZoom";

export interface DesignerLayerItem {
	id: string;
	name: string;
	type: string;
	visible: boolean;
	locked: boolean;
}

export interface DesignerDocumentState {
	projectId: string;
	artboard: { width: number; height: number };
	backgroundColor: string;
	schemaVersion: number;
}

const CANVAS_JSON_EXTRA_PROPS = ["dataId", "name", "visible", "locked", "commentText", "isComment", "isCropping"];

export const useDesignerDocument = (projectId: string) => {
	const canvas = ref<fabric.Canvas | null>(null);
	const isInitialized = ref(false);
	const selected = ref<DesignerSelectedObject | null>(null);

	const artboard = reactive({ width: 1200, height: 800 });
	const backgroundColor = ref("#ffffff");

	const getCanvas = () => canvas.value ?? null;

	// History Management
	const {
		history,
		historyIndex,
		canUndo: historyCanUndo,
		canRedo: historyCanRedo,
		pushHistory,
		undo: historyUndo,
		redo: historyRedo,
		dispose: disposeHistory,
		initializeWithSnapshot,
		isHistoryEnabled,
	} = useDesignerHistory({
		getCanvas,
		canvasJsonExtraProps: CANVAS_JSON_EXTRA_PROPS,
		onHistoryChange: () => {
			persistence.isDirty.value = true;
			persistence.scheduleAutoSave();
		},
	});

	// Persistence
	const persistence = useDesignerPersistence({
		projectId,
		getCanvas,
		canvasJsonExtraProps: CANVAS_JSON_EXTRA_PROPS,
		artboard,
		backgroundColor,
		versions: ref([]),
	});

	// Grid & Guides
	const grid = useDesignerGrid({
		getCanvas,
		artboard,
	});

	// Zoom & Viewport
	const zoom = useDesignerZoom({
		getCanvas,
		artboard,
	});

	// Layers
	const layersManager = useDesignerLayers({
		getCanvas,
		onLayersChange: () => {
			updateSelectedFromCanvas();
		},
	});

	// Object Actions
	const objectActions = useDesignerObjectActions({
		getCanvas,
		onObjectModified: () => {
			layersManager.rebuildLayers();
			updateSelectedFromCanvas();
			pushHistory();
		},
	});

	// Object Creation
	const objectCreation = useDesignerObjectCreation({
		getCanvas,
		onObjectCreated: () => {
			layersManager.rebuildLayers();
			pushHistory();
		},
	});

	// Export
	const exportManager = useDesignerExport({
		getCanvas,
		projectId,
	});

	// AI Features
	const ai = useDesignerAI();

	// Versions
	const versionsManager = useDesignerVersions({
		getCanvas,
		canvasJsonExtraProps: CANVAS_JSON_EXTRA_PROPS,
		onVersionsChange: () => {
			layersManager.rebuildLayers();
		},
		onDirtyChange: () => {
			persistence.isDirty.value = true;
		},
		scheduleAutoSave: () => persistence.scheduleAutoSave(),
	});

	// Comments
	const comments = useDesignerComments({
		getCanvas,
	});

	// Collaboration
	const collaboration = useDesignerCollaboration({
		getCanvasJson: () => {
			const c = getCanvas();
			if (!c) return null;
			return JSON.stringify(c.toJSON(CANVAS_JSON_EXTRA_PROPS));
		},
		applyRemoteOperation: (operation) => {
			const c = getCanvas();
			if (!c) return;
			// Apply CRDT operation
			switch (operation.type) {
				case "object:add":
				case "object:modify":
				case "object:remove": {
					c.loadFromJSON(operation.payload.canvas as string, () => {
						c.renderAll();
						layersManager.rebuildLayers();
					});
					break;
				}
				case "layer:reorder":
					layersManager.rebuildLayers();
					break;
				case "artboard:resize": {
					const { width, height } = operation.payload as { width: number; height: number };
					artboard.width = width;
					artboard.height = height;
					break;
				}
			}
		},
		getLocalUserName: () => "Designer User",
	});

	// Plugins
	const pluginsManager = useDesignerPlugins({
		getCanvas,
		onPluginLoad: (plugin) => {
			console.log(`[Designer] Plugin loaded: ${plugin.manifest.name}`);
		},
		onPluginUnload: (plugin) => {
			console.log(`[Designer] Plugin unloaded: ${plugin.manifest.name}`);
		},
	});

	// Initialize plugins on mount
	onMounted(() => {
		pluginsManager.restorePlugins();
	});

	// Pen Mode
	const isPenMode = ref(false);
	let currentPath: fabric.Polyline | null = null;

	// Eyedropper Mode
	const isEyedropperMode = ref(false);
	let eyedropperCallback: ((color: string) => void) | null = null;

	const updateSelectedFromCanvas = () => {
		objectActions.updateSelectedFromCanvas(selected);
	};

	const loadFromJson = async (json: string) => {
		const c = getCanvas();
		if (!c) return;

		isHistoryEnabled.value = false;

		await new Promise<void>((resolve, reject) => {
			try {
				void c.loadFromJSON(json, () => {
					c.renderAll();
					resolve();
				});
			} catch (err) {
				reject(err);
			}
		});

		isHistoryEnabled.value = true;

		layersManager.rebuildLayers();
		updateSelectedFromCanvas();
	};

	const undo = async () => {
		await historyUndo();
		persistence.isDirty.value = true;
	};

	const redo = async () => {
		await historyRedo();
		persistence.isDirty.value = true;
	};

	const canUndo = computed(() => historyCanUndo.value);
	const canRedo = computed(() => historyCanRedo.value);

	const setupCanvasEvents = () => {
		const c = getCanvas();
		if (!c) return;

		c.on("selection:created", () => {
			updateSelectedFromCanvas();
		});
		c.on("selection:updated", () => {
			updateSelectedFromCanvas();
		});
		c.on("selection:cleared", () => {
			selected.value = null;
		});

		c.on("object:modified", () => {
			layersManager.rebuildLayers();
			updateSelectedFromCanvas();
			pushHistory();
		});
		c.on("object:added", () => {
			layersManager.rebuildLayers();
			pushHistory();
		});
		c.on("object:removed", () => {
			layersManager.rebuildLayers();
			pushHistory();
		});
	};

	const init = async (canvasInstance: fabric.Canvas, width: number, height: number) => {
		canvas.value = canvasInstance;
		artboard.width = width;
		artboard.height = height;

		setupCanvasEvents();
		await persistence.load(loadFromJson, initializeWithSnapshot);
		grid.drawGrid();
		persistence.startAutoSaveInterval();

		isInitialized.value = true;
	};

	const enterPenMode = () => {
		const c = getCanvas();
		if (!c) return;
		isPenMode.value = true;
		c.selection = false;
		c.defaultCursor = "crosshair";
		c.discardActiveObject();
		c.renderAll();
	};

	const activateEyedropper = (callback: (color: string) => void) => {
		const c = getCanvas();
		if (!c) return;
		isEyedropperMode.value = true;
		eyedropperCallback = callback;
		c.defaultCursor = "crosshair";
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (isEyedropperMode.value) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			const ctx = c.getContext();
			if (ctx) {
				const pixel = ctx.getImageData(pointer.x, pointer.y, 1, 1).data;
				const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
				if (eyedropperCallback) {
					eyedropperCallback(color);
				}
			}
			isEyedropperMode.value = false;
			c.defaultCursor = "default";
			return;
		}
		if (isPenMode.value) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			const points = [pointer.x, pointer.y, pointer.x, pointer.y];
			currentPath = new fabric.Polyline(points, {
				stroke: "#000000",
				strokeWidth: 2,
				fill: undefined,
				selectable: false,
				evented: false,
			});
			c.add(currentPath);
			return;
		}

		zoom.handleMouseDown(e, isEyedropperMode.value, isPenMode.value);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isPenMode.value && currentPath) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			currentPath.points.push(new fabric.Point(pointer.x, pointer.y));
			c.renderAll();
			return;
		}

		zoom.handleMouseMove(e, isPenMode.value, currentPath);
	};

	const handleMouseUp = () => {
		if (isPenMode.value && currentPath) {
			const c = getCanvas();
			if (c) {
				(currentPath as any).dataId = crypto.randomUUID();
				(currentPath as any).name = "Path";
				(currentPath as any).visible = true;
				(currentPath as any).locked = false;
				currentPath.set({
					selectable: true,
					evented: true,
				});
				c.setActiveObject(currentPath);
				c.renderAll();
				pushHistory();
				c.selection = true;
				c.defaultCursor = "default";
			}
			currentPath = null;
			isPenMode.value = false;
			return;
		}

		zoom.handleMouseUp();
	};

	const dispose = () => {
		disposeHistory();
		persistence.dispose();
	};

	const saveVersion = (name: string) => {
		versionsManager.saveVersion(name);
	};

	const loadVersion = (versionId: string) => {
		versionsManager.loadVersion(versionId, loadFromJson, pushHistory, layersManager.rebuildLayers);
	};

	const deleteVersion = (versionId: string) => {
		versionsManager.deleteVersion(versionId);
	};

	const addComment = (x: number, y: number, text: string) => {
		comments.addComment(x, y, text, pushHistory, layersManager.rebuildLayers);
	};

	const resolveComment = (commentId: string) => {
		comments.resolveComment(commentId, pushHistory);
	};

	const deleteComment = (commentId: string) => {
		comments.deleteComment(commentId, pushHistory, layersManager.rebuildLayers);
	};

	return {
		// State
		canvas,
		isInitialized,
		isDirty: persistence.isDirty,
		lastSaveTime: persistence.lastSaveTime,
		artboard,
		backgroundColor,
		selected,
		layers: layersManager.layers,
		symbols: symbols.symbols,
		versions: versionsManager.versions,
		guides: grid.guides,

		// Grid
		showGrid: grid.showGrid,
		gridSize: grid.gridSize,
		snapToGrid: grid.snapToGrid,

		// Zoom
		zoomLevel: zoom.zoomLevel,

		// History
		canUndo,
		canRedo,
		undo,
		redo,

		// Core
		init,
		save: persistence.save,
		dispose,

		// Export
		exportPng: exportManager.exportPng,
		exportWebP: exportManager.exportWebP,
		exportSvg: exportManager.exportSvg,
		exportJson: exportManager.exportJson,
		exportCss: exportManager.exportCss,
		downloadCss: exportManager.downloadCss,

		// Object Creation
		addText: objectCreation.addText,
		addRectangle: objectCreation.addRectangle,
		addCircle: objectCreation.addCircle,
		addPolygon: objectCreation.addPolygon,
		addStar: objectCreation.addStar,
		addImage: objectCreation.addImage,
		loadTemplate: objectCreation.loadTemplate,
		enterPenMode,
		loadGoogleFont: objectCreation.loadGoogleFont,

		// Object Actions
		updateProperty: (property: string, value: unknown) => objectActions.updateProperty(property, value, pushHistory),
		updatePropertyMulti: (property: string, value: unknown) => objectActions.updatePropertyMulti(property, value, pushHistory),
		alignObjects: objectActions.alignObjects,
		deleteSelected: () => objectActions.deleteSelected(pushHistory),
		duplicateSelected: () => objectActions.duplicateSelected(pushHistory),
		group: () => objectActions.group(pushHistory, layersManager.rebuildLayers),
		ungroup: () => objectActions.ungroup(pushHistory, layersManager.rebuildLayers),
		cropImage: (clipPath: "rect" | "circle" | "none") => objectActions.cropImage(clipPath, pushHistory),
		toggleImageCropMode: objectActions.toggleImageCropMode,
		applyGlowEffect: (color: string, blur: number) => objectActions.applyGlowEffect(color, blur, pushHistory),
		activateEyedropper,
		booleanOperation: (operation: "union" | "intersect" | "subtract" | "xor") =>
			objectActions.booleanOperation(operation, pushHistory, layersManager.rebuildLayers),
		animateObject: objectActions.animateObject,

		// Layers
		selectLayer: layersManager.selectLayer,
		toggleLayerVisible: layersManager.toggleLayerVisible,
		toggleLayerLocked: layersManager.toggleLayerLocked,
		renameLayer: layersManager.renameLayer,
		bringForward: layersManager.bringForward,
		sendBackward: layersManager.sendBackward,
		bringToFront: layersManager.bringToFront,
		sendToBack: layersManager.sendToBack,

		// Grid & Guides
		drawGrid: grid.drawGrid,
		clearGrid: grid.clearGrid,
		toggleGrid: grid.toggleGrid,
		snapToGridValue: grid.snapToGridValue,
		addGuide: grid.addGuide,
		removeGuide: grid.removeGuide,
		clearGuides: grid.clearGuides,
		snapToGuidesValue: grid.snapToGuidesValue,

		// Zoom
		zoom: zoom.zoom,
		setZoom: zoom.setZoom,
		zoomIn: zoom.zoomIn,
		zoomOut: zoom.zoomOut,
		resetZoom: zoom.resetZoom,
		fitToViewport: zoom.fitToViewport,
		handleWheel: zoom.handleWheel,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,

		// Versions
		saveVersion,
		loadVersion,
		deleteVersion,

		// Comments
		addComment,
		resolveComment,
		deleteComment,

		// Symbols
		createSymbol: symbols.createSymbol,
		insertSymbol: (symbolId: string) => symbols.insertSymbol(symbolId, pushHistory, layersManager.rebuildLayers),
		deleteSymbol: symbols.deleteSymbol,
		renameSymbol: symbols.renameSymbol,

		// AI
		removeBackground: ai.removeBackground,
		generateImage: ai.generateImage,

		// Collaboration
		collaboration: {
			isConnected: collaboration.isConnected,
			isHost: collaboration.isHost,
			roomId: collaboration.roomId,
			localUserId: collaboration.localUserId,
			localUserName: collaboration.localUserName,
			users: collaboration.users,
			userCount: collaboration.userCount,
			onlineUsers: collaboration.onlineUsers,
			canCollaborate: collaboration.canCollaborate,
			createRoom: collaboration.createRoom,
			joinRoom: collaboration.joinRoom,
			leaveRoom: collaboration.leaveRoom,
			updateCursor: collaboration.updateCursor,
			broadcastOperation: collaboration.broadcastOperation,
			setLocalUserName: collaboration.setLocalUserName,
			getRoomLink: collaboration.getRoomLink,
		},

		// Plugins
		plugins: {
			plugins: pluginsManager.plugins,
			activePlugins: pluginsManager.activePlugins,
			pluginCount: pluginsManager.pluginCount,
			activePluginCount: pluginsManager.activePluginCount,
			isLoading: pluginsManager.isLoading,
			error: pluginsManager.error,
			installPlugin: pluginsManager.installPlugin,
			uninstallPlugin: pluginsManager.uninstallPlugin,
			activatePlugin: pluginsManager.activatePlugin,
			deactivatePlugin: pluginsManager.deactivatePlugin,
			updatePluginConfig: pluginsManager.updatePluginConfig,
			getPlugin: pluginsManager.getPlugin,
			getAllPlugins: pluginsManager.getAllPlugins,
			createPluginTemplate: pluginsManager.createPluginTemplate,
		},

		// Collaboration
		collaboration: {
			isConnected: collaboration.isConnected,
			isHost: collaboration.isHost,
			roomId: collaboration.roomId,
			localUserId: collaboration.localUserId,
			localUserName: collaboration.localUserName,
			users: collaboration.users,
			userCount: collaboration.userCount,
			onlineUsers: collaboration.onlineUsers,
			canCollaborate: collaboration.canCollaborate,
			createRoom: collaboration.createRoom,
			joinRoom: collaboration.joinRoom,
			leaveRoom: collaboration.leaveRoom,
			updateCursor: collaboration.updateCursor,
			broadcastOperation: collaboration.broadcastOperation,
			setLocalUserName: collaboration.setLocalUserName,
			getRoomLink: collaboration.getRoomLink,
		},

		// Plugins
		plugins: {
			plugins: pluginsManager.plugins,
			activePlugins: pluginsManager.activePlugins,
			pluginCount: pluginsManager.pluginCount,
			activePluginCount: pluginsManager.activePluginCount,
			isLoading: pluginsManager.isLoading,
			error: pluginsManager.error,
			installPlugin: pluginsManager.installPlugin,
			uninstallPlugin: pluginsManager.uninstallPlugin,
			activatePlugin: pluginsManager.activatePlugin,
			deactivatePlugin: pluginsManager.deactivatePlugin,
			updatePluginConfig: pluginsManager.updatePluginConfig,
			getPlugin: pluginsManager.getPlugin,
			getAllPlugins: pluginsManager.getAllPlugins,
			createPluginTemplate: pluginsManager.createPluginTemplate,
		},

		// Stub methods for designer properties panel (TODO: implement)
		addShape: (_shapeId: string) => {
			// TODO: Implement shape addition
		},
		applyTextStyle: (_style: { fontSize: number; fontWeight: string }) => {
			// TODO: Implement text style application
		},
		applyCrop: (_crop: { x: number; y: number; width: number; height: number }) => {
			// TODO: Implement crop application
		},
		rotateSelected: (_angle: number) => {
			// TODO: Implement rotation
		},
		flipSelected: (_direction: "horizontal" | "vertical") => {
			// TODO: Implement flip
		},
		distributeObjects: (_direction: "horizontal" | "vertical", _method: string) => {
			// TODO: Implement object distribution
		},
		setArtboardSize: (preset: { width: number; height: number }) => {
			artboard.width = preset.width;
			artboard.height = preset.height;
		},
		applyBackgroundPattern: (_pattern: string, _color: string) => {
			// TODO: Implement background pattern
		},
	};
};
