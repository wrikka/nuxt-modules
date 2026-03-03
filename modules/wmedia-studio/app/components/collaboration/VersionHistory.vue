<script setup lang="ts">
import type { DesignerSnapshot, Project } from "#shared/types";
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const { currentProject, history, historyIndex, canUndo, canRedo } = storeToRefs(
	projectStore,
);

const showHistoryPanel = ref(false);
const selectedVersionId = ref<number | null>(null);

const formatTime = (timestamp: number) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(new Date(timestamp));
};

const formatRelativeTime = (timestamp: number) => {
	const now = Date.now();
	const diff = now - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};

const getVersionLabel = (snapshot: DesignerSnapshot, index: number) => {
	if (index === history.value.length - 1) return "Current";
	if (index === 0) return "Initial";
	return `Version ${index + 1}`;
};

const restoreVersion = async (index: number) => {
	if (!currentProject.value) return;

	// Show confirmation dialog
	const confirmed = confirm(
		"Restore this version? Current changes will be saved as a new version.",
	);
	if (!confirmed) return;

	await projectStore.loadFromHistory(index);
	showHistoryPanel.value = false;
};

const createBranch = (index: number) => {
	// TODO: Implement branch creation
	console.log("Create branch from version", index);
};

const downloadVersion = (snapshot: DesignerSnapshot) => {
	const dataStr = JSON.stringify(JSON.parse(snapshot.json), null, 2);
	const dataUri = `data:application/json;charset=utf-8,${
		encodeURIComponent(dataStr)
	}`;

	const link = document.createElement("a");
	link.setAttribute("href", dataUri);
	link.setAttribute(
		"download",
		`${currentProject.value?.name || "project"}-v${snapshot.version}.json`,
	);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
</script>

<template>
	<div>
		<!-- History Toggle Button -->
		<button
			class="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'bg-purple-700': showHistoryPanel }"
			@click="showHistoryPanel = !showHistoryPanel"
			title="Version History"
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
				<path d="M3 3v5h5" />
				<path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
				<path d="M12 7v5l4 2" />
			</svg>
		</button>

		<!-- History Panel -->
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="showHistoryPanel"
				class="fixed bottom-20 left-4 top-20 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white">
							Version History
						</h3>
						<p class="text-xs text-gray-500">
							{{ history.length }} saved versions
						</p>
					</div>
					<button
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						@click="showHistoryPanel = false"
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

				<!-- Current Position Indicator -->
				<div class="border-b border-gray-100 bg-blue-50 p-3 dark:border-gray-800 dark:bg-blue-900/20">
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
						<span class="text-sm font-medium text-blue-700 dark:text-blue-300">
							Current: Version {{ historyIndex + 1 }} of {{ history.length }}
						</span>
					</div>
				</div>

				<!-- Versions List -->
				<div class="max-h-[calc(100vh-280px)] overflow-y-auto p-4">
					<div class="relative space-y-0">
						<!-- Timeline Line -->
						<div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

						<!-- Version Items -->
						<div
							v-for="(snapshot, index) in [...history].reverse()"
							:key="snapshot.version"
							class="relative flex gap-3 pb-4"
						>
							<!-- Timeline Dot -->
							<div
								class="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2"
								:class="{
									'border-blue-500 bg-blue-500':
										historyIndex === history.length - 1 - index,
									'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800':
										historyIndex !== history.length - 1 - index,
								}"
							/>

							<!-- Version Card -->
							<div
								class="flex-1 rounded-lg border p-3 transition-all hover:shadow-md"
								:class="{
									'border-blue-500 bg-blue-50 dark:border-blue-500/50 dark:bg-blue-900/20':
										historyIndex === history.length - 1 - index,
									'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800':
										historyIndex !== history.length - 1 - index,
								}"
							>
								<div class="mb-1 flex items-center justify-between">
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>
										{{ getVersionLabel(snapshot, history.length - 1 - index) }}
									</span>
									<span class="text-xs text-gray-500">{{
										formatRelativeTime(snapshot.timestamp)
									}}</span>
								</div>
								<p class="mb-2 text-xs text-gray-500">
									{{ formatTime(snapshot.timestamp) }}
								</p>

								<!-- Actions -->
								<div class="flex gap-2">
									<button
										v-if="historyIndex !== history.length - 1 - index"
										class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
										@click="restoreVersion(history.length - 1 - index)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
											<path d="M3 3v5h5" />
										</svg>
										Restore
									</button>
									<button
										class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
										@click="downloadVersion(snapshot)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7 10 12 15 17 10" />
											<line x1="12" x2="12" y1="15" y2="3" />
										</svg>
										Export
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="border-t border-gray-200 p-4 dark:border-gray-700">
					<div class="flex gap-2">
						<button
							class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
							:disabled="!canUndo"
							@click="projectStore.undo()"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M3 7v6h6" />
								<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
							</svg>
							Undo
						</button>
						<button
							class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
							:disabled="!canRedo"
							@click="projectStore.redo()"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 7v6h-6" />
								<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
							</svg>
							Redo
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
