import type { ChartData } from '@/module/app/types/chart-basic';

export function useChartImport() {
	const importFromJSON = (jsonString: string): ChartData => {
		try {
			return JSON.parse(jsonString);
		} catch (error) {
			throw new Error("Invalid JSON format");
		}
	};

	const importFromCSV = (csvString: string): ChartData => {
		// Parse CSV to ChartData
		const lines = csvString.trim().split("\n");
		if (lines.length < 2) {
			throw new Error("CSV must have at least header and one data row");
		}

		const headers = lines[0].split(",");
		const data = lines.slice(1).map((line) => {
			const values = line.split(",");
			return {
				x: isNaN(Number(values[0])) ? values[0] : Number(values[0]),
				y: Number(values[1]),
			};
		});

		return {
			series: [
				{
					name: "Imported Data",
					data,
				},
			],
		};
	};

	const readFile = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file);
		});
	};

	const importFromFile = async (file: File): Promise<ChartData> => {
		const content = await readFile(file);
		if (file.name.endsWith(".json")) {
			return importFromJSON(content);
		} else if (file.name.endsWith(".csv")) {
			return importFromCSV(content);
		} else {
			throw new Error("Unsupported file format");
		}
	};

	return {
		importFromJSON,
		importFromCSV,
		importFromFile,
	};
}
