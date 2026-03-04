import type { DesignToken, TokenCategory } from "#shared/types/element";
import { nanoid } from "nanoid";
import { ref } from "vue";

export interface UseDesignerTokensOptions {
	projectId: string;
	onTokenSelect?: (tokenId: string, token: DesignToken | undefined) => void;
	onTokenChange?: () => void;
}

export const useDesignerTokens = (options: UseDesignerTokensOptions) => {
	const showTokensPanel = ref(false);
	const selectedTokenId = ref<string | null>(null);

	const tokenCategories = ref<TokenCategory[]>([
		{
			id: "colors",
			name: "Colors",
			tokens: [
				{ id: "primary", name: "Primary", type: "color", value: "#3B82F6", category: "colors" },
				{ id: "secondary", name: "Secondary", type: "color", value: "#8B5CF6", category: "colors" },
				{ id: "success", name: "Success", type: "color", value: "#10B981", category: "colors" },
				{ id: "warning", name: "Warning", type: "color", value: "#F59E0B", category: "colors" },
				{ id: "danger", name: "Danger", type: "color", value: "#EF4444", category: "colors" },
			],
		},
		{
			id: "spacing",
			name: "Spacing",
			tokens: [
				{ id: "xs", name: "XS", type: "spacing", value: 4, category: "spacing" },
				{ id: "sm", name: "SM", type: "spacing", value: 8, category: "spacing" },
				{ id: "md", name: "MD", type: "spacing", value: 16, category: "spacing" },
				{ id: "lg", name: "LG", type: "spacing", value: 24, category: "spacing" },
				{ id: "xl", name: "XL", type: "spacing", value: 32, category: "spacing" },
			],
		},
		{
			id: "typography",
			name: "Typography",
			tokens: [
				{ id: "font-sans", name: "Font Sans", type: "typography", value: "Inter, sans-serif", category: "typography" },
				{ id: "font-mono", name: "Font Mono", type: "typography", value: "JetBrains Mono, monospace", category: "typography" },
			],
		},
		{
			id: "shadows",
			name: "Shadows",
			tokens: [
				{ id: "shadow-sm", name: "Shadow SM", type: "shadow", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", category: "shadows" },
				{ id: "shadow-md", name: "Shadow MD", type: "shadow", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", category: "shadows" },
				{ id: "shadow-lg", name: "Shadow LG", type: "shadow", value: "0 10px 15px -3px rgb(0 0 0 / 0.1)", category: "shadows" },
			],
		},
	]);

	const handleSelectToken = (tokenId: string) => {
		selectedTokenId.value = tokenId;
		const token = tokenCategories.value.flatMap((c) => c.tokens).find((t) => t.id === tokenId);
		options.onTokenSelect?.(tokenId, token);
	};

	const handleCreateToken = (category: string) => {
		const newToken: DesignToken = {
			id: `token-${Date.now()}`,
			name: "New Token",
			type: category === "colors" ? "color" : category === "spacing" ? "spacing" : category === "typography" ? "typography" : "shadow",
			value: category === "colors" ? "#000000" : category === "spacing" ? 16 : "default",
			category,
		};
		const cat = tokenCategories.value.find((c) => c.id === category);
		if (cat) {
			cat.tokens.push(newToken);
			options.onTokenChange?.();
		}
	};

	const handleUpdateToken = (tokenId: string, updates: Partial<DesignToken>) => {
		for (const cat of tokenCategories.value) {
			const token = cat.tokens.find((t) => t.id === tokenId);
			if (token) {
				Object.assign(token, updates);
				options.onTokenChange?.();
				break;
			}
		}
	};

	const handleDeleteToken = (tokenId: string) => {
		for (const cat of tokenCategories.value) {
			const index = cat.tokens.findIndex((t) => t.id === tokenId);
			if (index > -1) {
				cat.tokens.splice(index, 1);
				options.onTokenChange?.();
				break;
			}
		}
		if (selectedTokenId.value === tokenId) {
			selectedTokenId.value = null;
		}
	};

	const handleDuplicateToken = (tokenId: string) => {
		for (const cat of tokenCategories.value) {
			const token = cat.tokens.find((t) => t.id === tokenId);
			if (token) {
				const newToken: DesignToken = {
					...token,
					id: `token-${Date.now()}`,
					name: `${token.name} (Copy)`,
				};
				cat.tokens.push(newToken);
				options.onTokenChange?.();
				break;
			}
		}
	};

	const handleImportTokens = () => {
		// Handle import - could open file picker
		console.log("Import tokens");
	};

	const handleExportTokens = () => {
		const data = JSON.stringify(tokenCategories.value, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `design-tokens-${options.projectId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const toggleTokensPanel = () => {
		showTokensPanel.value = !showTokensPanel.value;
	};

	return {
		showTokensPanel,
		selectedTokenId,
		tokenCategories,
		handleSelectToken,
		handleCreateToken,
		handleUpdateToken,
		handleDeleteToken,
		handleDuplicateToken,
		handleImportTokens,
		handleExportTokens,
		toggleTokensPanel,
	};
};
