import * as fabric from "fabric";

export interface ElementProperty {
	key: string;
	label: string;
	type: "text" | "number" | "color" | "select" | "boolean" | "slider" | "position" | "size";
	value: any;
	options?: { label: string; value: any }[];
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	category?: "position" | "size" | "appearance" | "effects" | "text";
}

export function useElementProperties(canvas: Ref<fabric.Canvas | null>) {
	const selectedElement = ref<fabric.Object | null>(null);
	const properties = ref<ElementProperty[]>([]);

	const hasSelection = computed(() => selectedElement.value !== null);

	const updateProperties = () => {
		if (!canvas.value) {
			properties.value = [];
			selectedElement.value = null;
			return;
		}

		const activeObject = canvas.value.getActiveObject();
		selectedElement.value = activeObject || null;

		if (!activeObject) {
			properties.value = [];
			return;
		}

		const props: ElementProperty[] = [];

		props.push({
			key: "id",
			label: "ID",
			type: "text",
			value: (activeObject as any).id || "",
			category: "appearance",
		});

		props.push({
			key: "name",
			label: "Name",
			type: "text",
			value: (activeObject as any).name || "",
			category: "appearance",
		});

		props.push({
			key: "left",
			label: "X Position",
			type: "number",
			value: Math.round(activeObject.left || 0),
			category: "position",
			unit: "px",
		});

		props.push({
			key: "top",
			label: "Y Position",
			type: "number",
			value: Math.round(activeObject.top || 0),
			category: "position",
			unit: "px",
		});

		props.push({
			key: "width",
			label: "Width",
			type: "number",
			value: Math.round(activeObject.getScaledWidth()),
			category: "size",
			unit: "px",
			min: 1,
		});

		props.push({
			key: "height",
			label: "Height",
			type: "number",
			value: Math.round(activeObject.getScaledHeight()),
			category: "size",
			unit: "px",
			min: 1,
		});

		props.push({
			key: "angle",
			label: "Rotation",
			type: "number",
			value: Math.round(activeObject.angle || 0),
			category: "position",
			unit: "°",
			min: 0,
			max: 360,
		});

		props.push({
			key: "scaleX",
			label: "Scale X",
			type: "slider",
			value: activeObject.scaleX || 1,
			category: "size",
			min: 0.1,
			max: 5,
			step: 0.1,
		});

		props.push({
			key: "scaleY",
			label: "Scale Y",
			type: "slider",
			value: activeObject.scaleY || 1,
			category: "size",
			min: 0.1,
			max: 5,
			step: 0.1,
		});

		props.push({
			key: "skewX",
			label: "Skew X",
			type: "number",
			value: Math.round((activeObject.skewX || 0) * 180 / Math.PI),
			category: "position",
			unit: "°",
			min: -45,
			max: 45,
		});

		props.push({
			key: "skewY",
			label: "Skew Y",
			type: "number",
			value: Math.round((activeObject.skewY || 0) * 180 / Math.PI),
			category: "position",
			unit: "°",
			min: -45,
			max: 45,
		});

		props.push({
			key: "opacity",
			label: "Opacity",
			type: "slider",
			value: activeObject.opacity || 1,
			category: "appearance",
			min: 0,
			max: 1,
			step: 0.01,
		});

		props.push({
			key: "visible",
			label: "Visible",
			type: "boolean",
			value: activeObject.visible !== false,
			category: "appearance",
		});

		props.push({
			key: "lockMovementX",
			label: "Lock Horizontal",
			type: "boolean",
			value: activeObject.lockMovementX || false,
			category: "position",
		});

		props.push({
			key: "lockMovementY",
			label: "Lock Vertical",
			type: "boolean",
			value: activeObject.lockMovementY || false,
			category: "position",
		});

		props.push({
			key: "lockRotation",
			label: "Lock Rotation",
			type: "boolean",
			value: activeObject.lockRotation || false,
			category: "position",
		});

		props.push({
			key: "lockScalingX",
			label: "Lock Width",
			type: "boolean",
			value: activeObject.lockScalingX || false,
			category: "size",
		});

		props.push({
			key: "lockScalingY",
			label: "Lock Height",
			type: "boolean",
			value: activeObject.lockScalingY || false,
			category: "size",
		});

		if ("fill" in activeObject && activeObject.fill) {
			props.push({
				key: "fill",
				label: "Fill Color",
				type: "color",
				value: activeObject.fill as string,
				category: "appearance",
			});
		}

		if ("stroke" in activeObject && activeObject.stroke) {
			props.push({
				key: "stroke",
				label: "Stroke Color",
				type: "color",
				value: activeObject.stroke as string,
				category: "appearance",
			});

			props.push({
				key: "strokeWidth",
				label: "Stroke Width",
				type: "number",
				value: activeObject.strokeWidth || 0,
				category: "appearance",
				unit: "px",
				min: 0,
			});
		}

		if ("shadow" in activeObject && activeObject.shadow) {
			const shadow = activeObject.shadow as any;
			props.push({
				key: "shadowColor",
				label: "Shadow Color",
				type: "color",
				value: shadow.color || "#000000",
				category: "effects",
			});

			props.push({
				key: "shadowBlur",
				label: "Shadow Blur",
				type: "number",
				value: shadow.blur || 0,
				category: "effects",
				unit: "px",
				min: 0,
			});

			props.push({
				key: "shadowOffsetX",
				label: "Shadow Offset X",
				type: "number",
				value: shadow.offsetX || 0,
				category: "effects",
				unit: "px",
			});

			props.push({
				key: "shadowOffsetY",
				label: "Shadow Offset Y",
				type: "number",
				value: shadow.offsetY || 0,
				category: "effects",
				unit: "px",
			});
		}

		if (activeObject.type === "i-text" || activeObject.type === "text") {
			const textObj = activeObject as any;
			props.push({
				key: "text",
				label: "Text Content",
				type: "text",
				value: textObj.text || "",
				category: "text",
			});

			props.push({
				key: "fontSize",
				label: "Font Size",
				type: "number",
				value: textObj.fontSize || 16,
				category: "text",
				unit: "px",
				min: 1,
			});

			props.push({
				key: "fontFamily",
				label: "Font Family",
				type: "text",
				value: textObj.fontFamily || "Arial",
				category: "text",
			});

			props.push({
				key: "fontWeight",
				label: "Font Weight",
				type: "select",
				value: textObj.fontWeight || "normal",
				options: [
					{ label: "Normal", value: "normal" },
					{ label: "Bold", value: "bold" },
					{ label: "100", value: "100" },
					{ label: "200", value: "200" },
					{ label: "300", value: "300" },
					{ label: "400", value: "400" },
					{ label: "500", value: "500" },
					{ label: "600", value: "600" },
					{ label: "700", value: "700" },
					{ label: "800", value: "800" },
					{ label: "900", value: "900" },
				],
				category: "text",
			});

			props.push({
				key: "fontStyle",
				label: "Font Style",
				type: "select",
				value: textObj.fontStyle || "normal",
				options: [
					{ label: "Normal", value: "normal" },
					{ label: "Italic", value: "italic" },
					{ label: "Oblique", value: "oblique" },
				],
				category: "text",
			});

			props.push({
				key: "textAlign",
				label: "Text Align",
				type: "select",
				value: textObj.textAlign || "left",
				options: [
					{ label: "Left", value: "left" },
					{ label: "Center", value: "center" },
					{ label: "Right", value: "right" },
					{ label: "Justify", value: "justify" },
				],
				category: "text",
			});

			props.push({
				key: "lineHeight",
				label: "Line Height",
				type: "number",
				value: textObj.lineHeight || 1.16,
				category: "text",
				min: 0.5,
				max: 3,
				step: 0.01,
			});

			props.push({
				key: "charSpacing",
				label: "Letter Spacing",
				type: "number",
				value: textObj.charSpacing || 0,
				category: "text",
				unit: "px",
			});
		}

		properties.value = props;
	};

	const updateProperty = (key: string, value: any) => {
		if (!canvas.value || !selectedElement.value) return;

		const obj = selectedElement.value;

		switch (key) {
			case "id":
				obj.set("id", value);
				break;
			case "name":
				obj.set("name", value);
				break;
			case "left":
				obj.set("left", value);
				break;
			case "top":
				obj.set("top", value);
				break;
			case "width":
				obj.scaleToWidth(value);
				break;
			case "height":
				obj.scaleToHeight(value);
				break;
			case "angle":
				obj.set("angle", value);
				break;
			case "scaleX":
				obj.set("scaleX", value);
				break;
			case "scaleY":
				obj.set("scaleY", value);
				break;
			case "skewX":
				obj.set("skewX", value * Math.PI / 180);
				break;
			case "skewY":
				obj.set("skewY", value * Math.PI / 180);
				break;
			case "opacity":
				obj.set("opacity", value);
				break;
			case "visible":
				obj.set("visible", value);
				break;
			case "lockMovementX":
				obj.set("lockMovementX", value);
				break;
			case "lockMovementY":
				obj.set("lockMovementY", value);
				break;
			case "lockRotation":
				obj.set("lockRotation", value);
				break;
			case "lockScalingX":
				obj.set("lockScalingX", value);
				break;
			case "lockScalingY":
				obj.set("lockScalingY", value);
				break;
			case "fill":
				obj.set("fill", value);
				break;
			case "stroke":
				obj.set("stroke", value);
				break;
			case "strokeWidth":
				obj.set("strokeWidth", value);
				break;
			case "shadowColor":
				if (obj.shadow) {
					(obj.shadow as any).color = value;
				}
				break;
			case "shadowBlur":
				if (obj.shadow) {
					(obj.shadow as any).blur = value;
				}
				break;
			case "shadowOffsetX":
				if (obj.shadow) {
					(obj.shadow as any).offsetX = value;
				}
				break;
			case "shadowOffsetY":
				if (obj.shadow) {
					(obj.shadow as any).offsetY = value;
				}
				break;
			case "text":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("text", value);
				}
				break;
			case "fontSize":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("fontSize", value);
				}
				break;
			case "fontFamily":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("fontFamily", value);
				}
				break;
			case "fontWeight":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("fontWeight", value);
				}
				break;
			case "fontStyle":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("fontStyle", value);
				}
				break;
			case "textAlign":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("textAlign", value);
				}
				break;
			case "lineHeight":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("lineHeight", value);
				}
				break;
			case "charSpacing":
				if (obj.type === "i-text" || obj.type === "text") {
					(obj as any).set("charSpacing", value);
				}
				break;
		}

		obj.setCoords();
		canvas.value.renderAll();
		updateProperties();
	};

	const getProperty = (key: string): ElementProperty | undefined => {
		return properties.value.find(p => p.key === key);
	};

	const getPropertiesByCategory = (category: string): ElementProperty[] => {
		return properties.value.filter(p => p.category === category);
	};

	const resetProperties = () => {
		if (!canvas.value || !selectedElement.value) return;

		const obj = selectedElement.value;

		obj.set({
			opacity: 1,
			visible: true,
			lockMovementX: false,
			lockMovementY: false,
			lockRotation: false,
			lockScalingX: false,
			lockScalingY: false,
			angle: 0,
			scaleX: 1,
			scaleY: 1,
			skewX: 0,
			skewY: 0,
		});

		obj.setCoords();
		canvas.value.renderAll();
		updateProperties();
	};

	const copyProperties = (): Record<string, any> => {
		if (!selectedElement.value) return {};

		const props: Record<string, any> = {};
		properties.value.forEach((prop) => {
			props[prop.key] = prop.value;
		});

		return props;
	};

	const pasteProperties = (props: Record<string, any>) => {
		if (!canvas.value || !selectedElement.value) return;

		Object.entries(props).forEach(([key, value]) => {
			updateProperty(key, value);
		});
	};

	watch(canvas, () => {
		updateProperties();
	});

	return {
		selectedElement,
		properties,
		hasSelection,
		updateProperties,
		updateProperty,
		getProperty,
		getPropertiesByCategory,
		resetProperties,
		copyProperties,
		pasteProperties,
	};
}
