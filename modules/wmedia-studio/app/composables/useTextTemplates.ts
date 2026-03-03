export interface TextTemplate {
	id: string;
	name: string;
	preview: string;
	content: {
		text: string;
		fontFamily: string;
		fontSize: number;
		fontWeight: "normal" | "bold" | "light";
		color: string;
		backgroundColor?: string;
		align: "left" | "center" | "right";
		padding: number;
		borderRadius: number;
		shadow: boolean;
	};
}

export const useTextTemplates = () => {
	const templates = ref<TextTemplate[]>([
		{
			id: "title-basic",
			name: "Basic Title",
			preview: "Title",
			content: {
				text: "Your Title Here",
				fontFamily: "Inter",
				fontSize: 48,
				fontWeight: "bold",
				color: "#ffffff",
				align: "center",
				padding: 0,
				borderRadius: 0,
				shadow: true,
			},
		},
		{
			id: "subtitle-basic",
			name: "Basic Subtitle",
			preview: "Subtitle",
			content: {
				text: "Your Subtitle Here",
				fontFamily: "Inter",
				fontSize: 32,
				fontWeight: "normal",
				color: "#ffffff",
				align: "center",
				padding: 0,
				borderRadius: 0,
				shadow: true,
			},
		},
		{
			id: "caption-lower",
			name: "Lower Third",
			preview: "Name | Title",
			content: {
				text: "John Doe | CEO",
				fontFamily: "Inter",
				fontSize: 24,
				fontWeight: "bold",
				color: "#ffffff",
				backgroundColor: "#000000",
				align: "left",
				padding: 16,
				borderRadius: 8,
				shadow: true,
			},
		},
		{
			id: "caption-box",
			name: "Caption Box",
			preview: "Caption",
			content: {
				text: "Caption Text",
				fontFamily: "Inter",
				fontSize: 20,
				fontWeight: "normal",
				color: "#ffffff",
				backgroundColor: "#000000",
				align: "center",
				padding: 12,
				borderRadius: 4,
				shadow: true,
			},
		},
		{
			id: "heading-large",
			name: "Large Heading",
			preview: "HEADING",
			content: {
				text: "HEADING",
				fontFamily: "Inter",
				fontSize: 64,
				fontWeight: "bold",
				color: "#ffffff",
				align: "center",
				padding: 0,
				borderRadius: 0,
				shadow: true,
			},
		},
		{
			id: "quote-style",
			name: "Quote Style",
			preview: "\"Quote\"",
			content: {
				text: "\"Your Quote Here\"",
				fontFamily: "Georgia",
				fontSize: 36,
				fontWeight: "normal",
				color: "#ffffff",
				align: "center",
				padding: 0,
				borderRadius: 0,
				shadow: true,
			},
		},
		{
			id: "highlight-box",
			name: "Highlight Box",
			preview: "Highlight",
			content: {
				text: "Important!",
				fontFamily: "Inter",
				fontSize: 28,
				fontWeight: "bold",
				color: "#000000",
				backgroundColor: "#ffff00",
				align: "center",
				padding: 16,
				borderRadius: 8,
				shadow: true,
			},
		},
		{
			id: "minimal-text",
			name: "Minimal Text",
			preview: "Text",
			content: {
				text: "Minimal Text",
				fontFamily: "Inter",
				fontSize: 24,
				fontWeight: "light",
				color: "#ffffff",
				align: "left",
				padding: 0,
				borderRadius: 0,
				shadow: false,
			},
		},
	]);

	const selectedTemplateId = ref<string | null>(null);

	const getTemplate = (templateId: string): TextTemplate | undefined => {
		return templates.value.find((t) => t.id === templateId);
	};

	const applyTemplate = (templateId: string): TextTemplate | undefined => {
		const template = getTemplate(templateId);
		if (template) {
			selectedTemplateId.value = templateId;
		}
		return template;
	};

	const createCustomTemplate = (name: string, content: TextTemplate["content"]): TextTemplate => {
		const template: TextTemplate = {
			id: `custom-${Date.now()}`,
			name,
			preview: content.text.substring(0, 20),
			content,
		};

		templates.value.push(template);
		return template;
	};

	const deleteTemplate = (templateId: string) => {
		templates.value = templates.value.filter((t) => t.id !== templateId);
		if (selectedTemplateId.value === templateId) {
			selectedTemplateId.value = null;
		}
	};

	const getTemplatesByCategory = (category: "all" | "basic" | "caption" | "heading" | "custom"): TextTemplate[] => {
		if (category === "all") return templates.value;

		const categoryMap: Record<string, string[]> = {
			basic: ["title-basic", "subtitle-basic"],
			caption: ["caption-lower", "caption-box"],
			heading: ["heading-large", "quote-style"],
			custom: [],
		};

		const ids = categoryMap[category] || [];
		return templates.value.filter((t) => ids.includes(t.id) || t.id.startsWith("custom"));
	};

	return {
		templates,
		selectedTemplateId,
		getTemplate,
		applyTemplate,
		createCustomTemplate,
		deleteTemplate,
		getTemplatesByCategory,
	};
};
