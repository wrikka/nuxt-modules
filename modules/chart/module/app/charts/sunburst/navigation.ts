/**
 * Find sunburst chart navigation path
 */
export function findSunburstNavigationPath(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
	targetPath: string[],
): string[] {
	let currentNode: any = null;
	let currentPath: string[] = [];

	for (const pathSegment of targetPath) {
		if (!currentNode) {
			currentNode = data.find((item) => item.name === pathSegment);
			if (currentNode) {
				currentPath.push(pathSegment);
			}
		} else {
			currentNode = currentNode.children?.find(
				(child: any) => child.name === pathSegment,
			);
			if (currentNode) {
				currentPath.push(pathSegment);
			}
		}

		if (!currentNode) break;
	}

	return currentPath;
}


