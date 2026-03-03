import type { ExportOptions as SharedExportOptions, ExportResult as SharedExportResult } from "#shared/types/project";
import type { Canvas } from "fabric";
import { ref } from "vue";

export interface CanvasExportOptions extends Omit<SharedExportOptions, "format" | "quality" | "transparent"> {
	format: "png" | "jpg" | "jpeg" | "svg" | "pdf";
	quality?: number;
	multiplier?: number;
	width?: number;
	height?: number;
	left?: number;
	top?: number;
	transparent?: boolean;
	backgroundColor?: string;
}

export interface CanvasExportResult extends Omit<SharedExportResult, "url"> {
	blob: Blob;
	url: string;
	size: number;
	format: string;
}

export function useExportFormats(canvas: Ref<Canvas | null>) {
	const isExporting = ref(false);
	const exportProgress = ref(0);
	const exportError = ref<string | null>(null);

	const exportToPNG = async (options: Partial<CanvasExportOptions> = {}): Promise<CanvasExportResult | null> => {
		if (!canvas.value) return null;

		isExporting.value = true;
		exportProgress.value = 0;
		exportError.value = null;

		try {
			const dataUrl = canvas.value.toDataURL({
				format: "png",
				quality: options.quality || 1,
				multiplier: options.multiplier || 1,
				left: options.left,
				top: options.top,
				width: options.width,
				height: options.height,
			});

			exportProgress.value = 50;

			const blob = await dataURLToBlob(dataUrl);
			const url = URL.createObjectURL(blob);

			exportProgress.value = 100;

			return {
				blob,
				url,
				size: blob.size,
				format: "png",
			};
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			return null;
		} finally {
			isExporting.value = false;
		}
	};

	const exportToJPG = async (options: Partial<CanvasExportOptions> = {}): Promise<CanvasExportResult | null> => {
		if (!canvas.value) return null;

		isExporting.value = true;
		exportProgress.value = 0;
		exportError.value = null;

		try {
			const dataUrl = canvas.value.toDataURL({
				format: "jpeg",
				quality: options.quality || 0.9,
				multiplier: options.multiplier || 1,
				left: options.left,
				top: options.top,
				width: options.width,
				height: options.height,
			} as any);

			exportProgress.value = 50;

			const blob = await dataURLToBlob(dataUrl);
			const url = URL.createObjectURL(blob);

			exportProgress.value = 100;

			return {
				blob,
				url,
				size: blob.size,
				format: "jpg",
			};
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			return null;
		} finally {
			isExporting.value = false;
		}
	};

	const exportToSVG = async (options: Partial<CanvasExportOptions> = {}): Promise<CanvasExportResult | null> => {
		if (!canvas.value) return null;

		isExporting.value = true;
		exportProgress.value = 0;
		exportError.value = null;

		try {
			const svgData = canvas.value.toSVG({
				viewBox: {
					x: options.left || 0,
					y: options.top || 0,
					width: options.width || canvas.value.width,
					height: options.height || canvas.value.height,
				},
			});

			exportProgress.value = 50;

			const blob = new Blob([svgData], { type: "image/svg+xml" });
			const url = URL.createObjectURL(blob);

			exportProgress.value = 100;

			return {
				blob,
				url,
				size: blob.size,
				format: "svg",
			};
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			return null;
		} finally {
			isExporting.value = false;
		}
	};

	const exportToPDF = async (options: Partial<CanvasExportOptions> = {}): Promise<CanvasExportResult | null> => {
		if (!canvas.value) return null;

		isExporting.value = true;
		exportProgress.value = 0;
		exportError.value = null;

		try {
			const dataUrl = canvas.value.toDataURL({
				format: "png",
				quality: 1,
				multiplier: options.multiplier || 2,
				left: options.left,
				top: options.top,
				width: options.width,
				height: options.height,
			});

			exportProgress.value = 30;

			const pdfWidth = options.width || canvas.value.width;
			const pdfHeight = options.height || canvas.value.height;

			const pdfData = await generatePDF(dataUrl, pdfWidth, pdfHeight);

			exportProgress.value = 100;

			return pdfData;
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			return null;
		} finally {
			isExporting.value = false;
		}
	};

	const exportCanvas = async (
		format: CanvasExportOptions["format"],
		options: Partial<CanvasExportOptions> = {},
	): Promise<CanvasExportResult | null> => {
		switch (format) {
			case "png":
				return exportToPNG(options);
			case "jpg":
			case "jpeg":
				return exportToJPG(options);
			case "svg":
				return exportToSVG(options);
			case "pdf":
				return exportToPDF(options);
			default:
				return null;
		}
	};

	const downloadExport = (result: CanvasExportResult, filename: string) => {
		const link = document.createElement("a");
		link.href = result.url;
		link.download = `${filename}.${result.format}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportAndDownload = async (
		format: CanvasExportOptions["format"],
		filename: string,
		options: Partial<CanvasExportOptions> = {},
	) => {
		const result = await exportCanvas(format, options);
		if (result) {
			downloadExport(result, filename);
		}
		return result;
	};

	const getExportSize = (format: CanvasExportOptions["format"], multiplier: number = 1) => {
		if (!canvas.value) return { width: 0, height: 0 };

		const width = (canvas.value.width || 0) * multiplier;
		const height = (canvas.value.height || 0) * multiplier;

		return { width, height };
	};

	const getEstimatedFileSize = (
		format: CanvasExportOptions["format"],
		quality: number = 0.9,
		multiplier: number = 1,
	) => {
		const { width, height } = getExportSize(format, multiplier);
		const pixels = width * height;

		let bytesPerPixel = 0;

		switch (format) {
			case "png":
				bytesPerPixel = 4;
				break;
			case "jpg":
			case "jpeg":
				bytesPerPixel = 3 * quality;
				break;
			case "svg":
				return Math.round(pixels * 0.01);
			case "pdf":
				bytesPerPixel = 4;
				break;
		}

		return Math.round(pixels * bytesPerPixel);
	};

	return {
		isExporting,
		exportProgress,
		exportError,
		exportToPNG,
		exportToJPG,
		exportToSVG,
		exportToPDF,
		exportCanvas,
		downloadExport,
		exportAndDownload,
		getExportSize,
		getEstimatedFileSize,
	};
}

async function dataURLToBlob(dataUrl: string): Promise<Blob> {
	const response = await fetch(dataUrl);
	return response.blob();
}

async function generatePDF(imageDataUrl: string, width: number, height: number): Promise<CanvasExportResult> {
	const { jsPDF } = await import("jspdf");

	const pdf = new jsPDF({
		orientation: width > height ? "landscape" : "portrait",
		unit: "px",
		format: [width, height],
	});

	pdf.addImage(imageDataUrl, "PNG", 0, 0, width, height);
	const pdfBlob = pdf.output("blob");
	const url = URL.createObjectURL(pdfBlob);

	return {
		blob: pdfBlob,
		url,
		size: pdfBlob.size,
		format: "pdf",
	};
}
