<script setup lang="ts">
export interface DesignToken {
	id: string;
	name: string;
	type: "color" | "typography" | "spacing" | "border" | "shadow";
	value: string | number;
	reference?: string;
	category: string;
}

export interface TokenCategory {
	id: string;
	name: string;
	tokens: DesignToken[];
}

const props = defineProps<{
	categories: TokenCategory[];
	selectedTokenId: string | null;
}>();

const emit = defineEmits<{
	(e: "select", tokenId: string): void;
	(e: "create", category: string): void;
	(e: "update", tokenId: string, updates: Partial<DesignToken>): void;
	(e: "delete", tokenId: string): void;
	(e: "duplicate", tokenId: string): void;
	(e: "import"): void;
	(e: "export"): void;
}>();

const activeCategory = ref<string>("all");
const editingToken = ref<string | null>(null);
const editValue = ref("");

const filteredTokens = computed(() => {
	if (activeCategory.value === "all") {
		return props.categories.flatMap(c => c.tokens);
	}
	return props.categories.find(c => c.id === activeCategory.value)?.tokens
		|| [];
});

const getTypeIcon = (type: DesignToken["type"]): string => {
	const icons: Record<string, string> = {
		color: "🎨",
		typography: "🔤",
		spacing: "📏",
		border: "⬜",
		shadow: "☁️",
	};
	return icons[type] || "📦";
};

const getTokenPreviewStyle = (token: DesignToken): Record<string, string> => {
	switch (token.type) {
		case "color":
			return { backgroundColor: token.value as string };
		case "spacing":
			return {
				width: `${token.value}px`,
				height: `${token.value}px`,
				backgroundColor: "#3B82F6",
			};
		case "border":
			return { border: `2px solid ${token.value}` };
		case "shadow":
			return { boxShadow: token.value as string };
		default:
			return {};
	}
};

const startEdit = (token: DesignToken) => {
	editingToken.value = token.id;
	editValue.value = String(token.value);
};

const saveEdit = (tokenId: string) => {
	const token = filteredTokens.value.find(t => t.id === tokenId);
	if (token) {
		const value = token.type === "spacing"
			? Number(editValue.value)
			: editValue.value;
		emit("update", tokenId, { value });
	}
	editingToken.value = null;
};

const cancelEdit = () => {
	editingToken.value = null;
	editValue.value = "";
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Design Tokens
			</h3>
			<div class="flex items-center gap-1">
				<button
					type="button"
					class="p-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500"
					title="Import Tokens"
					@click="$emit('import')"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
						/>
					</svg>
				</button>
				<button
					type="button"
					class="p-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500"
					title="Export Tokens"
					@click="$emit('export')"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div class="flex gap-1 overflow-x-auto pb-1">
			<button
				type="button"
				class="px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors"
				:class="activeCategory === 'all'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
				@click="activeCategory = 'all'"
			>
				All
			</button>
			<button
				v-for="cat in categories"
				:key="cat.id"
				type="button"
				class="px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors"
				:class="activeCategory === cat.id
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
				@click="activeCategory = cat.id"
			>
				{{ cat.name }}
			</button>
		</div>

		<div class="space-y-1 max-h-64 overflow-y-auto">
			<div
				v-for="token in filteredTokens"
				:key="token.id"
				class="group flex items-center gap-2 p-2 rounded border transition-all"
				:class="selectedTokenId === token.id
				? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
				@click="$emit('select', token.id)"
			>
				<div class="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">
					{{ getTypeIcon(token.type) }}
				</div>

				<div class="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div class="w-full h-full" :style="getTokenPreviewStyle(token)" />
				</div>

				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
						{{ token.name }}
					</div>
					<div v-if="token.reference" class="text-xs text-blue-500">
						→ {{ token.reference }}
					</div>
				</div>

				<div v-if="editingToken === token.id" class="flex items-center gap-1">
					<input
						v-model="editValue"
						type="text"
						class="w-20 px-1.5 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@keyup.enter="saveEdit(token.id)"
						@keyup.escape="cancelEdit"
					>
					<button
						type="button"
						class="p-1 text-green-600"
						@click.stop="saveEdit(token.id)"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</button>
				</div>
				<div
					v-else
					class="text-xs text-gray-500 font-mono truncate max-w-[80px]"
				>
					{{ token.value }}
				</div>

				<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
					<button
						type="button"
						class="p-1 text-gray-400 hover:text-gray-600"
						title="Edit"
						@click.stop="startEdit(token)"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
							/>
						</svg>
					</button>
					<button
						type="button"
						class="p-1 text-gray-400 hover:text-blue-500"
						title="Duplicate"
						@click.stop="$emit('duplicate', token.id)"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
					</button>
					<button
						type="button"
						class="p-1 text-gray-400 hover:text-red-500"
						title="Delete"
						@click.stop="$emit('delete', token.id)"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<button
			type="button"
			class="w-full p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
			@click="$emit('create', activeCategory === 'all' ? 'colors' : activeCategory)"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/>
			</svg>
			Add Token
		</button>
	</div>
</template>
