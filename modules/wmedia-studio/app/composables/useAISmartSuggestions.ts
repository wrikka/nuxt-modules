export interface SmartSuggestion {
	id: string;
	type: "layout" | "color" | "typography" | "composition" | "accessibility";
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	action: () => void;
	autoApply?: boolean;
}

export interface SuggestionContext {
	canvasData?: any;
	selectedElements?: any[];
	brandColors?: string[];
	brandFonts?: string[];
}

export function useAISmartSuggestions() {
	const suggestions = ref<SmartSuggestion[]>([]);
	const isAnalyzing = ref(false);
	const context = ref<SuggestionContext>({});

	const highPrioritySuggestions = computed(() => suggestions.value.filter(s => s.priority === "high"));
	const mediumPrioritySuggestions = computed(() => suggestions.value.filter(s => s.priority === "medium"));
	const lowPrioritySuggestions = computed(() => suggestions.value.filter(s => s.priority === "low"));

	const analyzeCanvas = async (canvasData: any): Promise<SmartSuggestion[]> => {
		isAnalyzing.value = true;
		context.value.canvasData = canvasData;

		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/analyze", {
				method: "POST",
				body: { canvasData },
			});

			suggestions.value = data.suggestions || [];
			return suggestions.value;
		} catch (error) {
			console.error("Failed to analyze canvas:", error);
			return [];
		} finally {
			isAnalyzing.value = false;
		}
	};

	const generateLayoutSuggestions = async (): Promise<SmartSuggestion[]> => {
		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/layout", {
				method: "POST",
				body: { context: context.value },
			});

			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to generate layout suggestions:", error);
			return [];
		}
	};

	const generateColorSuggestions = async (): Promise<SmartSuggestion[]> => {
		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/color", {
				method: "POST",
				body: { context: context.value },
			});

			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to generate color suggestions:", error);
			return [];
		}
	};

	const generateTypographySuggestions = async (): Promise<SmartSuggestion[]> => {
		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/typography", {
				method: "POST",
				body: { context: context.value },
			});

			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to generate typography suggestions:", error);
			return [];
		}
	};

	const generateCompositionSuggestions = async (): Promise<SmartSuggestion[]> => {
		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/composition", {
				method: "POST",
				body: { context: context.value },
			});

			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to generate composition suggestions:", error);
			return [];
		}
	};

	const generateAccessibilitySuggestions = async (): Promise<SmartSuggestion[]> => {
		try {
			const data = await $fetch<{ suggestions: SmartSuggestion[] }>("/api/ai/suggestions/accessibility", {
				method: "POST",
				body: { context: context.value },
			});

			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to generate accessibility suggestions:", error);
			return [];
		}
	};

	const applySuggestion = (suggestionId: string) => {
		const suggestion = suggestions.value.find(s => s.id === suggestionId);
		if (suggestion) {
			suggestion.action();
			suggestions.value = suggestions.value.filter(s => s.id !== suggestionId);
		}
	};

	const applyAllHighPriority = () => {
		highPrioritySuggestions.value.forEach(suggestion => {
			if (suggestion.autoApply) {
				suggestion.action();
			}
		});
		suggestions.value = suggestions.value.filter(s => s.priority !== "high" || !s.autoApply);
	};

	const dismissSuggestion = (suggestionId: string) => {
		suggestions.value = suggestions.value.filter(s => s.id !== suggestionId);
	};

	const dismissAllSuggestions = () => {
		suggestions.value = [];
	};

	const updateContext = (newContext: Partial<SuggestionContext>) => {
		context.value = { ...context.value, ...newContext };
	};

	const getSuggestionsByType = (type: SmartSuggestion["type"]) => {
		return suggestions.value.filter(s => s.type === type);
	};

	return {
		suggestions,
		highPrioritySuggestions,
		mediumPrioritySuggestions,
		lowPrioritySuggestions,
		isAnalyzing,
		context,
		analyzeCanvas,
		generateLayoutSuggestions,
		generateColorSuggestions,
		generateTypographySuggestions,
		generateCompositionSuggestions,
		generateAccessibilitySuggestions,
		applySuggestion,
		applyAllHighPriority,
		dismissSuggestion,
		dismissAllSuggestions,
		updateContext,
		getSuggestionsByType,
	};
}
