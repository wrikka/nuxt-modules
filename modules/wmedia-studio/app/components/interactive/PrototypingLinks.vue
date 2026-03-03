<script setup lang="ts">
const showPrototyping = ref(false);

interface ScreenLink {
	id: string;
	fromScreen: string;
	toScreen: string;
	trigger: "click" | "hover" | "scroll" | "timeout";
	transition: "fade" | "slide" | "push" | "pop" | "flip" | "none";
	duration: number;
	easing: string;
}

const screens = ref([
	{ id: "1", name: "Home" },
	{ id: "2", name: "About" },
	{ id: "3", name: "Contact" },
]);

const links = ref<ScreenLink[]>([
	{
		id: "1",
		fromScreen: "1",
		toScreen: "2",
		trigger: "click",
		transition: "slide",
		duration: 0.3,
		easing: "ease-out",
	},
]);

const transitions = ["fade", "slide", "push", "pop", "flip", "none"];
const triggers = ["click", "hover", "scroll", "timeout"];

const addLink = () => {
	links.value.push({
		id: crypto.randomUUID(),
		fromScreen: screens.value[0]?.id || "",
		toScreen: screens.value[1]?.id || "",
		trigger: "click",
		transition: "fade",
		duration: 0.3,
		easing: "ease-out",
	});
};

const removeLink = (id: string) => {
	links.value = links.value.filter((l) => l.id !== id);
};

const transitionIcons: Record<string, string> = {
	fade: "◯",
	slide: "→",
	push: "⇒",
	pop: "⇐",
	flip: "↻",
	none: "—",
};
</script>

<template>
	<div>
		<button
			class="fixed left-32 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-cyan-400 ring-offset-2': showPrototyping }"
			@click="showPrototyping = !showPrototyping"
			title="Prototyping"
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
				<circle cx="12" cy="12" r="10" />
				<polygon points="10 8 16 12 10 16 10 8" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="showPrototyping"
				class="fixed left-0 top-0 z-40 h-screen w-96 overflow-hidden border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-cyan-600 to-teal-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Prototyping</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showPrototyping = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Flow Preview -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<div class="flex items-center justify-center gap-2">
							<div
								v-for="(screen, i) in screens"
								:key="screen.id"
								class="flex items-center gap-2"
							>
								<div class="rounded-lg bg-cyan-600 px-3 py-2 text-xs text-white">
									{{ screen.name }}
								</div>
								<svg
									v-if="i < screens.length - 1"
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-gray-400"
								>
									<path d="M5 12h14" />
									<path d="m12 5 7 7-7 7" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Links -->
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">
							Links ({{ links.length }})
						</h3>
						<button
							class="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700"
							@click="addLink"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14" />
								<path d="M12 5v14" />
							</svg>
							Add Link
						</button>
					</div>

					<div class="space-y-3">
						<div
							v-for="link in links"
							:key="link.id"
							class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="mb-2 flex items-center justify-between">
								<span class="text-xs font-medium text-gray-500">Link</span>
								<button
									class="text-gray-400 hover:text-red-500"
									@click="removeLink(link.id)"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
								</button>
							</div>

							<div class="mb-3 grid grid-cols-2 gap-2">
								<select
									v-model="link.fromScreen"
									class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
								>
									<option v-for="s in screens" :key="s.id" :value="s.id">
										From: {{ s.name }}
									</option>
								</select>
								<select
									v-model="link.toScreen"
									class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
								>
									<option v-for="s in screens" :key="s.id" :value="s.id">
										To: {{ s.name }}
									</option>
								</select>
							</div>

							<div class="grid grid-cols-3 gap-2">
								<select
									v-model="link.trigger"
									class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
								>
									<option v-for="t in triggers" :key="t" :value="t">
										{{ t }}
									</option>
								</select>
								<select
									v-model="link.transition"
									class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
								>
									<option
										v-for="trans in transitions"
										:key="trans"
										:value="trans"
									>
										{{ transitionIcons[trans] }} {{ trans }}
									</option>
								</select>
								<div class="flex items-center gap-1">
									<input
										v-model.number="link.duration"
										type="number"
										min="0.1"
										max="2"
										step="0.1"
										class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
									/>
									<span class="text-xs text-gray-500">s</span>
								</div>
							</div>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-700">
						Preview Prototype
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
