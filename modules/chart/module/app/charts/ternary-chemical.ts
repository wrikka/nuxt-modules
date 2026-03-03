import { generateTernaryData, type TernaryData } from './ternary-data';

/**
 * Generate ternary plot for chemical compositions
 */
export function generateChemicalTernary(
	compositions: Array<{
		compoundA: number;
		compoundB: number;
		compoundC: number;
		name?: string;
		phase?: string;
	}>,
	compoundNames: [string, string, string],
	options: {
		title?: string;
		normalizeTo100?: boolean;
	} = {},
): TernaryData {
	const { title, normalizeTo100 = true } = options;

	const points = compositions.map((comp) => {
		let a = comp.compoundA;
		let b = comp.compoundB;
		let c = comp.compoundC;

		if (normalizeTo100) {
			const total = a + b + c;
			if (total > 0) {
				a = (a / total) * 100;
				b = (b / total) * 100;
				c = (c / total) * 100;
			}
		}

		// Convert to 0-1 scale
		return {
			a: a / 100,
			b: b / 100,
			c: c / 100,
			label: comp.name,
			color: getPhaseColor(comp.phase),
		};
	});

	const components = {
		a: { name: compoundNames[0] },
		b: { name: compoundNames[1] },
		c: { name: compoundNames[2] },
	};

	return generateTernaryData(points, components, { title });
}

/**
 * Get color for chemical phase
 */
function getPhaseColor(phase?: string): string {
	const phaseColors: Record<string, string> = {
		solid: "#4CAF50",
		liquid: "#2196F3",
		gas: "#FF9800",
		plasma: "#9C27B0",
		unknown: "#9E9E9E",
	};

	return phaseColors[phase || "unknown"] || "#9E9E9E";
}


