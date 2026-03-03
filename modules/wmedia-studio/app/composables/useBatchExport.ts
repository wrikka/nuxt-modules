import type { Canvas } from "fabric";
import { computed, ref } from "vue";
import type { CanvasExportOptions, CanvasExportResult } from "./useExportFormats";

export interface BatchExportItem {
	id: string;
	projectId: string;
	projectName: string;
	format: CanvasExportOptions["format"];
	options: CanvasExportOptions;
	status: "pending" | "processing" | "completed" | "failed";
	result?: CanvasExportResult;
	error?: string;
	progress: number;
}

export function useBatchExport(canvas: Ref<Canvas | null>) {
	const queue = ref<BatchExportItem[]>([]);
	const isProcessing = ref(false);
	const currentItem = ref<BatchExportItem | null>(null);

	const pendingItems = computed(() => queue.value.filter(item => item.status === "pending"));
	const completedItems = computed(() => queue.value.filter(item => item.status === "completed"));
	const failedItems = computed(() => queue.value.filter(item => item.status === "failed"));

	const addToQueue = (
		projectId: string,
		projectName: string,
		format: CanvasExportOptions["format"],
		options: CanvasExportOptions,
	) => {
		const item: BatchExportItem = {
			id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			projectId,
			projectName,
			format,
			options,
			status: "pending",
			progress: 0,
		};
		queue.value.push(item);
		return item;
	};

	const processQueue = async () => {
		if (isProcessing.value || pendingItems.value.length === 0) return;

		isProcessing.value = true;

		while (pendingItems.value.length > 0) {
			const item = pendingItems.value[0];
			if (!item) break;
			currentItem.value = item;

			await processItem(item);

			if (item.status === "failed") {
				break;
			}
		}

		isProcessing.value = false;
		currentItem.value = null;
	};

	const processItem = async (item: BatchExportItem) => {
		item.status = "processing";
		item.progress = 0;

		try {
			const dataUrl = canvas.value?.toDataURL({
				format: item.format === "jpeg" ? "jpeg" : item.format === "svg" ? "svg" : "png",
				quality: item.options.quality || 1,
				multiplier: item.options.multiplier || 1,
				left: item.options.left,
				top: item.options.top,
				width: item.options.width,
				height: item.options.height,
				backgroundColor: item.options.backgroundColor,
			} as any);

			item.progress = 50;

			if (!dataUrl) {
				throw new Error("Failed to generate data URL");
			}

			const blob = await dataURLToBlob(dataUrl);
			const url = URL.createObjectURL(blob);

			item.result = {
				blob,
				url,
				size: blob.size,
				format: item.format,
			};

			item.status = "completed";
			item.progress = 100;
		} catch (error) {
			item.status = "failed";
			item.error = error instanceof Error ? error.message : "Export failed";
		}
	};

	const removeFromQueue = (itemId: string) => {
		queue.value = queue.value.filter(item => item.id !== itemId);
	};

	const clearQueue = () => {
		queue.value = [];
		isProcessing.value = false;
		currentItem.value = null;
	};

	const clearCompleted = () => {
		queue.value = queue.value.filter(item => item.status !== "completed");
	};

	const retryItem = async (itemId: string) => {
		const item = queue.value.find(i => i.id === itemId);
		if (!item) return;

		item.status = "pending";
		item.progress = 0;
		item.error = undefined;
		item.result = undefined;

		await processItem(item);
	};

	const downloadAll = async () => {
		const completed = completedItems.value;
		for (const item of completed) {
			if (item.result) {
				const link = document.createElement("a");
				link.href = item.result.url;
				link.download = `${item.projectName}.${item.result.format}`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	};

	const downloadItem = (itemId: string) => {
		const item = queue.value.find(i => i.id === itemId);
		if (!item?.result) return;

		const link = document.createElement("a");
		link.href = item.result.url;
		link.download = `${item.projectName}.${item.result.format}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const getQueueStats = () => {
		return {
			total: queue.value.length,
			pending: pendingItems.value.length,
			completed: completedItems.value.length,
			failed: failedItems.value.length,
			processing: isProcessing.value ? 1 : 0,
		};
	};

	return {
		queue,
		isProcessing,
		currentItem,
		pendingItems,
		completedItems,
		failedItems,
		addToQueue,
		processQueue,
		removeFromQueue,
		clearQueue,
		clearCompleted,
		retryItem,
		downloadAll,
		downloadItem,
		getQueueStats,
	};
}

async function dataURLToBlob(dataUrl: string): Promise<Blob> {
	const response = await fetch(dataUrl);
	return response.blob();
}
