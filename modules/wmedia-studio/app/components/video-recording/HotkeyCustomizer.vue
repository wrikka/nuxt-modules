<script setup lang="ts">
interface HotkeyConfig {
	action: string;
	key: string;
	ctrl: boolean;
	alt: boolean;
	shift: boolean;
	description: string;
	icon: string;
}

const hotkeys = ref<HotkeyConfig[]>([
	{
		action: "start",
		key: "r",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Start recording",
		icon: "mdi:record",
	},
	{
		action: "stop",
		key: "s",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Stop recording",
		icon: "mdi:stop",
	},
	{
		action: "pause",
		key: "p",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Pause/Resume",
		icon: "mdi:pause",
	},
	{
		action: "mute",
		key: "m",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Toggle mute",
		icon: "mdi:microphone",
	},
	{
		action: "camera",
		key: "c",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Toggle camera",
		icon: "mdi:camera",
	},
	{
		action: "screenshot",
		key: "F12",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Take screenshot",
		icon: "mdi:camera-image",
	},
	{
		action: "drawing",
		key: "d",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Toggle drawing",
		icon: "mdi:pencil",
	},
	{
		action: "pip",
		key: "i",
		ctrl: false,
		alt: false,
		shift: false,
		description: "Toggle PiP",
		icon: "mdi:picture-in-picture",
	},
]);

const isEditing = ref<string | null>(null);
const recordingKey = ref(false);

const startRecordingKey = (action: string) => {
	isEditing.value = action;
	recordingKey.value = true;

	const handler = (e: KeyboardEvent) => {
		e.preventDefault();
		const hotkey = hotkeys.value.find((h) => h.action === action);
		if (hotkey) {
			hotkey.key = e.key === " " ? "Space" : e.key.toUpperCase();
			hotkey.ctrl = e.ctrlKey;
			hotkey.alt = e.altKey;
			hotkey.shift = e.shiftKey;
		}
		recordingKey.value = false;
		isEditing.value = null;
		window.removeEventListener("keydown", handler);
	};

	window.addEventListener("keydown", handler, { once: true });
};

const formatHotkey = (hotkey: HotkeyConfig): string => {
	const parts: string[] = [];
	if (hotkey.ctrl) parts.push("Ctrl");
	if (hotkey.alt) parts.push("Alt");
	if (hotkey.shift) parts.push("Shift");
	parts.push(hotkey.key);
	return parts.join(" + ");
};

const resetToDefaults = () => {
	hotkeys.value = [
		{
			action: "start",
			key: "r",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Start recording",
			icon: "mdi:record",
		},
		{
			action: "stop",
			key: "s",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Stop recording",
			icon: "mdi:stop",
		},
		{
			action: "pause",
			key: "p",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Pause/Resume",
			icon: "mdi:pause",
		},
		{
			action: "mute",
			key: "m",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Toggle mute",
			icon: "mdi:microphone",
		},
		{
			action: "camera",
			key: "c",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Toggle camera",
			icon: "mdi:camera",
		},
		{
			action: "screenshot",
			key: "F12",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Take screenshot",
			icon: "mdi:camera-image",
		},
		{
			action: "drawing",
			key: "d",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Toggle drawing",
			icon: "mdi:pencil",
		},
		{
			action: "pip",
			key: "i",
			ctrl: false,
			alt: false,
			shift: false,
			description: "Toggle PiP",
			icon: "mdi:picture-in-picture",
		},
	];
};

const exportConfig = () => {
	const config = JSON.stringify(hotkeys.value, null, 2);
	const blob = new Blob([config], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "mediastudio-hotkeys.json";
	a.click();
	URL.revokeObjectURL(url);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Keyboard Shortcuts
			</h3>
			<div class="flex gap-2">
				<button
					class="p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
					title="Export config"
					@click="exportConfig"
				>
					<Icon name="mdi:download" class="w-4 h-4" />
				</button>
				<button
					class="text-xs text-purple-600 hover:text-purple-700"
					@click="resetToDefaults"
				>
					Reset
				</button>
			</div>
		</div>

		<div class="space-y-1">
			<div
				v-for="hotkey in hotkeys"
				:key="hotkey.action"
				class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
			>
				<div class="flex items-center gap-3">
					<Icon :name="hotkey.icon" class="w-5 h-5 text-gray-400" />
					<div>
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							{{ hotkey.description }}
						</p>
						<p class="text-xs text-gray-500">{{ hotkey.action }}</p>
					</div>
				</div>

				<button
					:class="[
						'px-3 py-1.5 rounded-lg text-sm font-mono transition-all',
						isEditing === hotkey.action
							? 'bg-purple-600 text-white animate-pulse'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200',
					]"
					@click="startRecordingKey(hotkey.action)"
				>
					{{
						isEditing === hotkey.action
						? "Press key..."
						: formatHotkey(hotkey)
					}}
				</button>
			</div>
		</div>

		<p class="mt-4 text-xs text-gray-500">
			Click on any shortcut to change it. You can use Ctrl, Alt, Shift
			modifiers.
		</p>
	</div>
</template>
