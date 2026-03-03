/**
 * Calculate connected scatter statistics
 */
export function calculateConnectedScatterStatistics(
	points: Array<{ x: string | number; y: number }>,
): {
	count: number;
	correlation: number;
	slope: number;
	intercept: number;
	rSquared: number;
	xStats: {
		mean: number;
		std: number;
		min: number;
		max: number;
	};
	yStats: {
		mean: number;
		std: number;
		min: number;
		max: number;
	};
	outliers: Array<{
		index: number;
		x: string | number;
		y: number;
		reason: string;
	}>;
} {
	const n = points.length;
	if (n < 2) {
		return {
			count: n,
			correlation: 0,
			slope: 0,
			intercept: 0,
			rSquared: 0,
			xStats: { mean: 0, std: 0, min: 0, max: 0 },
			yStats: { mean: 0, std: 0, min: 0, max: 0 },
			outliers: [],
		};
	}

	// Convert x values to numbers where possible
	const numericPoints: Array<{
		x: number;
		y: number;
		originalX: string | number;
	}> = [];

	points.forEach((point, index) => {
		let xNum: number;
		if (typeof point.x === "number") {
			xNum = point.x;
		} else if (typeof point.x === "string") {
			const parsed = parseFloat(point.x);
			if (!isNaN(parsed)) {
				xNum = parsed;
			} else {
				return; // Skip non-numeric x values
			}
		} else {
			return;
		}

		numericPoints.push({ x: xNum, y: point.y, originalX: point.x });
	});

	const validPoints = numericPoints;
	const validN = validPoints.length;

	if (validN < 2) {
		return {
			count: n,
			correlation: 0,
			slope: 0,
			intercept: 0,
			rSquared: 0,
			xStats: { mean: 0, std: 0, min: 0, max: 0 },
			yStats: { mean: 0, std: 0, min: 0, max: 0 },
			outliers: [],
		};
	}

	// Calculate statistics
	const xValues = validPoints.map((p) => p.x);
	const yValues = validPoints.map((p) => p.y);

	const xMean = xValues.reduce((sum, x) => sum + x, 0) / validN;
	const yMean = yValues.reduce((sum, y) => sum + y, 0) / validN;

	const xStd = Math.sqrt(
		xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0) / validN,
	);
	const yStd = Math.sqrt(
		yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0) / validN,
	);

	// Linear regression
	const sumXY = validPoints.reduce(
		(sum, p) => sum + (p.x - xMean) * (p.y - yMean),
		0,
	);
	const sumXX = validPoints.reduce(
		(sum, p) => sum + Math.pow(p.x - xMean, 2),
		0,
	);

	const slope = sumXX !== 0 ? sumXY / sumXX : 0;
	const intercept = yMean - slope * xMean;

	// Correlation
	const correlation =
		sumXX !== 0 && xStd !== 0 && yStd !== 0
			? sumXY / (validN * xStd * yStd)
			: 0;

	// R-squared
	const ssRes = validPoints.reduce((sum, p) => {
		const predicted = slope * p.x + intercept;
		return sum + Math.pow(p.y - predicted, 2);
	}, 0);

	const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
	const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

	// Detect outliers (points with large residuals)
	const residuals = validPoints.map((p) => {
		const predicted = slope * p.x + intercept;
		return Math.abs(p.y - predicted);
	});

	const medianResidual = residuals.sort((a, b) => a - b)[
		Math.floor(residuals.length / 2)
	];
	const outlierThreshold = medianResidual * 2.5; // Rough outlier detection

	const outliers = validPoints
		.map((p, i) => ({
			index: i,
			x: p.originalX,
			y: p.y,
			residual: residuals[i],
		}))
		.filter((p) => p.residual > outlierThreshold)
		.map((p) => ({
			index: p.index,
			x: p.x,
			y: p.y,
			reason: `Large residual (${p.residual.toFixed(2)})`,
		}));

	return {
		count: n,
		correlation,
		slope,
		intercept,
		rSquared,
		xStats: {
			mean: xMean,
			std: xStd,
			min: Math.min(...xValues),
			max: Math.max(...xValues),
		},
		yStats: {
			mean: yMean,
			std: yStd,
			min: Math.min(...yValues),
			max: Math.max(...yValues),
		},
		outliers,
	};
}


