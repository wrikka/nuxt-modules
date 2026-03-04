import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate multi-level pie layout
 */
export function calculateMultiLevelPieLayout(
	levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
			color?: string;
		}>;
	}>,
	containerWidth: number,
	containerHeight: number,
	options: {
		centerX?: number;
		centerY?: number;
		levelSpacing?: number;
	} = {},
): Array<{
	level: number;
	levelName: string;
	segments: Array<{
		name: string;
		value: number;
		color: string;
		startAngle: number;
		endAngle: number;
		innerRadius: number;
		outerRadius: number;
		midAngle: number;
		percentage: number;
	}>;
}> {
	const {
		centerX = containerWidth / 2,
		centerY = containerHeight / 2,
		levelSpacing = 20,
	} = options;

	const layout: Array<{
		level: number;
		levelName: string;
		segments: Array<{
			name: string;
			value: number;
			color: string;
			startAngle: number;
			endAngle: number;
			innerRadius: number;
			outerRadius: number;
			midAngle: number;
			percentage: number;
		}>;
	}> = [];

	const maxRadius = Math.min(containerWidth, containerHeight) / 2;
	const levelRadius = maxRadius / levels.length;

	levels.forEach((level, levelIndex) => {
		const levelRadiusStart = levelIndex * levelRadius;
		const levelRadiusEnd = (levelIndex + 1) * levelRadius - levelSpacing;

		const totalValue = level.data.reduce((sum, item) => sum + item.value, 0);
		let currentAngle = 0;

		const segments = level.data.map((item) => {
			const percentage = item.value / totalValue;
			const angle = percentage * 2 * Math.PI;
			const startAngle = currentAngle;
			const endAngle = currentAngle + angle;
			const midAngle = (startAngle + endAngle) / 2;

			currentAngle = endAngle;

			return {
				name: item.name,
				value: item.value,
				color: item.color || getSeriesColor(0),
				startAngle,
				endAngle,
				innerRadius: levelRadiusStart,
				outerRadius: levelRadiusEnd,
				midAngle,
				percentage,
			};
		});

		layout.push({
			level: levelIndex,
			levelName: level.name,
			segments,
		});
	});

	return layout;
}


