declare module "hot-formula-parser" {
	export class Parser {
		on(
			event: "callCellValue",
			callback: (
				cellCoord: { label: string },
				done: (value: string | number | boolean) => void,
			) => void,
		): void;
		on(
			event: "callRangeValue",
			callback: (
				startCellCoord: { label: string },
				endCellCoord: { label: string },
				done: (value: (string | number | boolean)[][]) => void,
			) => void,
		): void;
		parse(formula: string): {
			error: string | null;
			result: string | number | boolean;
		};
		setVariable(name: string, value: string | number | boolean): void;
		getVariable(name: string): string | number | boolean;
	}
}
