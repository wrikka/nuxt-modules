<script setup lang="ts">
interface DesignToken {
	name: string;
	value: string;
	type: "color" | "spacing" | "typography" | "shadow";
}

const tokens = ref<DesignToken[]>([
	{ name: "primary-500", value: "#3B82F6", type: "color" },
	{ name: "primary-600", value: "#2563EB", type: "color" },
	{ name: "accent-pink", value: "#EC4899", type: "color" },
	{ name: "spacing-xs", value: "4px", type: "spacing" },
	{ name: "spacing-sm", value: "8px", type: "spacing" },
	{ name: "spacing-md", value: "16px", type: "spacing" },
	{ name: "font-heading", value: "Inter, sans-serif", type: "typography" },
	{ name: "shadow-lg", value: "0 10px 15px rgba(0,0,0,0.1)", type: "shadow" },
]);

const activeCategory = ref<
	"all" | "color" | "spacing" | "typography" | "shadow"
>("all");

const filteredTokens = computed(() => {
	if (activeCategory.value === "all") return tokens.value;
	return tokens.value.filter(t => t.type === activeCategory.value);
});

const copyToken = (token: DesignToken) => {
	navigator.clipboard.writeText(`var(--${token.name})`);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Design System Tokens
			</h3>
			<button class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
				Export JSON
			</button>
		</div>

		<!-- Categories -->
		<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
			<button
				v-for='cat in ["all", "color", "spacing", "typography", "shadow"]'
				:key="cat"
				@click="activeCategory = cat as any"
				:class="{
					'bg-blue-500 text-white': activeCategory === cat,
					'bg-gray-100 dark:bg-gray-700': activeCategory !== cat,
				}"
				class="px-3 py-1 rounded-lg text-sm capitalize whitespace-nowrap"
			>
				{{ cat }}
			</button>
		</div>

		<!-- Tokens Grid -->
		<div class="grid grid-cols-2 gap-3">
			<div
				v-for="token in filteredTokens"
				:key="token.name"
				@click="copyToken(token)"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 ring-blue-500 transition-all"
			>
				<div class="flex items-center gap-2 mb-2">
					<div
						v-if="token.type === 'color'"
						class="w-6 h-6 rounded-full border-2 border-white shadow"
						:style="{ backgroundColor: token.value }"
					/>
					<Icon
						v-else
						:name="`mdi:${
							token.type === 'spacing'
								? 'ruler'
								: token.type === 'typography'
								? 'format-font'
								: 'box-shadow'
						}`"
						class="w-5 h-5 text-gray-500"
					/>
					<span class="font-mono text-xs">{{ token.name }}</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ token.value }}
				</p>
			</div>
		</div>
	</div>
</template>
