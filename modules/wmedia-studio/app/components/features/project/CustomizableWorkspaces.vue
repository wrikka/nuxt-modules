<script setup lang="ts">
interface WorkspacePanel {
	id: string;
	name: string;
	icon: string;
	width: number;
	visible: boolean;
	position: "left" | "right" | "bottom" | "top";
}

interface Workspace {
	id: string;
	name: string;
	icon: string;
	description: string;
	panels: WorkspacePanel[];
	isDefault?: boolean;
}

const workspaces = ref<Workspace[]>([
	{
		id: "1",
		name: "Video Editing",
		icon: "mdi:video",
		description: "Timeline-based video editing with preview",
		isDefault: true,
		panels: [
			{
				id: "p1",
				name: "Media Library",
				icon: "mdi:folder-multiple",
				width: 250,
				visible: true,
				position: "left",
			},
			{
				id: "p2",
				name: "Timeline",
				icon: "mdi:timeline",
				width: 0,
				visible: true,
				position: "bottom",
			},
			{
				id: "p3",
				name: "Preview",
				icon: "mdi:video",
				width: 0,
				visible: true,
				position: "top",
			},
			{
				id: "p4",
				name: "Properties",
				icon: "mdi:tune",
				width: 300,
				visible: true,
				position: "right",
			},
			{
				id: "p5",
				name: "Effects",
				icon: "mdi:magic-staff",
				width: 250,
				visible: true,
				position: "right",
			},
		],
	},
	{
		id: "2",
		name: "Audio Production",
		icon: "mdi:music",
		description: "Audio editing and mixing workspace",
		panels: [
			{
				id: "p1",
				name: "Media Library",
				icon: "mdi:folder-multiple",
				width: 250,
				visible: true,
				position: "left",
			},
			{
				id: "p6",
				name: "Audio Tracks",
				icon: "mdi:waveform",
				width: 0,
				visible: true,
				position: "bottom",
			},
			{
				id: "p7",
				name: "Mixer",
				icon: "mdi:sliders",
				width: 350,
				visible: true,
				position: "right",
			},
			{
				id: "p8",
				name: "Effects Rack",
				icon: "mdi:speaker",
				width: 250,
				visible: true,
				position: "right",
			},
		],
	},
	{
		id: "3",
		name: "Color Grading",
		icon: "mdi:palette",
		description: "Professional color correction and grading",
		panels: [
			{
				id: "p9",
				name: "Scopes",
				icon: "mdi:chart-bar",
				width: 300,
				visible: true,
				position: "left",
			},
			{
				id: "p3",
				name: "Preview",
				icon: "mdi:video",
				width: 0,
				visible: true,
				position: "top",
			},
			{
				id: "p10",
				name: "Color Wheels",
				icon: "mdi:palette",
				width: 300,
				visible: true,
				position: "right",
			},
			{
				id: "p11",
				name: "Curves",
				icon: "mdi:chart-line",
				width: 250,
				visible: true,
				position: "right",
			},
		],
	},
	{
		id: "4",
		name: "Motion Graphics",
		icon: "mdi:sparkles",
		description: "Animation and motion design workspace",
		panels: [
			{
				id: "p12",
				name: "Layers",
				icon: "mdi:layers",
				width: 250,
				visible: true,
				position: "left",
			},
			{
				id: "p13",
				name: "Canvas",
				icon: "mdi:view-dashboard",
				width: 0,
				visible: true,
				position: "top",
			},
			{
				id: "p14",
				name: "Timeline",
				icon: "mdi:timeline",
				width: 0,
				visible: true,
				position: "bottom",
			},
			{
				id: "p15",
				name: "Tools",
				icon: "mdi:ruler-square",
				width: 250,
				visible: true,
				position: "right",
			},
		],
	},
]);

const selectedWorkspace = ref<Workspace>(workspaces.value[0]!);
const showCreateModal = ref(false);
const newWorkspaceName = ref("");
const showSaveConfirm = ref(false);
const hasChanges = ref(false);

function selectWorkspace(workspace: Workspace) {
	selectedWorkspace.value = workspace;
}

function togglePanel(panelId: string) {
	const panel = selectedWorkspace.value.panels.find(p => p.id === panelId);
	if (panel) {
		panel.visible = !panel.visible;
		hasChanges.value = true;
	}
}

function movePanel(panelId: string, direction: "left" | "right") {
	const panels = selectedWorkspace.value.panels;
	const index = panels.findIndex(p => p.id === panelId);
	if (index > -1) {
		const newIndex = direction === "left" ? index - 1 : index + 1;
		if (newIndex >= 0 && newIndex < panels.length) {
			const removed = panels.splice(index, 1)[0];
			if (removed) {
				panels.splice(newIndex, 0, removed);
				hasChanges.value = true;
			}
		}
	}
}

function createWorkspace() {
	if (newWorkspaceName.value) {
		workspaces.value.push({
			id: Date.now().toString(),
			name: newWorkspaceName.value,
			icon: "mdi:desktop",
			description: "Custom workspace",
			panels: [...selectedWorkspace.value.panels],
		});
		newWorkspaceName.value = "";
		showCreateModal.value = false;
	}
}

function saveWorkspace() {
	showSaveConfirm.value = true;
	setTimeout(() => {
		showSaveConfirm.value = false;
		hasChanges.value = false;
	}, 1500);
}

function resetWorkspace() {
	hasChanges.value = false;
}

function exportWorkspace() {
	alert("Workspace configuration exported!");
}
</script>

<template>
	<div class="customizable-workspaces">
		<h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
			<Icon name="mdi:view-dashboard" class="w-6 h-6" />
			Customizable Workspaces
		</h2>
		<p class="text-gray-500 mb-6">
			Save/load panel layouts for different workflows
		</p>

		<!-- Workspace Selector -->
		<div class="flex gap-2 mb-6 overflow-x-auto">
			<button
				v-for="workspace in workspaces"
				:key="workspace.id"
				@click="selectWorkspace(workspace)"
				class="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
				:class="selectedWorkspace.id === workspace.id
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 hover:bg-gray-200'"
			>
				<Icon :name="workspace.icon" class="w-5 h-5" />
				<span>{{ workspace.name }}</span>
				<span v-if="workspace.isDefault" class="text-xs opacity-75"
				>(Default)</span>
			</button>
			<button
				@click="showCreateModal = true"
				class="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed hover:bg-gray-50"
			>
				<Icon name="mdi:plus" class="w-5 h-5" />
				<span>New</span>
			</button>
		</div>

		<!-- Current Workspace Info -->
		<div class="bg-blue-50 rounded-lg p-4 mb-6">
			<h3 class="font-semibold flex items-center gap-2">
				<Icon :name="selectedWorkspace.icon" class="w-5 h-5" />
				{{ selectedWorkspace.name }}
			</h3>
			<p class="text-sm text-gray-600 mt-1">
				{{ selectedWorkspace.description }}
			</p>
		</div>

		<!-- Panel Configuration -->
		<div class="grid grid-cols-2 gap-6 mb-6">
			<!-- Panel List -->
			<div class="bg-gray-50 rounded-lg p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold">Panels</h3>
					<span class="text-sm text-gray-500">
						{{ selectedWorkspace.panels.filter(p => p.visible).length }} of {{
							selectedWorkspace.panels.length
						}} visible
					</span>
				</div>

				<div class="space-y-2">
					<div
						v-for="(panel, index) in selectedWorkspace.panels"
						:key="panel.id"
						class="flex items-center gap-3 p-3 bg-white rounded-lg"
					>
						<input
							:checked="panel.visible"
							type="checkbox"
							class="rounded"
							@change="togglePanel(panel.id)"
						/>
						<Icon :name="panel.icon" class="w-4 h-4 text-gray-500" />
						<span class="flex-1">{{ panel.name }}</span>
						<div class="flex gap-1">
							<button
								:disabled="index === 0"
								class="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
								@click="movePanel(panel.id, 'left')"
							>
								<Icon name="mdi:chevron-up" class="w-4 h-4" />
							</button>
							<button
								:disabled="index === selectedWorkspace.panels.length - 1"
								class="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
								@click="movePanel(panel.id, 'right')"
							>
								<Icon name="mdi:chevron-down" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Layout Preview -->
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-4">Layout Preview</h3>
				<div class="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
					<!-- Left Panels -->
					<div
						v-for='panel in selectedWorkspace.panels.filter(p =>
							p.position === "left" && p.visible
						)'
						:key="panel.id"
						class="absolute left-0 top-0 bottom-1/2 bg-blue-100 border-r border-b flex items-center justify-center text-xs"
						:style="{ width: `${panel.width / 5}px` }"
					>
						<Icon :name="panel.icon" class="w-4 h-4" />
						{{ panel.name }}
					</div>

					<!-- Right Panels -->
					<div
						v-for='panel in selectedWorkspace.panels.filter(p =>
							p.position === "right" && p.visible
						)'
						:key="panel.id"
						class="absolute right-0 top-0 bottom-1/2 bg-green-100 border-l border-b flex items-center justify-center text-xs"
						:style="{ width: `${panel.width / 5}px` }"
					>
						<Icon :name="panel.icon" class="w-4 h-4" />
						{{ panel.name }}
					</div>

					<!-- Top Panel (Preview) -->
					<div
						v-for='panel in selectedWorkspace.panels.filter(p =>
							p.position === "top" && p.visible
						)'
						:key="panel.id"
						class="absolute left-1/4 right-1/4 top-0 h-2/3 bg-purple-100 border-b flex items-center justify-center"
					>
						<Icon :name="panel.icon" class="w-4 h-4 mr-1" />
						{{ panel.name }}
					</div>

					<!-- Bottom Panel (Timeline) -->
					<div
						v-for='panel in selectedWorkspace.panels.filter(p =>
							p.position === "bottom" && p.visible
						)'
						:key="panel.id"
						class="absolute left-1/4 right-1/4 bottom-0 h-1/3 bg-yellow-100 border-t flex items-center justify-center"
					>
						<Icon :name="panel.icon" class="w-4 h-4 mr-1" />
						{{ panel.name }}
					</div>
				</div>
			</div>
		</div>

		<!-- Keyboard Shortcuts -->
		<div class="bg-gray-50 rounded-lg p-4 mb-6">
			<h3 class="font-semibold mb-3">Quick Switch Shortcuts</h3>
			<div class="grid grid-cols-4 gap-2 text-sm">
				<div
					v-for="(workspace, index) in workspaces.slice(0, 4)"
					:key="workspace.id"
					class="flex items-center gap-2"
				>
					<kbd class="bg-white px-2 py-1 rounded border">Ctrl+{{
							index + 1
						}}</kbd>
					<span>{{ workspace.name }}</span>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-3">
			<button
				@click="saveWorkspace"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				:class="{ 'animate-pulse': hasChanges }"
			>
				<Icon name="mdi:content-save" class="w-4 h-4 mr-1" />
				Save Layout
			</button>
			<button
				@click="resetWorkspace"
				class="px-4 py-2 border rounded-lg hover:bg-gray-50"
			>
				<Icon name="mdi:refresh" class="w-4 h-4 mr-1" />
				Reset to Default
			</button>
			<button
				@click="exportWorkspace"
				class="px-4 py-2 border rounded-lg hover:bg-gray-50"
			>
				<Icon name="mdi:upload" class="w-4 h-4 mr-1" />
				Export
			</button>
			<button class="px-4 py-2 border rounded-lg hover:bg-gray-50">
				<Icon name="mdi:download" class="w-4 h-4 mr-1" />
				Import
			</button>
		</div>

		<!-- Save Confirmation -->
		<div
			v-if="showSaveConfirm"
			class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
		>
			<Icon name="mdi:check" class="w-4 h-4 mr-1" />
			Workspace saved!
		</div>

		<!-- Create Modal -->
		<div
			v-if="showCreateModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-xl font-bold mb-4">Create New Workspace</h3>
				<input
					v-model="newWorkspaceName"
					type="text"
					placeholder="Workspace name..."
					class="w-full border rounded-lg px-4 py-2 mb-4"
				/>
				<div class="flex justify-end gap-2">
					<button
						@click="showCreateModal = false"
						class="px-4 py-2 border rounded-lg"
					>
						Cancel
					</button>
					<button
						@click="createWorkspace"
						:disabled="!newWorkspaceName"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.customizable-workspaces {
	padding: 1.5rem;
}
</style>
