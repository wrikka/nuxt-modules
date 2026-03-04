// Helper functions for time series

export function getGranularityInterval(granularity: string): number {
	switch (granularity) {
		case "second":
			return 1000;
		case "minute":
			return 1000 * 60;
		case "hour":
			return 1000 * 60 * 60;
		case "day":
			return 1000 * 60 * 60 * 24;
		case "week":
			return 1000 * 60 * 60 * 24 * 7;
		case "month":
			return 1000 * 60 * 60 * 24 * 30;
		case "year":
			return 1000 * 60 * 60 * 24 * 365;
		default:
			return 1000 * 60 * 60 * 24;
	}
}

export function interpolate(
	start: number,
	end: number,
	ratio: number,
	method: string,
): number {
	switch (method) {
		case "step":
			return ratio < 1 ? start : end;
		case "cubic":
			// Simple cubic interpolation
			return (
				start + (end - start) * (3 * ratio * ratio - 2 * ratio * ratio * ratio)
			);
		case "linear":
		default:
			return start + (end - start) * ratio;
	}
}

export function getGranularityKey(date: Date, granularity: string): string {
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const hour = date.getHours();

	switch (granularity) {
		case "year":
			return `${year}`;
		case "month":
			return `${year}-${month.toString().padStart(2, "0")}`;
		case "week":
			const weekStart = new Date(date);
			weekStart.setDate(date.getDate() - date.getDay());
			return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
		case "day":
			return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
		case "hour":
			return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}-${hour.toString().padStart(2, "0")}`;
		default:
			return date.toISOString();
	}
}

export function parseGranularityKey(key: string, granularity: string): Date {
	switch (granularity) {
		case "year":
			return new Date(parseInt(key), 0, 1);
		case "month":
			const [year, month] = key.split("-").map(Number);
			return new Date(year, month, 1);
		case "day":
			const [y, m, d] = key.split("-").map(Number);
			return new Date(y, m, d);
		case "hour":
			const [ye, mo, da, h] = key.split("-").map(Number);
			return new Date(ye, mo, da, h);
		default:
			return new Date(key);
	}
}
