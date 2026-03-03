<script setup lang="ts">
const showDataBinding = ref(false);
const activeTab = ref("variables");

const variables = ref([
	{ id: 1, name: "username", type: "string", value: "John Doe" },
	{ id: 2, name: "isLoggedIn", type: "boolean", value: "true" },
	{ id: 3, name: "itemCount", type: "number", value: "42" },
	{ id: 4, name: "userEmail", type: "string", value: "john@example.com" },
]);

const dataSources = ref([
	{
		id: 1,
		name: "Users API",
		type: "REST",
		url: "https://api.example.com/users",
		status: "connected",
	},
	{
		id: 2,
		name: "Products DB",
		type: "GraphQL",
		url: "https://graphql.example.com",
		status: "disconnected",
	},
]);

const addVariable = () => {
	variables.value.push({
		id: Date.now(),
		name: `var${variables.value.length + 1}`,
		type: "string",
		value: "",
	});
};

const deleteVariable = (id: number) => {
	variables.value = variables.value.filter(v => v.id !== id);
};
</script>

<template>
	<div>
		<button
			class="fixed right-52 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-violet-400 ring-offset-2': showDataBinding }"
			@click="showDataBinding = !showDataBinding"
			title="Data Binding"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<ellipse cx="12" cy="5" rx="9" ry="3" />
				<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
				<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showDataBinding"
				class="fixed right-52 bottom-20 z-50 w-96 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Data Binding</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showDataBinding = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="flex border-b border-gray-800">
					<button
						class="flex-1 px-4 py-2 text-sm transition-colors"
						:class="activeTab === 'variables'
						? 'bg-violet-600 text-white'
						: 'text-gray-400 hover:text-white'"
						@click="activeTab = 'variables'"
					>
						Variables
					</button>
					<button
						class="flex-1 px-4 py-2 text-sm transition-colors"
						:class="activeTab === 'sources'
						? 'bg-violet-600 text-white'
						: 'text-gray-400 hover:text-white'"
						@click="activeTab = 'sources'"
					>
						Data Sources
					</button>
				</div>

				<div class="p-4">
					<!-- Variables Tab -->
					<div v-if="activeTab === 'variables'" class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-gray-400 text-xs">{{ variables.length }}
								variables</span>
							<button
								class="px-2 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded flex items-center gap-1 transition-colors"
								@click="addVariable"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
								Add
							</button>
						</div>

						<div class="space-y-2 max-h-64 overflow-y-auto">
							<div
								v-for="variable in variables"
								:key="variable.id"
								class="group p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
							>
								<div class="flex items-center gap-2 mb-2">
									<span
										class="px-1.5 py-0.5 rounded text-[10px] font-mono"
										:class="{
											'bg-blue-900 text-blue-300': variable.type === 'string',
											'bg-green-900 text-green-300':
												variable.type === 'boolean',
											'bg-orange-900 text-orange-300':
												variable.type === 'number',
										}"
									>
										{{ variable.type }}
									</span>
									<input
										v-model="variable.name"
										class="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-1"
									>
									<button
										class="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
										@click="deleteVariable(variable.id)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M18 6 6 18M6 6l12 12" />
										</svg>
									</button>
								</div>
								<input
									v-model="variable.value"
									class="w-full bg-gray-900 text-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
								>
							</div>
						</div>
					</div>

					<!-- Data Sources Tab -->
					<div v-else class="space-y-3">
						<button class="w-full px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded flex items-center justify-center gap-2 transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
							Connect Data Source
						</button>

						<div class="space-y-2">
							<div
								v-for="source in dataSources"
								:key="source.id"
								class="p-3 rounded-lg bg-gray-800"
							>
								<div class="flex items-center justify-between mb-1">
									<span class="text-white text-sm font-medium">{{
										source.name
									}}</span>
									<span
										class="px-1.5 py-0.5 rounded text-[10px]"
										:class="source.status === 'connected'
										? 'bg-green-900 text-green-300'
										: 'bg-red-900 text-red-300'"
									>
										{{ source.status }}
									</span>
								</div>
								<div class="text-gray-500 text-xs">
									{{ source.type }} · {{ source.url }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
