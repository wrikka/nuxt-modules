import type { Element } from "#shared/types";
import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { applyAutoLayoutToGroup } from "~/composables/useAutoLayout";

export const useElementStore = defineStore("element", () => {
	const elements = ref<Map<string, Element>>(new Map());
	const selectedElements = ref<Set<string>>(new Set());
	const clipboard = ref<Element[]>([]);
	const history = ref<Element[][]>([]);
	const historyIndex = ref(-1);
	const maxHistory = 50;

	const getParentGroupsForChild = (childId: string): string[] => {
		const parents: string[] = [];
		for (const [id, element] of elements.value.entries()) {
			if (element.type === "group" && element.elements.includes(childId)) {
				parents.push(id);
			}
		}
		return parents;
	};

	const reflowGroupAndParents = (elementId: string) => {
		const element = elements.value.get(elementId);
		if (element?.type === "group") {
			applyAutoLayoutToGroup(elements.value, elementId);
		}
		const parents = getParentGroupsForChild(elementId);
		parents.forEach((groupId) => {
			applyAutoLayoutToGroup(elements.value, groupId);
		});
	};

	const addElement = (element: Element) => {
		elements.value.set(element.id, element);
		reflowGroupAndParents(element.id);
		saveHistory();
	};

	const updateElement = (id: string, updates: Partial<Element>) => {
		const element = elements.value.get(id);
		if (element) {
			elements.value.set(id, { ...element, ...updates } as Element);
			reflowGroupAndParents(id);
		}
	};

	const removeElement = (id: string) => {
		elements.value.delete(id);
		selectedElements.value.delete(id);
		saveHistory();
	};

	const selectElement = (id: string, addToSelection = false) => {
		if (addToSelection) {
			if (selectedElements.value.has(id)) {
				selectedElements.value.delete(id);
			} else {
				selectedElements.value.add(id);
			}
		} else {
			selectedElements.value.clear();
			selectedElements.value.add(id);
		}
	};

	const selectAllElements = () => {
		selectedElements.value = new Set(elements.value.keys());
	};

	const deselectAllElements = () => {
		selectedElements.value.clear();
	};

	const duplicateElement = (id: string) => {
		const element = elements.value.get(id);
		if (element) {
			const newElement = {
				...element,
				id: nanoid(),
				x: element.x + 20,
				y: element.y + 20,
			};
			addElement(newElement);
			return newElement;
		}
		return null;
	};

	const copyElements = (ids: string[]) => {
		clipboard.value = ids.map((id) => {
			const element = elements.value.get(id);
			if (!element) {
				throw new Error(`Element ${id} not found`);
			}
			return { ...element };
		});
	};

	const pasteElements = () => {
		const newElements = clipboard.value.map((element) => ({
			...element,
			id: nanoid(),
			x: element.x + 20,
			y: element.y + 20,
		}));

		newElements.forEach((element) => {
			addElement(element);
		});

		return newElements;
	};

	const bringToFront = (id: string) => {
		const element = elements.value.get(id);
		if (!element) return;

		const maxZIndex = Math.max(...Array.from(elements.value.values()).map((e) => e.zIndex));
		updateElement(id, { zIndex: maxZIndex + 1 });
	};

	const sendToBack = (id: string) => {
		const element = elements.value.get(id);
		if (!element) return;

		const minZIndex = Math.min(...Array.from(elements.value.values()).map((e) => e.zIndex));
		updateElement(id, { zIndex: minZIndex - 1 });
	};

	const moveUp = (id: string) => {
		const element = elements.value.get(id);
		if (!element) return;

		updateElement(id, { zIndex: element.zIndex + 1 });
	};

	const moveDown = (id: string) => {
		const element = elements.value.get(id);
		if (!element) return;

		updateElement(id, { zIndex: element.zIndex - 1 });
	};

	const saveHistory = () => {
		const currentElements = Array.from(elements.value.values());
		history.value = history.value.slice(0, historyIndex.value + 1);
		history.value.push(currentElements);
		historyIndex.value = history.value.length - 1;

		if (history.value.length > maxHistory) {
			history.value.shift();
			historyIndex.value--;
		}
	};

	const undo = () => {
		if (historyIndex.value > 0) {
			historyIndex.value--;
			const previousElements = history.value[historyIndex.value];
			if (previousElements) {
				elements.value = new Map(previousElements.map((e) => [e.id, e]));
			}
			selectedElements.value.clear();
		}
	};

	const redo = () => {
		if (historyIndex.value < history.value.length - 1) {
			historyIndex.value++;
			const nextElements = history.value[historyIndex.value];
			if (nextElements) {
				elements.value = new Map(nextElements.map((e) => [e.id, e]));
			}
			selectedElements.value.clear();
		}
	};

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const clearElements = () => {
		elements.value.clear();
		selectedElements.value.clear();
		saveHistory();
	};

	const getElementsByType = <T extends Element>(type: T["type"]): T[] => {
		return Array.from(elements.value.values()).filter((e) => e.type === type) as T[];
	};

	const getSelectedElements = (): Element[] => {
		return Array.from(selectedElements.value)
			.map((id) => elements.value.get(id))
			.filter((e): e is Element => e !== undefined);
	};

	return {
		elements,
		selectedElements,
		clipboard,
		history,
		historyIndex,
		canUndo,
		canRedo,
		addElement,
		updateElement,
		removeElement,
		selectElement,
		selectAllElements,
		deselectAllElements,
		duplicateElement,
		copyElements,
		pasteElements,
		bringToFront,
		sendToBack,
		moveUp,
		moveDown,
		undo,
		redo,
		clearElements,
		getElementsByType,
		getSelectedElements,
	};
});
