<script setup lang="ts">
interface Props {
	canUndo: boolean;
	canRedo: boolean;
}

defineProps<Props>();

defineEmits<{
	addText: [];
	addRectangle: [];
	addCircle: [];
	addPolygon: [];
	addStar: [];
	addPen: [];
	addImage: [];
	undo: [];
	redo: [];
	bringForward: [];
	sendBackward: [];
	bringToFront: [];
	sendToBack: [];
	alignLeft: [];
	alignCenter: [];
	alignRight: [];
	alignTop: [];
	alignMiddle: [];
	alignBottom: [];
	group: [];
	ungroup: [];
	save: [];
	exportPng: [];
	artboardSettings: [];
	assetLibrary: [];
	templates: [];
	shortcuts: [];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center gap-2">
		<Button variant="secondary" size="sm" @click="$emit('addText')">
			Text
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addRectangle')">
			Rectangle
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addCircle')">
			Circle
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addPolygon')">
			Polygon
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addStar')">
			Star
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addPen')">
			<svg
				class="w-4 h-4 mr-2"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
				>
				</path>
			</svg>
			Pen
		</Button>
		<Button variant="secondary" size="sm" @click="$emit('addImage')">
			Image
		</Button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			:disabled="!canUndo"
			@click="$emit('undo')"
		>
			Undo
		</Button>
		<Button
			variant="ghost"
			size="sm"
			:disabled="!canRedo"
			@click="$emit('redo')"
		>
			Redo
		</Button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			title="Bring Forward"
			@click="$emit('bringForward')"
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
					d="M5 15l7-7 7 7"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Send Backward"
			@click="$emit('sendBackward')"
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
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Bring to Front"
			@click="$emit('bringToFront')"
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
					d="M5 11l7-7 7 7M5 19l7-7 7 7"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Send to Back"
			@click="$emit('sendToBack')"
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
					d="M19 13l-7 7-7-7M19 5l-7 7-7-7"
				/>
			</svg>
		</Button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			title="Align Left"
			@click="$emit('alignLeft')"
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
					d="M4 6h16M4 12h10M4 18h16"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Align Center"
			@click="$emit('alignCenter')"
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
					d="M4 6h16M7 12h10M4 18h16"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Align Right"
			@click="$emit('alignRight')"
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
					d="M4 6h16M10 12h10M4 18h16"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Align Top"
			@click="$emit('alignTop')"
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
					d="M4 6h16M10 12h4M4 18h16"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Align Middle"
			@click="$emit('alignMiddle')"
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
					d="M4 6h16M10 12h4M4 18h16"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Align Bottom"
			@click="$emit('alignBottom')"
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
					d="M4 6h16M10 12h4M4 18h16"
				/>
			</svg>
		</Button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			title="Group (Ctrl+G)"
			@click="$emit('group')"
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
					d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Ungroup (Ctrl+Shift+G)"
			@click="$emit('ungroup')"
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
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</Button>

		<div class="flex-1"></div>

		<Button variant="secondary" size="sm" @click="$emit('save')">
			Save
		</Button>
		<Button variant="primary" size="sm" @click="$emit('exportPng')">
			Export PNG
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Templates"
			@click="$emit('templates')"
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
					d="M4 5a1 1 0 011-1h1m0 0a1 1 0 011 1v3m0 0a1 1 0 011 1v2m0 0a1 1 0 011 1v3m0 0a1 1 0 011 1v2"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Shortcuts"
			@click="$emit('shortcuts')"
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
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 21V7h8"
				/>
			</svg>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			title="Asset Library"
			@click="$emit('assetLibrary')"
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
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</Button>
	</div>
</template>
