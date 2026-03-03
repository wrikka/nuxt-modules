<script setup lang="ts">
const isEnabled = ref(true);
const issues = ref([
	{
		id: 1,
		type: "warning",
		message: "Font \"Comic Sans\" is not in your brand kit",
		element: "Headline Text",
		suggestion: "Replace with Inter",
	},
	{
		id: 2,
		type: "error",
		message: "Color #FF6B6B doesn't match brand palette",
		element: "CTA Button",
		suggestion: "Use #3B82F6 (Primary)",
	},
	{
		id: 3,
		type: "info",
		message: "Logo usage is consistent with brand guidelines",
		element: "Header Logo",
		suggestion: null,
	},
]);

const brandKit = {
	colors: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"],
	fonts: ["Inter", "Roboto", "Playfair Display"],
	logo: "🎯",
};

const fixIssue = (issue: typeof issues.value[0]) => {
	alert(`Fixing: ${issue.message}`);
	issues.value = issues.value.filter(i => i.id !== issue.id);
};
</script>

<template>
	<div class="relative">
		<!-- Status Badge -->
		<button
			class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
			:class="issues.some(i => i.type === 'error')
			? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
			: issues.some(i => i.type === 'warning')
			? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
			: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					v-if="issues.some(i => i.type === 'error')"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
				<path
					v-else-if="issues.some(i => i.type === 'warning')"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
				<path
					v-else
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="text-sm font-medium">
				{{ issues.filter(i => i.type !== "info").length }} brand issues
			</span>
		</button>

		<!-- Brand Panel -->
		<div class="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
			<!-- Brand Kit Summary -->
			<div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
				<h4 class="text-sm font-semibold mb-2 flex items-center gap-2">
					<span class="text-lg">{{ brandKit.logo }}</span>
					Active Brand Kit
				</h4>
				<div class="flex gap-2 mb-2">
					<div
						v-for="color in brandKit.colors"
						:key="color"
						class="w-6 h-6 rounded-full border border-gray-200"
						:style="{ backgroundColor: color }"
						:title="color"
					/>
				</div>
				<div class="flex flex-wrap gap-1">
					<span
						v-for="font in brandKit.fonts"
						:key="font"
						class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
					>
						{{ font }}
					</span>
				</div>
			</div>

			<!-- Issues List -->
			<div class="space-y-2">
				<p class="text-xs text-gray-500 mb-2">Consistency Check:</p>
				<div
					v-for="issue in issues"
					:key="issue.id"
					class="p-2 rounded-lg text-sm"
					:class="{
						'bg-red-50 dark:bg-red-900/20 border border-red-200':
							issue.type === 'error',
						'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200':
							issue.type === 'warning',
						'bg-green-50 dark:bg-green-900/20 border border-green-200':
							issue.type === 'info',
					}"
				>
					<div class="flex items-start gap-2">
						<span class="text-lg">
							{{
								issue.type === "error"
								? "❌"
								: issue.type === "warning"
								? "⚠️"
								: "✅"
							}}
						</span>
						<div class="flex-1">
							<p class="font-medium">{{ issue.element }}</p>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								{{ issue.message }}
							</p>
							<div v-if="issue.suggestion" class="mt-1 flex items-center gap-2">
								<span class="text-xs text-gray-500">💡 {{
										issue.suggestion
									}}</span>
								<button
									v-if="issue.type !== 'info'"
									class="text-xs px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700"
									@click="fixIssue(issue)"
								>
									Auto-fix
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
				<p class="text-xs text-gray-500">
					Brand consistency checker runs automatically
				</p>
			</div>
		</div>
	</div>
</template>
