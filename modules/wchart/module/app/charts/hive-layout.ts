/**
 * Calculate hive plot layout
 */
export function calculateHiveLayout(
	axes: Array<{
		name: string;
		angle: number;
		values: Array<{ id: string; value: number; size?: number }>;
	}>,
	links: Array<{
		source: { axis: string; id: string };
		target: { axis: string; id: string };
	}>,
	options: {
		radius?: number;
		innerRadius?: number;
	} = {},
): {
	nodes: Array<{
		id: string;
		axis: string;
		x: number;
		y: number;
		size: number;
		value: number;
	}>;
	links: Array<{
		sourceX: number;
		sourceY: number;
		targetX: number;
		targetY: number;
		source: { axis: string; id: string };
		target: { axis: string; id: string };
	}>;
} {
	const { radius = 200, innerRadius = 20 } = options;

	const nodes: Array<{
		id: string;
		axis: string;
		x: number;
		y: number;
		size: number;
		value: number;
	}> = [];

	const linkMap = new Map<
		string,
		{ x: number; y: number; axis: string; id: string }
	>();

	// Position nodes on axes
	axes.forEach((axis) => {
		const cos = Math.cos(axis.angle);
		const sin = Math.sin(axis.angle);

		axis.values.forEach((value) => {
			const r = innerRadius + value.value * (radius - innerRadius);
			const x = r * cos;
			const y = r * sin;

			nodes.push({
				id: value.id,
				axis: axis.name,
				x,
				y,
				size: value.size || 4,
				value: value.value,
			});

			linkMap.set(`${axis.name}-${value.id}`, {
				x,
				y,
				axis: axis.name,
				id: value.id,
			});
		});
	});

	// Calculate link paths
	const positionedLinks: Array<{
		sourceX: number;
		sourceY: number;
		targetX: number;
		targetY: number;
		source: { axis: string; id: string };
		target: { axis: string; id: string };
	}> = links
		.map((link) => {
			const sourceKey = `${link.source.axis}-${link.source.id}`;
			const targetKey = `${link.target.axis}-${link.target.id}`;

			const source = linkMap.get(sourceKey);
			const target = linkMap.get(targetKey);

			if (!source || !target) {
				return null;
			}

			return {
				sourceX: source.x,
				sourceY: source.y,
				targetX: target.x,
				targetY: target.y,
				source: link.source,
				target: link.target,
			};
		})
		.filter((link) => link !== null);

	return {
		nodes,
		links: positionedLinks,
	};
}


