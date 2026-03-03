import { ref } from "vue";

export interface ModalState {
	image: boolean;
	export: boolean;
	artboard: boolean;
	assetLibrary: boolean;
	templates: boolean;
	shortcuts: boolean;
}

export interface ExportOptions {
	format: "png" | "svg" | "json";
	multiplier: number;
	includeBackground: boolean;
	selectionOnly: boolean;
}

export interface ArtboardState {
	width: number;
	height: number;
}

export const useDesignerModals = () => {
	const imageModalOpen = ref(false);
	const exportModalOpen = ref(false);
	const artboardModalOpen = ref(false);
	const assetLibraryModalOpen = ref(false);
	const templatesModalOpen = ref(false);
	const shortcutsModalOpen = ref(false);

	const exportOptions = ref<ExportOptions>({
		format: "png",
		multiplier: 2,
		includeBackground: true,
		selectionOnly: false,
	});

	const pendingArtboard = ref<ArtboardState>({ width: 1200, height: 800 });

	const openImageModal = () => {
		imageModalOpen.value = true;
	};

	const openExportModal = () => {
		exportModalOpen.value = true;
	};

	const openArtboardModal = (currentArtboard?: ArtboardState) => {
		if (currentArtboard) {
			pendingArtboard.value = { ...currentArtboard };
		}
		artboardModalOpen.value = true;
	};

	const openAssetLibraryModal = () => {
		assetLibraryModalOpen.value = true;
	};

	const openTemplatesModal = () => {
		templatesModalOpen.value = true;
	};

	const openShortcutsModal = () => {
		shortcutsModalOpen.value = true;
	};

	const closeAllModals = () => {
		imageModalOpen.value = false;
		exportModalOpen.value = false;
		artboardModalOpen.value = false;
		assetLibraryModalOpen.value = false;
		templatesModalOpen.value = false;
		shortcutsModalOpen.value = false;
	};

	const handleUpdateArtboard = (artboard: ArtboardState) => {
		pendingArtboard.value = artboard;
	};

	const handleApplyArtboard = (onApply?: (artboard: ArtboardState) => void) => {
		onApply?.(pendingArtboard.value);
		artboardModalOpen.value = false;
	};

	return {
		imageModalOpen,
		exportModalOpen,
		artboardModalOpen,
		assetLibraryModalOpen,
		templatesModalOpen,
		shortcutsModalOpen,
		exportOptions,
		pendingArtboard,
		openImageModal,
		openExportModal,
		openArtboardModal,
		openAssetLibraryModal,
		openTemplatesModal,
		openShortcutsModal,
		closeAllModals,
		handleUpdateArtboard,
		handleApplyArtboard,
	};
};
