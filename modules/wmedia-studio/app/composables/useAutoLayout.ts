import type { Element, GroupElement } from "#shared/types";

type LayoutMode = NonNullable<GroupElement["layoutMode"]>;

const getLayoutMode = (group: GroupElement): LayoutMode => group.layoutMode ?? "none";
const getPadding = (group: GroupElement): number => group.padding ?? 0;
const getGap = (group: GroupElement): number => group.gap ?? 0;
const getPrimaryAlign = (group: GroupElement): NonNullable<GroupElement["primaryAlign"]> =>
	group.primaryAlign ?? "start";
const getCounterAlign = (group: GroupElement): NonNullable<GroupElement["counterAlign"]> =>
	group.counterAlign ?? "start";

const clampNonNegative = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export const applyAutoLayoutToGroup = (elements: Map<string, Element>, groupId: string) => {
	const group = elements.get(groupId);
	if (!group || group.type !== "group") return;

	const mode = getLayoutMode(group);
	if (mode === "none") return;

	const padding = clampNonNegative(getPadding(group));
	const gap = clampNonNegative(getGap(group));
	const primaryAlign = getPrimaryAlign(group);
	const counterAlign = getCounterAlign(group);

	const childIds = group.elements
		.map((id) => id)
		.filter((id) => elements.has(id));

	const children = childIds
		.map((id) => elements.get(id)!)
		.sort((a, b) => b.zIndex - a.zIndex);

	const innerX = group.x + padding;
	const innerY = group.y + padding;
	const innerW = Math.max(0, group.width - padding * 2);
	const innerH = Math.max(0, group.height - padding * 2);

	const mainSizes = children.map((c) => (mode === "horizontal" ? c.width : c.height));
	const totalMain = mainSizes.reduce((acc, s) => acc + s, 0);
	const totalGap = gap * Math.max(0, children.length - 1);
	const remaining = (mode === "horizontal" ? innerW : innerH) - (totalMain + totalGap);

	let startOffset = 0;
	let effectiveGap = gap;

	if (primaryAlign === "center") {
		startOffset = remaining / 2;
	} else if (primaryAlign === "end") {
		startOffset = remaining;
	} else if (primaryAlign === "space-between" && children.length > 1) {
		effectiveGap = gap + remaining / (children.length - 1);
		startOffset = 0;
	}

	let cursor = startOffset;

	children.forEach((child) => {
		let x = child.x;
		let y = child.y;
		let width = child.width;
		let height = child.height;

		if (mode === "horizontal") {
			x = innerX + cursor;
			cursor += child.width + effectiveGap;

			if (child.verticalConstraint === "stretch") {
				height = innerH;
				y = innerY;
			} else if (counterAlign === "center" || child.verticalConstraint === "center") {
				y = innerY + (innerH - child.height) / 2;
			} else if (counterAlign === "end" || child.verticalConstraint === "end") {
				y = innerY + (innerH - child.height);
			} else {
				y = innerY;
			}
		} else {
			y = innerY + cursor;
			cursor += child.height + effectiveGap;

			if (child.horizontalConstraint === "stretch") {
				width = innerW;
				x = innerX;
			} else if (counterAlign === "center" || child.horizontalConstraint === "center") {
				x = innerX + (innerW - child.width) / 2;
			} else if (counterAlign === "end" || child.horizontalConstraint === "end") {
				x = innerX + (innerW - child.width);
			} else {
				x = innerX;
			}
		}

		elements.set(child.id, {
			...child,
			x,
			y,
			width,
			height,
		} as Element);
	});
};
