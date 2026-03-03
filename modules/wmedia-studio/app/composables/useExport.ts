import type { ExportOptions } from "#shared/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useExport = () => {
	const exportAsPNG = async (element: HTMLElement, options: {
		quality?: number;
		scale?: number;
	} = {}) => {
		const canvas = await html2canvas(element, {
			scale: options.scale || 2,
			useCORS: true,
			allowTaint: true,
		});

		return canvas.toDataURL("image/png", options.quality || 1);
	};

	const exportAsJPG = async (element: HTMLElement, options: {
		quality?: number;
		scale?: number;
	} = {}) => {
		const canvas = await html2canvas(element, {
			scale: options.scale || 2,
			useCORS: true,
			allowTaint: true,
			backgroundColor: "#ffffff",
		});

		return canvas.toDataURL("image/jpeg", options.quality || 0.9);
	};

	const exportAsPDF = async (element: HTMLElement, options: {
		width?: number;
		height?: number;
		scale?: number;
	} = {}) => {
		const canvas = await html2canvas(element, {
			scale: options.scale || 2,
			useCORS: true,
			allowTaint: true,
		});

		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF({
			orientation: canvas.width > canvas.height ? "landscape" : "portrait",
			unit: "px",
			format: [canvas.width, canvas.height],
		});

		pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
		return pdf.output("datauristring");
	};

	const exportAsSVG = (element: HTMLElement) => {
		const svgData = new XMLSerializer().serializeToString(element);
		const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		return URL.createObjectURL(blob);
	};

	const downloadFile = (url: string, filename: string) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportProject = async (element: HTMLElement, options: ExportOptions) => {
		let dataUrl: string;

		switch (options.format) {
			case "png":
				dataUrl = await exportAsPNG(element, {
					quality: options.quality,
					scale: options.scale,
				});
				break;
			case "jpg":
				dataUrl = await exportAsJPG(element, {
					quality: options.quality,
					scale: options.scale,
				});
				break;
			case "pdf":
				dataUrl = await exportAsPDF(element, {
					width: options.width,
					height: options.height,
					scale: options.scale,
				});
				break;
			case "svg":
				dataUrl = exportAsSVG(element);
				break;
			default:
				throw new Error(`Unsupported export format: ${options.format}`);
		}

		return dataUrl;
	};

	return {
		exportAsPNG,
		exportAsJPG,
		exportAsPDF,
		exportAsSVG,
		downloadFile,
		exportProject,
	};
};
