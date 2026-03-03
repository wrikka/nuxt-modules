<script setup lang="ts">
import type { DesignerSelectedObject } from "#shared/types/element";
import type * as fabric from "fabric";
import ArtboardSettingsModal from "~/components/designer/ArtboardSettingsModal.vue";
import AssetLibraryModal from "~/components/designer/AssetLibraryModal.vue";
import CommandPalette from "~/components/designer/CommandPalette.vue";
import type { DesignerLayerItem } from "~/components/designer/DesignerLayersPanel.vue";
import type {
	DesignToken,
	TokenCategory,
} from "~/components/designer/DesignTokensPanel.vue";
import DesignTokensPanel from "~/components/designer/DesignTokensPanel.vue";
import ExportModal from "~/components/designer/ExportModal.vue";
import ShortcutsModal from "~/components/designer/ShortcutsModal.vue";
import TemplatesModal from "~/components/designer/TemplatesModal.vue";
import EditorCanvas from "~/components/editor/Canvas.vue";
import { useDesignerDocument } from "~/composables/useDesignerDocument";

const route = useRoute();
const projectId = computed(() => route.params.id as string);

const canvasId = `designer-${projectId.value}`;
const canvasComponent = ref<{ canvas: Ref<fabric.Canvas | null> } | null>(null);

const doc = useDesignerDocument(projectId.value);

const viewportRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;
let resizeRaf: number | null = null;

const uiError = ref<string | null>(null);

const setUiError = (message: string) => {
	uiError.value = message;
};

const clearUiError = () => {
	uiError.value = null;
};

const imageModalOpen = ref(false);
const imageUrl = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

const exportModalOpen = ref(false);
const exportOptions = ref({
	format: "png" as "png" | "svg" | "json",
	multiplier: 2,
	includeBackground: true,
	selectionOnly: false,
});

const artboardModalOpen = ref(false);
const pendingArtboard = ref({ width: 1200, height: 800 });

const assetLibraryModalOpen = ref(false);
const templatesModalOpen = ref(false);
const shortcutsModalOpen = ref(false);
const commandPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);

const commands = computed(() => [
	{ id: "undo", label: "Undo", shortcut: "Ctrl+Z", action: () => doc.undo() },
	{ id: "redo", label: "Redo", shortcut: "Ctrl+Y", action: () => doc.redo() },
	{
		id: "save",
		label: "Save Project",
		shortcut: "Ctrl+S",
		action: () => doc.save(),
	},
	{
		id: "duplicate",
		label: "Duplicate Selected",
		shortcut: "Ctrl+D",
		action: () => doc.duplicateSelected(),
	},
	{
		id: "delete",
		label: "Delete Selected",
		shortcut: "Delete",
		action: () => doc.deleteSelected(),
	},
	{
		id: "zoom-in",
		label: "Zoom In",
		shortcut: "Ctrl++",
		action: () => doc.zoomIn(),
	},
	{
		id: "zoom-out",
		label: "Zoom Out",
		shortcut: "Ctrl+-",
		action: () => doc.zoomOut(),
	},
	{
		id: "reset-zoom",
		label: "Reset Zoom",
		shortcut: "Ctrl+0",
		action: () => doc.resetZoom(),
	},
	{ id: "add-text", label: "Add Text", action: () => doc.addText() },
	{
		id: "add-rectangle",
		label: "Add Rectangle",
		action: () => doc.addRectangle(),
	},
	{ id: "add-circle", label: "Add Circle", action: () => doc.addCircle() },
	{
		id: "toggle-fullscreen",
		label: "Toggle Fullscreen",
		shortcut: "F11",
		action: () => toggleFullscreen(),
	},
	{
		id: "toggle-tokens",
		label: "Toggle Design Tokens",
		action: () => showTokensPanel.value = !showTokensPanel.value,
	},
]);

const showTokensPanel = ref(false);
const selectedTokenId = ref<string | null>(null);

// Sample design tokens data - can be replaced with actual data from API/composable
const tokenCategories = ref<TokenCategory[]>([
	{
		id: "colors",
		name: "Colors",
		tokens: [
			{
				id: "primary",
				name: "Primary",
				type: "color",
				value: "#3B82F6",
				category: "colors",
			},
			{
				id: "secondary",
				name: "Secondary",
				type: "color",
				value: "#8B5CF6",
				category: "colors",
			},
			{
				id: "success",
				name: "Success",
				type: "color",
				value: "#10B981",
				category: "colors",
			},
			{
				id: "warning",
				name: "Warning",
				type: "color",
				value: "#F59E0B",
				category: "colors",
			},
			{
				id: "danger",
				name: "Danger",
				type: "color",
				value: "#EF4444",
				category: "colors",
			},
		],
	},
	{
		id: "spacing",
		name: "Spacing",
		tokens: [
			{ id: "xs", name: "XS", type: "spacing", value: 4, category: "spacing" },
			{ id: "sm", name: "SM", type: "spacing", value: 8, category: "spacing" },
			{ id: "md", name: "MD", type: "spacing", value: 16, category: "spacing" },
			{ id: "lg", name: "LG", type: "spacing", value: 24, category: "spacing" },
			{ id: "xl", name: "XL", type: "spacing", value: 32, category: "spacing" },
		],
	},
	{
		id: "typography",
		name: "Typography",
		tokens: [
			{
				id: "font-sans",
				name: "Font Sans",
				type: "typography",
				value: "Inter, sans-serif",
				category: "typography",
			},
			{
				id: "font-mono",
				name: "Font Mono",
				type: "typography",
				value: "JetBrains Mono, monospace",
				category: "typography",
			},
		],
	},
	{
		id: "shadows",
		name: "Shadows",
		tokens: [
			{
				id: "shadow-sm",
				name: "Shadow SM",
				type: "shadow",
				value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
				category: "shadows",
			},
			{
				id: "shadow-md",
				name: "Shadow MD",
				type: "shadow",
				value: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
				category: "shadows",
			},
			{
				id: "shadow-lg",
				name: "Shadow LG",
				type: "shadow",
				value: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
				category: "shadows",
			},
		],
	},
]);

const handleSelectToken = (tokenId: string) => {
	selectedTokenId.value = tokenId;
	// Apply token to selected object
	const token = tokenCategories.value.flatMap(c => c.tokens).find(t =>
		t.id === tokenId
	);
	if (token && doc.selected.value) {
		if (token.type === "color") {
			doc.updateProperty("fill", token.value);
		}
	}
};

const handleCreateToken = (category: string) => {
	const newToken: DesignToken = {
		id: `token-${Date.now()}`,
		name: "New Token",
		type: category === "colors"
			? "color"
			: category === "spacing"
			? "spacing"
			: category === "typography"
			? "typography"
			: "shadow",
		value: category === "colors"
			? "#000000"
			: category === "spacing"
			? 16
			: "default",
		category,
	};
	const cat = tokenCategories.value.find(c => c.id === category);
	if (cat) {
		cat.tokens.push(newToken);
	}
};

const handleUpdateToken = (tokenId: string, updates: Partial<DesignToken>) => {
	for (const cat of tokenCategories.value) {
		const token = cat.tokens.find(t => t.id === tokenId);
		if (token) {
			Object.assign(token, updates);
			break;
		}
	}
};

const handleDeleteToken = (tokenId: string) => {
	for (const cat of tokenCategories.value) {
		const index = cat.tokens.findIndex(t => t.id === tokenId);
		if (index > -1) {
			cat.tokens.splice(index, 1);
			break;
		}
	}
	if (selectedTokenId.value === tokenId) {
		selectedTokenId.value = null;
	}
};

const handleDuplicateToken = (tokenId: string) => {
	for (const cat of tokenCategories.value) {
		const token = cat.tokens.find(t => t.id === tokenId);
		if (token) {
			const newToken: DesignToken = {
				...token,
				id: `token-${Date.now()}`,
				name: `${token.name} (Copy)`,
			};
			cat.tokens.push(newToken);
			break;
		}
	}
};

const handleImportTokens = () => {
	// Handle import - could open file picker
	console.log("Import tokens");
};

const handleExportTokens = () => {
	// Handle export - download as JSON
	const data = JSON.stringify(tokenCategories.value, null, 2);
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `design-tokens-${projectId.value}.json`;
	a.click();
	URL.revokeObjectURL(url);
};

// Fullscreen state
const isFullscreen = ref(false);

const toggleFullscreen = async () => {
	try {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
			isFullscreen.value = true;
		} else {
			await document.exitFullscreen();
			isFullscreen.value = false;
		}
	} catch (err) {
		console.error("Fullscreen error:", err);
	}
};

// Listen for fullscreen changes
const handleFullscreenChange = () => {
	isFullscreen.value = !!document.fullscreenElement;
};

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
		sizes[i]
	}`;
};

const isDragging = ref(false);

const handleDragOver = (e: DragEvent) => {
	e.preventDefault();
	isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
	e.preventDefault();
	isDragging.value = false;
};

const handleDrop = async (e: DragEvent) => {
	e.preventDefault();
	isDragging.value = false;

	const files = e.dataTransfer?.files;
	if (!files || files.length === 0) return;

	const file = files[0];
	if (!file || !file.type.startsWith("image/")) {
		setUiError("Please drop an image file");
		return;
	}

	try {
		isUploading.value = true;
		const url = await uploadImage(file);
		await doc.addImage(url);
		clearUiError();
	} catch (err) {
		console.error("Failed to upload dropped image:", err);
		setUiError("Failed to upload image. Please try again.");
	} finally {
		isUploading.value = false;
	}
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		selectedFile.value = file;
		imageUrl.value = "";
	}
};

const clearSelectedFile = () => {
	selectedFile.value = null;
	if (fileInputRef.value) {
		fileInputRef.value.value = "";
	}
};

const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await $fetch<{ success: boolean; url: string }>(
		"/api/designer/image-upload",
		{
			method: "POST",
			body: formData,
		},
	);

	if (!response.success || !response.url) {
		throw new Error("Failed to upload image");
	}

	return response.url;
};

const getCanvas = () => {
	const canvas = canvasComponent.value?.canvas;
	if (!canvas) return null;
	return canvas;
};

const ensureInitialized = async () => {
	await nextTick();
	const canvas = getCanvas();
	if (!canvas) return;

	await doc.init(canvas, doc.artboard.width, doc.artboard.height);
	await nextTick();
	const el = viewportRef.value;
	if (el) {
		doc.fitToViewport(el.clientWidth, el.clientHeight);
	}
};

const setupViewportObserver = () => {
	const el = viewportRef.value;
	if (!el) return;
	if (typeof ResizeObserver === "undefined") return;

	resizeObserver?.disconnect();
	resizeObserver = new ResizeObserver(() => {
		if (resizeRaf != null) {
			cancelAnimationFrame(resizeRaf);
		}
		resizeRaf = requestAnimationFrame(() => {
			resizeRaf = null;
			doc.fitToViewport(el.clientWidth, el.clientHeight);
		});
	});
	resizeObserver.observe(el);
};

const openImageModal = () => {
	imageUrl.value = "";
	imageModalOpen.value = true;
};

const openExportModal = () => {
	exportModalOpen.value = true;
};

const openArtboardModal = () => {
	pendingArtboard.value = { ...doc.artboard };
	artboardModalOpen.value = true;
};

const handleUpdateArtboard = (artboard: { width: number; height: number }) => {
	pendingArtboard.value = artboard;
};

const handleApplyArtboard = () => {
	doc.artboard.width = pendingArtboard.value.width;
	doc.artboard.height = pendingArtboard.value.height;
	artboardModalOpen.value = false;
};

const openAssetLibraryModal = () => {
	assetLibraryModalOpen.value = true;
};

const handleSelectAsset = async (asset: { url: string; type: string }) => {
	if (asset.type === "image") {
		try {
			await doc.addImage(asset.url);
			assetLibraryModalOpen.value = false;
			clearUiError();
		} catch (err) {
			console.error("Failed to add asset:", err);
			setUiError("Failed to add asset. Please try again.");
		}
	}
};

const openTemplatesModal = () => {
	templatesModalOpen.value = true;
};

const openShortcutsModal = () => {
	shortcutsModalOpen.value = true;
};

const handleSelectTemplate = async (template: { objects: any[] }) => {
	try {
		await doc.loadTemplate(template.objects);
		templatesModalOpen.value = false;
		clearUiError();
	} catch (err) {
		console.error("Failed to load template:", err);
		setUiError("Failed to load template. Please try again.");
	}
};

const handleExport = () => {
	const opts = exportOptions.value;
	if (opts.format === "png") {
		doc.exportPng({
			multiplier: opts.multiplier,
			selectionOnly: opts.selectionOnly,
		});
	} else if (opts.format === "svg") {
		doc.exportSvg();
	} else if (opts.format === "json") {
		doc.exportJson();
	}
	exportModalOpen.value = false;
};

const isEditableTarget = (target: EventTarget | null) => {
	const el = target as HTMLElement | null;
	if (!el) return false;
	const tag = el.tagName?.toLowerCase();
	if (tag === "input" || tag === "textarea" || tag === "select") return true;
	return el.isContentEditable === true;
};

const handleAddImage = async () => {
	if (selectedFile.value) {
		try {
			isUploading.value = true;
			const url = await uploadImage(selectedFile.value);
			await doc.addImage(url);
			imageModalOpen.value = false;
			clearSelectedFile();
			imageUrl.value = "";
			clearUiError();
		} catch (err) {
			console.error("Failed to upload image:", err);
			setUiError("Failed to upload image. Please try again.");
		} finally {
			isUploading.value = false;
		}
	} else if (imageUrl.value.trim()) {
		try {
			await doc.addImage(imageUrl.value.trim());
			imageModalOpen.value = false;
			imageUrl.value = "";
			clearUiError();
		} catch (err) {
			console.error("Failed to add image:", err);
			setUiError("Failed to load image. Please check the URL and try again.");
		}
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (isEditableTarget(e.target)) return;

	const mod = e.ctrlKey || e.metaKey;
	if (mod && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
		e.preventDefault();
		void doc.undo();
		return;
	}
	if (
		mod
		&& ((e.key === "y" || e.key === "Y")
			|| (e.shiftKey && (e.key === "z" || e.key === "Z")))
	) {
		e.preventDefault();
		void doc.redo();
		return;
	}
	if (mod && (e.key === "s" || e.key === "S")) {
		e.preventDefault();
		doc.save();
		return;
	}
	if (mod && (e.key === "d" || e.key === "D")) {
		e.preventDefault();
		doc.duplicateSelected();
		return;
	}
	if (mod && (e.key === "+" || e.key === "=")) {
		e.preventDefault();
		doc.zoomIn();
		return;
	}
	if (mod && (e.key === "-")) {
		e.preventDefault();
		doc.zoomOut();
		return;
	}
	if (mod && e.key === "0") {
		e.preventDefault();
		doc.resetZoom();
		return;
	}
	if (e.key === "Delete" || e.key === "Backspace") {
		e.preventDefault();
		doc.deleteSelected();
		return;
	}
	if (mod && e.key === "k") {
		e.preventDefault();
		commandPaletteRef.value?.openPalette();
		return;
	}
};

onMounted(() => {
	void ensureInitialized();
	setupViewportObserver();
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("wheel", doc.handleWheel, { passive: false });
	document.addEventListener("mousedown", doc.handleMouseDown);
	document.addEventListener("mousemove", doc.handleMouseMove);
	document.addEventListener("mouseup", doc.handleMouseUp);
	document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
	document.removeEventListener("wheel", doc.handleWheel);
	document.removeEventListener("mousedown", doc.handleMouseDown);
	document.removeEventListener("mousemove", doc.handleMouseMove);
	document.removeEventListener("mouseup", doc.handleMouseUp);
	document.removeEventListener("fullscreenchange", handleFullscreenChange);
	resizeObserver?.disconnect();
	resizeObserver = null;
	if (resizeRaf != null) {
		cancelAnimationFrame(resizeRaf);
		resizeRaf = null;
	}
	doc.dispose();
});

onBeforeRouteLeave((to, from, next) => {
	if (doc.isDirty.value) {
		const answer = window.confirm(
			"You have unsaved changes. Are you sure you want to leave?",
		);
		if (answer) {
			next();
		} else {
			next(false);
		}
	} else {
		next();
	}
});
</script>

<template>
	<div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 overflow-hidden">
		<div class="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<NuxtLink
					to="/"
					class="text-sm text-gray-600 dark:text-gray-200 hover:underline"
				>Home</NuxtLink>
				<span class="text-gray-300 dark:text-gray-500">/</span>
				<h1 class="text-sm font-semibold text-gray-900 dark:text-white">
					Web Designer
				</h1>
				<span class="text-xs text-gray-500 dark:text-gray-300">{{
					projectId
				}}</span>
			</div>
			<div class="text-xs text-gray-500 dark:text-gray-300">
				Ctrl+Z / Ctrl+Y / Delete / Ctrl+D
				<span
					v-if="doc.isDirty.value"
					class="text-orange-500 font-semibold ml-2"
				>• Unsaved</span>
				<span v-else class="text-green-600 dark:text-green-400 ml-2"
				>• Saved</span>
			</div>
		</div>
		<div
			v-if="uiError"
			class="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800"
		>
			<div class="flex items-start justify-between gap-3">
				<div class="text-sm text-red-800 dark:text-red-200">{{ uiError }}</div>
				<button
					type="button"
					class="text-sm text-red-700 dark:text-red-200 hover:underline"
					@click="clearUiError"
				>
					Dismiss
				</button>
			</div>
		</div>

		<DesignerToolbar
			:can-undo="doc.canUndo.value"
			:can-redo="doc.canRedo.value"
			:is-fullscreen="isFullscreen"
			@add-text="doc.addText"
			@add-rectangle="doc.addRectangle"
			@add-circle="doc.addCircle"
			@add-polygon="doc.addPolygon"
			@add-star="doc.addStar"
			@add-pen="doc.enterPenMode"
			@undo="doc.undo"
			@redo="doc.redo"
			@bring-forward="doc.bringForward"
			@send-backward="doc.sendBackward"
			@bring-to-front="doc.bringToFront"
			@send-to-back="doc.sendToBack"
			@align-left="() => doc.alignObjects('left')"
			@align-center="() => doc.alignObjects('center')"
			@align-right="() => doc.alignObjects('right')"
			@align-top="() => doc.alignObjects('top')"
			@align-middle="() => doc.alignObjects('middle')"
			@align-bottom="() => doc.alignObjects('bottom')"
			@group="doc.group"
			@ungroup="doc.ungroup"
			@save="() => void doc.save()"
			@export-png="openExportModal"
			@artboard-settings="openArtboardModal"
			@asset-library="openAssetLibraryModal"
			@templates="openTemplatesModal"
			@shortcuts="openShortcutsModal"
			@toggle-fullscreen="toggleFullscreen"
			@toggle-tokens="showTokensPanel = !showTokensPanel"
		/>

		<div class="flex-1 flex overflow-hidden">
			<div
				ref="viewportRef"
				class="flex-1 flex items-center justify-center overflow-auto p-6 relative"
				:class="{ 'bg-blue-50/50 dark:bg-blue-900/20': isDragging }"
				@dragover="handleDragOver"
				@dragleave="handleDragLeave"
				@drop="handleDrop"
			>
				<!-- Drag Overlay -->
				<div
					v-if="isDragging"
					class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
				>
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-blue-400 p-8 text-center">
						<svg
							class="mx-auto h-12 w-12 text-blue-400 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p class="text-blue-600 dark:text-blue-400 font-medium">
							Drop image here
						</p>
					</div>
				</div>
				<!-- Accessibility: Skip to main content link -->
				<a
					href="#main-canvas"
					class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
				>
					Skip to canvas
				</a>
				<DesignerRulers
					:width="doc.artboard.width"
					:height="doc.artboard.height"
					:zoom="doc.zoomLevel.value"
					@add-guide="doc.addGuide"
				/>
				<div
					id="main-canvas"
					class="bg-white dark:bg-gray-700 rounded-xl shadow border border-gray-200 dark:border-gray-600 p-4"
				>
					<EditorCanvas
						ref="canvasComponent"
						:canvas-id="canvasId"
						:width="doc.artboard.width"
						:height="doc.artboard.height"
					/>
				</div>
			</div>

			<DesignerPropertiesPanel
				:selected="doc.selected.value"
				@update="doc.updateProperty"
				@add-shape="doc.addShape"
				@apply-text-style="doc.applyTextStyle"
				@apply-crop="doc.applyCrop"
				@rotate="doc.rotateSelected"
				@flip="doc.flipSelected"
				@distribute="doc.distributeObjects"
				@apply-artboard-preset="doc.setArtboardSize"
				@apply-pattern="doc.applyBackgroundPattern"
				@export="openExportModal"
				@add-comment="(comment) => doc.addComment(comment.x, comment.y, comment.text)"
				@resolve-comment="doc.resolveComment"
				@delete-comment="doc.deleteComment"
			/>
			<DesignerLayersPanel
				:layers="doc.layers.value"
				:selected-id="doc.selected.value?.id || null"
				@select="doc.selectLayer"
				@toggle-visible="doc.toggleLayerVisible"
				@toggle-locked="doc.toggleLayerLocked"
				@rename="doc.renameLayer"
			/>
		</div>
		<Modal :show="imageModalOpen" size="md" @close="imageModalOpen = false">
			<div class="p-6">
				<h2 class="text-lg font-medium text-gray-900 dark:text-white">
					Add Image
				</h2>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Upload an image from your computer or enter a URL.
				</p>
				<div class="mt-4 space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Image URL</label>
						<input
							v-model="imageUrl"
							type="text"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
							placeholder="https://example.com/image.png"
						>
					</div>
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300 dark:border-gray-600">
							</div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span
								class="bg-white px-2 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
							>Or</span>
						</div>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Upload File</label>
						<div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6">
							<div class="space-y-1 text-center">
								<svg
									class="mx-auto h-12 w-12 text-gray-400"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 48 48"
									aria-hidden="true"
								>
									<path
										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<div class="flex text-sm text-gray-600 dark:text-gray-400">
									<label
										for="file-upload"
										class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-gray-700 dark:text-indigo-400 dark:hover:text-indigo-300"
									>
										<span>Upload a file</span>
										<input
											id="file-upload"
											ref="fileInputRef"
											name="file-upload"
											type="file"
											class="sr-only"
											@change="handleFileSelect"
										>
									</label>
									<p class="pl-1">or drag and drop</p>
								</div>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									PNG, JPG, GIF up to 10MB
								</p>
							</div>
						</div>
						<div
							v-if="selectedFile"
							class="mt-2 text-sm text-gray-500 dark:text-gray-400"
						>
							Selected: {{ selectedFile.name }} ({{
								formatFileSize(selectedFile.size)
							}})
							<button
								class="ml-2 text-red-500 hover:text-red-700"
								@click="clearSelectedFile"
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button
					type="button"
					class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
					:disabled="isUploading"
					@click="handleAddImage"
				>
					<span v-if="isUploading">Uploading...</span>
					<span v-else>Add Image</span>
				</button>
				<button
					type="button"
					class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					@click="imageModalOpen = false"
				>
					Cancel
				</button>
			</div>
		</Modal>

		<ExportModal
			:isOpen="exportModalOpen"
			:options="exportOptions"
			@close="exportModalOpen = false"
			@export="handleExport"
		/>
		<ArtboardSettingsModal
			:isOpen="artboardModalOpen"
			:artboard="pendingArtboard"
			@close="artboardModalOpen = false"
			@update="handleUpdateArtboard"
			@apply="handleApplyArtboard"
		/>
		<AssetLibraryModal
			:isOpen="assetLibraryModalOpen"
			@close="assetLibraryModalOpen = false"
			@select="handleSelectAsset"
		/>
		<TemplatesModal
			:isOpen="templatesModalOpen"
			@close="templatesModalOpen = false"
			@select="handleSelectTemplate"
		/>
		<ShortcutsModal
			:isOpen="shortcutsModalOpen"
			@close="shortcutsModalOpen = false"
		/>
		<CommandPalette ref="commandPaletteRef" :commands="commands" />
	</div>
</template>
