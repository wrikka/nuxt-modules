<script setup lang="ts">
const showLinks = ref(false);
const linkMode = ref<"auto" | "manual">("auto");
const selectedFrame = ref("Frame 1");

const frames = ["Frame 1", "Frame 2", "Frame 3", "Home", "About", "Contact"];

const links = ref([
	{
		id: 1,
		from: "Frame 1",
		to: "Frame 2",
		trigger: "On Click",
		animation: "Slide Right",
	},
	{
		id: 2,
		from: "Frame 2",
		to: "Frame 3",
		trigger: "On Hover",
		animation: "Fade",
	},
	{
		id: 3,
		from: "Frame 3",
		to: "Home",
		trigger: "After Delay",
		animation: "Instant",
		delay: "2s",
	},
]);

const addLink = () => {
	links.value.push({
		id: Date.now(),
		from: selectedFrame.value,
		to: frames[0]!,
		trigger: "On Click",
		animation: "Instant",
	});
};

const deleteLink = (id: number) => {
	links.value = links.value.filter(l => l.id !== id);
};
</script>

<template>
	<div>
		<!-- Floating Action Button -->
		<button
			class="fixed right-4 bottom-80 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-pink-400 ring-offset-2': showLinks }"
			@click="showLinks = !showLinks"
			title="Prototyping Links"
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
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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
				v-if="showLinks"
				class="fixed right-4 bottom-96 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Prototyping Links</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showLinks = false"
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

				<div class="p-4 space-y-4">
					<!-- Mode Toggle -->
					<div class="flex rounded-lg bg-gray-800 p-1">
						<button
							class="flex-1 px-3 py-1.5 text-sm rounded-md transition-colors"
							:class="linkMode === 'auto'
							? 'bg-pink-600 text-white'
							: 'text-gray-400 hover:text-white'"
							@click="linkMode = 'auto'"
						>
							Auto
						</button>
						<button
							class="flex-1 px-3 py-1.5 text-sm rounded-md transition-colors"
							:class="linkMode === 'manual'
							? 'bg-pink-600 text-white'
							: 'text-gray-400 hover:text-white'"
							@click="linkMode = 'manual'"
						>
							Manual
						</button>
					</div>

					<!-- Current Frame -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block"
						>Current Frame</label>
						<select
							v-model="selectedFrame"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
						>
							<option v-for="frame in frames" :key="frame" :value="frame">
								{{ frame }}
							</option>
						</select>
					</div>

					<!-- Links List -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label class="text-gray-400 text-xs">Interactions</label>
							<button
								class="px-2 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded flex items-center gap-1 transition-colors"
								@click="addLink"
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

						<div
							v-if="links.length === 0"
							class="text-center py-4 text-gray-500 text-sm"
						>
							No interactions yet
						</div>

						<div
							v-for="link in links"
							:key="link.id"
							class="group p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
						>
							<div class="flex items-center gap-2 mb-2">
								<div class="flex items-center gap-1 text-xs">
									<span class="px-2 py-0.5 bg-gray-700 rounded text-gray-300">{{
										link.from
									}}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										class="text-gray-500"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
									<span
										class="px-2 py-0.5 bg-pink-900 bg-opacity-50 rounded text-pink-300"
									>{{ link.to }}</span>
								</div>
								<button
									class="ml-auto p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
									@click="deleteLink(link.id)"
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
							<div class="flex items-center gap-2 text-xs">
								<select class="px-2 py-1 bg-gray-700 rounded text-gray-300 border-none focus:ring-1 focus:ring-pink-500">
									<option>On Click</option>
									<option>On Hover</option>
									<option>After Delay</option>
									<option>On Scroll</option>
								</select>
								<select class="px-2 py-1 bg-gray-700 rounded text-gray-300 border-none focus:ring-1 focus:ring-pink-500">
									<option>Instant</option>
									<option>Slide Right</option>
									<option>Slide Left</option>
									<option>Fade</option>
									<option>Scale</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Preview Button -->
					<button class="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-all">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
						Preview Prototype
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
