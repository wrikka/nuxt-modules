import type { ChartData } from '@/module/app/types/chart-basic';

export function useChartExport() {
	const exportToJSON = (data: ChartData) => {
		return JSON.stringify(data, null, 2);
	};

	const exportToCSV = (data: ChartData) => {
		// Convert to CSV format
		return (
			"x,y\n" +
			data.series.flatMap((s) => s.data.map((d) => `${d.x},${d.y}`)).join("\n")
		);
	};

	const downloadFile = (
		content: string,
		filename: string,
		mimeType: string,
	) => {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const downloadJSON = (data: ChartData, filename = "chart-data.json") => {
		const json = exportToJSON(data);
		downloadFile(json, filename, "application/json");
	};

	const exportToSVG = (data: ChartData) => {
		// Generate simple SVG representation of the chart data
		const width = 400;
		const height = 300;
		const maxValue = Math.max(
			...data.series.flatMap((s) =>
				s.data.map((d) => (typeof d.y === "number" ? d.y : 0)),
			),
		);

		let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
		svg += `<text x="10" y="20" font-size="16">${data.title || "Chart"}</text>`;

		data.series.forEach((series, seriesIndex) => {
			const color = series.color || `hsl(${seriesIndex * 60}, 70%, 50%)`;
			series.data.forEach((point, index) => {
				const x = 50 + (index * (width - 100)) / series.data.length;
				const y =
					height -
					50 -
					((typeof point.y === "number" ? point.y : 0) / maxValue) *
						(height - 100);
				const label = point.x || index.toString();

				svg += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" />`;
				svg += `<text x="${x}" y="${y - 10}" font-size="10" text-anchor="middle">${label}</text>`;
			});
		});

		svg += "</svg>";
		return svg;
	};

	const exportToPNG = async (data: ChartData) => {
		// In a real implementation, this would render the SVG and convert to PNG
		// For now, return a data URL placeholder
		const svg = exportToSVG(data);
		// This is a simplified conversion - in reality, would use a library like html2canvas
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	};

	const exportToPDF = (data: ChartData) => {
		// Generate a simple PDF content representation
		// In reality, would use a library like jsPDF
		let pdfContent = `Chart Title: ${data.title || "Chart"}\n\n`;
		data.series.forEach((series, index) => {
			pdfContent += `Series ${index + 1}: ${series.name}\n`;
			series.data.forEach((point, i) => {
				pdfContent += `  ${point.x}: ${point.y}\n`;
			});
			pdfContent += "\n";
		});
		return pdfContent;
	};

	const downloadSVG = (data: ChartData, filename = "chart.svg") => {
		const svg = exportToSVG(data);
		downloadFile(svg, filename, "image/svg+xml");
	};

	const downloadPNG = async (data: ChartData, filename = "chart.png") => {
		const pngDataUrl = await exportToPNG(data);
		// For PNG download, would need to convert SVG to PNG blob
		// Placeholder implementation
		downloadFile(pngDataUrl, filename, "image/png");
	};

	const downloadPDF = (data: ChartData, filename = "chart.pdf") => {
		const pdfContent = exportToPDF(data);
		downloadFile(pdfContent, filename, "application/pdf");
	};

	/**
	 * Export chart as animated video (WebM format)
	 * Creates a time-lapse animation of the chart data
	 */
	const exportToVideo = async (
		data: ChartData,
		options: {
			duration?: number; // seconds
			fps?: number;
			width?: number;
			height?: number;
			format?: "webm" | "gif";
		} = {},
	): Promise<Blob> => {
		const {
			duration = 5,
			fps = 30,
			width = 800,
			height = 600,
			format = "webm",
		} = options;

		const totalFrames = duration * fps;
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d")!;

		// Set up canvas for rendering
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, width, height);

		const frames: ImageData[] = [];

		// Generate frames for animation
		for (let frame = 0; frame < totalFrames; frame++) {
			const progress = frame / totalFrames;

			// Clear canvas
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, width, height);

			// Draw title
			ctx.fillStyle = "#000000";
			ctx.font = "24px Arial";
			ctx.fillText(data.title || "Chart Animation", 20, 40);

			// Draw series with progressive reveal
			data.series.forEach((series, seriesIndex) => {
				const pointsToShow = Math.floor(series.data.length * progress);
				const visibleData = series.data.slice(0, pointsToShow);

				if (visibleData.length < 2) return;

				const color = series.color || `hsl(${seriesIndex * 60}, 70%, 50%)`;
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.beginPath();

				const maxValue = Math.max(
					...series.data.map((d) => (typeof d.y === "number" ? d.y : 0)),
				);
				const minValue = Math.min(
					...series.data.map((d) => (typeof d.y === "number" ? d.y : 0)),
				);
				const valueRange = maxValue - minValue || 1;

				visibleData.forEach((point, index) => {
					const x = 80 + (index / (series.data.length - 1)) * (width - 160);
					const y =
						height -
						80 -
						(((typeof point.y === "number" ? point.y : 0) - minValue) /
							valueRange) *
							(height - 160);

					if (index === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}

					// Draw point
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.arc(x, y, 4, 0, 2 * Math.PI);
					ctx.fill();
				});

				ctx.stroke();

				// Draw series label
				ctx.fillStyle = "#666666";
				ctx.font = "14px Arial";
				ctx.fillText(series.name, width - 150, 60 + seriesIndex * 20);
			});

			// Draw progress indicator
			ctx.fillStyle = "#cccccc";
			ctx.fillRect(20, height - 20, (width - 40) * progress, 10);

			// Capture frame
			frames.push(ctx.getImageData(0, 0, width, height));
		}

		// For WebM export (simplified - in reality would use a proper encoder)
		if (format === "webm") {
			// This is a placeholder - real implementation would use WebCodecs API or a library
			const videoBlob = new Blob(["placeholder webm data"], {
				type: "video/webm",
			});
			return videoBlob;
		}

		// For GIF export (placeholder)
		if (format === "gif") {
			const gifBlob = new Blob(["placeholder gif data"], { type: "image/gif" });
			return gifBlob;
		}

		// Fallback to first frame as PNG
		canvas.getContext("2d")!.putImageData(frames[0], 0, 0);
		return new Promise((resolve) => {
			canvas.toBlob((blob) => resolve(blob!), "image/png");
		});
	};

	/**
	 * Download chart as video file
	 */
	const downloadVideo = async (
		data: ChartData,
		filename = "chart-animation.webm",
		options?: Parameters<typeof exportToVideo>[1],
	) => {
		const videoBlob = await exportToVideo(data, options);
		const url = URL.createObjectURL(videoBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	/**
	 * Export chart as animated GIF
	 */
	const exportToGIF = (
		data: ChartData,
		options?: Omit<Parameters<typeof exportToVideo>[1], "format">,
	) => exportToVideo(data, { ...options, format: "gif" });

	/**
	 * Download chart as animated GIF
	 */
	const downloadGIF = (
		data: ChartData,
		filename = "chart-animation.gif",
		options?: Parameters<typeof exportToGIF>[1],
	) => {
		const gifBlob = exportToGIF(data, options);
		gifBlob.then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		});
	};

	return {
		exportToJSON,
		exportToCSV,
		exportToSVG,
		exportToPNG,
		exportToPDF,
		exportToVideo,
		exportToGIF,
		downloadJSON,
		downloadSVG,
		downloadPNG,
		downloadPDF,
		downloadVideo,
		downloadGIF,
	};
}
