<script setup lang="ts">
import type { DesignerSelectedObject } from "#shared/types/element";
import type * as fabric from "fabric";
import ArtboardSettingsModal from "~/components/designer/ArtboardSettingsModal.vue";
import AssetLibraryModal from "~/components/designer/AssetLibraryModal.vue";
import CommandPalette from "~/components/designer/CommandPalette.vue";
import type { DesignerLayerItem } from "~/components/designer/DesignerLayersPanel.vue";
import type { DesignToken, TokenCategory } from "~/components/designer/DesignTokensPanel.vue";
import DesignTokensPanel from "~/components/designer/DesignTokensPanel.vue";
import ExportModal from "~/components/designer/ExportModal.vue";
import ShortcutsModal from "~/components/designer/ShortcutsModal.vue";
import TemplatesModal from "~/components/designer/TemplatesModal.vue";
import EditorCanvas from "~/components/editor/Canvas.vue";
import { useDesignerCommands } from "~/composables/useDesignerCommands";
import { useDesignerDocument } from "~/composables/useDesignerDocument";
import { useDesignerFullscreen } from "~/composables/useDesignerFullscreen";
import { useDesignerModals } from "~/composables/useDesignerModals";
import { useDesignerTokens } from "~/composables/useDesignerTokens";
import { useDesignerUpload } from "~/composables/useDesignerUpload";

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

// Fullscreen
const { isFullscreen, toggleFullscreen } = useDesignerFullscreen();

// Tokens
const tokens = useDesignerTokens({
  projectId: projectId.value,
  onTokenSelect: (tokenId, token) => {
    if (token && doc.selected.value) {
      if (token.type === "color") {
        doc.updateProperty("fill", token.value);
      }
    }
  },
});

// Upload
const upload = useDesignerUpload({
  onUploadSuccess: (url) => {
    doc.addImage(url);
    clearUiError();
  },
  onUploadError: (error) => {
    setUiError(error);
  },
});

// Modals
const modals = useDesignerModals();

// Commands
const { commands, commandPaletteRef, openCommandPalette, handleKeydown } = useDesignerCommands({
  onUndo: () => doc.undo(),
  onRedo: () => doc.redo(),
  onSave: () => doc.save(),
  onDuplicate: () => doc.duplicateSelected(),
  onDelete: () => doc.deleteSelected(),
  onZoomIn: () => doc.zoomIn(),
  onZoomOut: () => doc.zoomOut(),
  onResetZoom: () => doc.resetZoom(),
  onToggleFullscreen: toggleFullscreen,
  onToggleTokens: tokens.toggleTokensPanel,
  onAddText: () => doc.addText(),
  onAddRectangle: () => doc.addRectangle(),
  onAddCircle: () => doc.addCircle(),
  onOpenCommandPalette: openCommandPalette,
});

const handleSelectAsset = async (asset: { url: string; type: string }) => {
  if (asset.type === "image") {
    try {
      await doc.addImage(asset.url);
      modals.assetLibraryModalOpen.value = false;
      clearUiError();
    } catch (err) {
      console.error("Failed to add asset:", err);
      setUiError("Failed to add asset. Please try again.");
    }
  }
};

const handleSelectTemplate = async (template: { objects: any[] }) => {
  try {
    await doc.loadTemplate(template.objects);
    modals.templatesModalOpen.value = false;
    clearUiError();
  } catch (err) {
    console.error("Failed to load template:", err);
    setUiError("Failed to load template. Please try again.");
  }
};

const handleExport = () => {
  const opts = modals.exportOptions.value;
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
  modals.exportModalOpen.value = false;
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

const openArtboardModal = () => {
  modals.openArtboardModal(doc.artboard);
};

const handleApplyArtboard = () => {
  doc.artboard.width = modals.pendingArtboard.value.width;
  doc.artboard.height = modals.pendingArtboard.value.height;
  modals.artboardModalOpen.value = false;
};

const handleDrop = async (e: DragEvent) => {
  const url = await upload.handleDrop(e);
  if (url) {
    await doc.addImage(url);
  }
};

const handleAddImage = async () => {
  const url = await upload.handleAddImage();
  if (url) {
    modals.imageModalOpen.value = false;
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
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("wheel", doc.handleWheel);
  document.removeEventListener("mousedown", doc.handleMouseDown);
  document.removeEventListener("mousemove", doc.handleMouseMove);
  document.removeEventListener("mouseup", doc.handleMouseUp);
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
    const answer = window.confirm("You have unsaved changes. Are you sure you want to leave?");
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
			@export-png="modals.openExportModal"
			@artboard-settings="openArtboardModal"
			@asset-library="modals.openAssetLibraryModal"
			@templates="modals.openTemplatesModal"
			@shortcuts="modals.openShortcutsModal"
			@toggle-fullscreen="toggleFullscreen"
			@toggle-tokens="tokens.toggleTokensPanel"
		/>

		<div class="flex-1 flex overflow-hidden">
			<div
				ref="viewportRef"
				class="flex-1 flex items-center justify-center overflow-auto p-6 relative"
				:class="{ 'bg-blue-50/50 dark:bg-blue-900/20': upload.isDragging.value }"
				@dragover="upload.handleDragOver"
				@dragleave="upload.handleDragLeave"
				@drop="handleDrop"
			>
				<!-- Drag Overlay -->
				<div
					v-if="upload.isDragging.value"
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
				@export="modals.openExportModal"
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
		<Modal :show="modals.imageModalOpen.value" size="md" @close="modals.imageModalOpen.value = false">
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
							v-model="upload.imageUrl.value"
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
											ref="upload.fileInputRef.value"
											name="file-upload"
											type="file"
											class="sr-only"
											@change="upload.handleFileSelect"
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
							v-if="upload.selectedFile.value"
							class="mt-2 text-sm text-gray-500 dark:text-gray-400"
						>
							Selected: {{ upload.selectedFile.value.name }} ({{
								upload.formatFileSize(upload.selectedFile.value.size)
							}})
							<button
								class="ml-2 text-red-500 hover:text-red-700"
								@click="upload.clearSelectedFile"
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
					:disabled="upload.isUploading.value"
					@click="handleAddImage"
				>
					<span v-if="upload.isUploading.value">Uploading...</span>
					<span v-else>Add Image</span>
				</button>
				<button
					type="button"
					class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					@click="modals.imageModalOpen.value = false"
				>
					Cancel
				</button>
			</div>
		</Modal>

		<ExportModal
			:isOpen="modals.exportModalOpen.value"
			:options="modals.exportOptions.value"
			@close="modals.exportModalOpen.value = false"
			@export="handleExport"
		/>
		<ArtboardSettingsModal
			:isOpen="modals.artboardModalOpen.value"
			:artboard="modals.pendingArtboard.value"
			@close="modals.artboardModalOpen.value = false"
			@update="modals.handleUpdateArtboard"
			@apply="handleApplyArtboard"
		/>
		<AssetLibraryModal
			:isOpen="modals.assetLibraryModalOpen.value"
			@close="modals.assetLibraryModalOpen.value = false"
			@select="handleSelectAsset"
		/>
		<TemplatesModal
			:isOpen="modals.templatesModalOpen.value"
			@close="modals.templatesModalOpen.value = false"
			@select="handleSelectTemplate"
		/>
		<ShortcutsModal
			:isOpen="modals.shortcutsModalOpen.value"
			@close="modals.shortcutsModalOpen.value = false"
		/>
		<CommandPalette ref="commandPaletteRef" :commands="commands" />
	</div>
</template>
