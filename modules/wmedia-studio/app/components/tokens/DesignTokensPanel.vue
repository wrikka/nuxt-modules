<script setup lang="ts">
import type { DesignToken, TokenCategory } from "#shared/types";

interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	selectToken: [token: DesignToken];
}>();

const activeTab = ref<string>("colors");

const categories: TokenCategory[] = [
	{
		id: "colors",
		name: "Colors",
		icon: "mdi:palette",
		tokens: [
			{
				id: "primary",
				name: "Primary",
				type: "color",
				value: "#3B82F6",
				category: "brand",
				description: "Main brand color",
			},
			{
				id: "secondary",
				name: "Secondary",
				type: "color",
				value: "#8B5CF6",
				category: "brand",
				description: "Accent color",
			},
			{
				id: "success",
				name: "Success",
				type: "color",
				value: "#22C55E",
				category: "semantic",
				description: "Success states",
			},
			{
				id: "warning",
				name: "Warning",
				type: "color",
				value: "#F59E0B",
				category: "semantic",
				description: "Warning states",
			},
			{
				id: "error",
				name: "Error",
				type: "color",
				value: "#EF4444",
				category: "semantic",
				description: "Error states",
			},
			{
				id: "text-primary",
				name: "Text Primary",
				type: "color",
				value: "#1F2937",
				category: "text",
				description: "Main text color",
			},
			{
				id: "text-secondary",
				name: "Text Secondary",
				type: "color",
				value: "#6B7280",
				category: "text",
				description: "Muted text",
			},
			{
				id: "bg-primary",
				name: "Background",
				type: "color",
				value: "#FFFFFF",
				category: "background",
				description: "Main background",
			},
			{
				id: "bg-muted",
				name: "Muted BG",
				type: "color",
				value: "#F3F4F6",
				category: "background",
				description: "Secondary background",
			},
		],
	},
	{
		id: "typography",
		name: "Typography",
		icon: "mdi:format-text",
		tokens: [
			{
				id: "font-heading",
				name: "Heading Font",
				type: "typography",
				value: "Inter, sans-serif",
				category: "font",
				description: "For headlines",
			},
			{
				id: "font-body",
				name: "Body Font",
				type: "typography",
				value: "Inter, sans-serif",
				category: "font",
				description: "For body text",
			},
			{
				id: "text-xs",
				name: "Text XS",
				type: "typography",
				value: "12px",
				category: "size",
				description: "Extra small text",
			},
			{
				id: "text-sm",
				name: "Text SM",
				type: "typography",
				value: "14px",
				category: "size",
				description: "Small text",
			},
			{
				id: "text-base",
				name: "Text Base",
				type: "typography",
				value: "16px",
				category: "size",
				description: "Base text size",
			},
			{
				id: "text-lg",
				name: "Text LG",
				type: "typography",
				value: "18px",
				category: "size",
				description: "Large text",
			},
			{
				id: "text-xl",
				name: "Text XL",
				type: "typography",
				value: "20px",
				category: "size",
				description: "Extra large",
			},
			{
				id: "text-2xl",
				name: "Text 2XL",
				type: "typography",
				value: "24px",
				category: "size",
				description: "Heading 2",
			},
		],
	},
	{
		id: "spacing",
		name: "Spacing",
		icon: "mdi:arrow-all",
		tokens: [
			{
				id: "space-1",
				name: "Space 1",
				type: "spacing",
				value: "4px",
				category: "unit",
				description: "4px spacing",
			},
			{
				id: "space-2",
				name: "Space 2",
				type: "spacing",
				value: "8px",
				category: "unit",
				description: "8px spacing",
			},
			{
				id: "space-3",
				name: "Space 3",
				type: "spacing",
				value: "12px",
				category: "unit",
				description: "12px spacing",
			},
			{
				id: "space-4",
				name: "Space 4",
				type: "spacing",
				value: "16px",
				category: "unit",
				description: "16px spacing",
			},
			{
				id: "space-6",
				name: "Space 6",
				type: "spacing",
				value: "24px",
				category: "unit",
				description: "24px spacing",
			},
			{
				id: "space-8",
				name: "Space 8",
				type: "spacing",
				value: "32px",
				category: "unit",
				description: "32px spacing",
			},
			{
				id: "space-12",
				name: "Space 12",
				type: "spacing",
				value: "48px",
				category: "unit",
				description: "48px spacing",
			},
			{
				id: "space-16",
				name: "Space 16",
				type: "spacing",
				value: "64px",
				category: "unit",
				description: "64px spacing",
			},
		],
	},
	{
		id: "shadows",
		name: "Shadows",
		icon: "mdi:layers",
		tokens: [
			{
				id: "shadow-sm",
				name: "Shadow SM",
				type: "shadow",
				value: "0 1px 2px rgba(0,0,0,0.05)",
				category: "shadow",
				description: "Small shadow",
			},
			{
				id: "shadow-md",
				name: "Shadow MD",
				type: "shadow",
				value: "0 4px 6px rgba(0,0,0,0.1)",
				category: "shadow",
				description: "Medium shadow",
			},
			{
				id: "shadow-lg",
				name: "Shadow LG",
				type: "shadow",
				value: "0 10px 15px rgba(0,0,0,0.1)",
				category: "shadow",
				description: "Large shadow",
			},
			{
				id: "shadow-xl",
				name: "Shadow XL",
				type: "shadow",
				value: "0 20px 25px rgba(0,0,0,0.15)",
				category: "shadow",
				description: "Extra large shadow",
			},
		],
	},
	{
		id: "borders",
		name: "Borders",
		icon: "mdi:shape",
		tokens: [
			{
				id: "radius-sm",
				name: "Radius SM",
				type: "radius",
				value: "4px",
				category: "radius",
				description: "Small radius",
			},
			{
				id: "radius-md",
				name: "Radius MD",
				type: "radius",
				value: "8px",
				category: "radius",
				description: "Medium radius",
			},
			{
				id: "radius-lg",
				name: "Radius LG",
				type: "radius",
				value: "12px",
				category: "radius",
				description: "Large radius",
			},
			{
				id: "radius-xl",
				name: "Radius XL",
				type: "radius",
				value: "16px",
				category: "radius",
				description: "Extra large radius",
			},
			{
				id: "radius-full",
				name: "Radius Full",
				type: "radius",
				value: "9999px",
				category: "radius",
				description: "Full rounded",
			},
			{
				id: "border-light",
				name: "Border Light",
				type: "border",
				value: "1px solid #E5E7EB",
				category: "border",
				description: "Light border",
			},
			{
				id: "border-medium",
				name: "Border Medium",
				type: "border",
				value: "1px solid #D1D5DB",
				category: "border",
				description: "Medium border",
			},
		],
	},
];

const selectedToken = ref<DesignToken | null>(null);
const editingValue = ref("");

const startEdit = (token: DesignToken) => {
	selectedToken.value = token;
	editingValue.value = token.value;
};

const saveToken = () => {
	if (selectedToken.value && editingValue.value) {
		selectedToken.value.value = editingValue.value;
		selectedToken.value = null;
	}
};

const currentCategory = computed(() =>
	categories.find(c => c.id === activeTab.value)!
);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed left-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-30"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Icon name="mdi:palette" class="w-5 h-5 text-purple-500" />
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Design Tokens
				</h3>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				v-for="category in categories"
				:key="category.id"
				:class="[
					'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
					activeTab === category.id
						? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
						: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
				]"
				@click="activeTab = category.id"
			>
				<Icon :name="category.icon" class="w-5 h-5" />
				{{ category.name }}
			</button>
		</div>

		<!-- Token List -->
		<div class="flex-1 overflow-y-auto p-4">
			<div class="space-y-3">
				<div
					v-for="token in currentCategory.tokens"
					:key="token.id"
					class="group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer"
					@click="startEdit(token)"
				>
					<div class="flex items-center justify-between mb-2">
						<div>
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ token.name }}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{{ token.description }}
							</p>
						</div>
						<button class="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all">
							<Icon name="mdi:pencil" class="w-4 h-4 text-gray-500" />
						</button>
					</div>

					<!-- Token Preview -->
					<div class="flex items-center gap-3">
						<!-- Color Preview -->
						<div
							v-if="token.type === 'color'"
							class="w-10 h-10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
							:style="{ backgroundColor: token.value }"
						/>

						<!-- Typography Preview -->
						<div
							v-else-if="token.type === 'typography'"
							class="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg"
						>
							<span class="text-lg font-bold text-gray-700 dark:text-gray-300"
							>Aa</span>
						</div>

						<!-- Spacing Preview -->
						<div
							v-else-if="token.type === 'spacing'"
							class="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg"
						>
							<div
								class="bg-blue-500 rounded"
								:style="{ width: token.value, height: token.value }"
							/>
						</div>

						<!-- Shadow Preview -->
						<div
							v-else-if="token.type === 'shadow'"
							class="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg"
							:style="{ boxShadow: token.value }"
						/>

						<!-- Border/Radius Preview -->
						<div
							v-else
							class="w-10 h-10 bg-blue-500"
							:style="{ borderRadius: token.value }"
						/>

						<code class="text-xs text-gray-600 dark:text-gray-400 font-mono">{{
							token.value
						}}</code>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Modal -->
		<div
			v-if="selectedToken"
			class="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
				<h4 class="font-semibold text-gray-900 dark:text-white mb-4">
					Edit Token
				</h4>
				<div class="mb-4">
					<label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{
						selectedToken.name
					}}</label>
					<input
						v-if="selectedToken.type === 'color'"
						v-model="editingValue"
						type="color"
						class="w-full h-10 rounded-lg cursor-pointer"
					>
					<input
						v-else
						v-model="editingValue"
						type="text"
						class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-white"
					>
				</div>
				<div class="flex gap-2">
					<button
						class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
						@click="saveToken"
					>
						Save
					</button>
					<button
						class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
						@click="selectedToken = null"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
