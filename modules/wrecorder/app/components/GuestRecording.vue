<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const maxGuests = defineModel<number>("maxGuests", { default: 4 });
const layout = defineModel<"grid" | "spotlight" | "sidebar">("layout", {
	default: "grid",
});
const allowRecording = defineModel<boolean>("allowRecording", {
	default: true,
});
const allowScreenShare = defineModel<boolean>("allowScreenShare", {
	default: true,
});
const muteOnJoin = defineModel<boolean>("muteOnJoin", { default: true });
const requireApproval = defineModel<boolean>("requireApproval", {
	default: true,
});

const inviteLink = ref("https://mediastudio.app/join/abc123xyz");
const guests = ref([
	{
		id: 1,
		name: "You (Host)",
		isHost: true,
		isMuted: false,
		isVideoOn: true,
		avatar: "Y",
	},
]);
const pendingGuests = ref([
	{ id: 2, name: "Guest User", requestedAt: "2 min ago" },
]);

const layoutOptions = [
	{
		value: "grid",
		label: "Grid",
		icon: "mdi:view-grid",
		description: "Equal size for all",
	},
	{
		value: "spotlight",
		label: "Spotlight",
		icon: "mdi:spotlight-beam",
		description: "Active speaker large",
	},
	{
		value: "sidebar",
		label: "Sidebar",
		icon: "mdi:view-column",
		description: "Host main, guests side",
	},
] as const;

const copyLink = () => {
	navigator.clipboard.writeText(inviteLink.value);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
					<Icon
						name="mdi:account-multiple"
						class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Guest Recording
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Invite remote guests to record
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-indigo-600 mt-0.5" />
					<p class="text-xs text-indigo-700 dark:text-indigo-300">
						Invite guests to join your recording session remotely. Each guest
						gets separate audio/video tracks for professional post-production.
					</p>
				</div>
			</div>

			<div class="flex gap-2">
				<input
					v-model="inviteLink"
					type="text"
					readonly
					class="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
				>
				<button
					class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
					@click="copyLink"
				>
					<Icon name="mdi:content-copy" class="w-5 h-5" />
				</button>
				<button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
					<Icon
						name="mdi:share"
						class="w-5 h-5 text-gray-600 dark:text-gray-400"
					/>
				</button>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Layout Mode</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="opt in layoutOptions"
						:key="opt.value"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							layout === opt.value
								? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-indigo-300',
						]"
						@click="layout = opt.value"
					>
						<Icon
							:name="opt.icon"
							class="w-5 h-5 mx-auto mb-1"
							:class="layout === opt.value ? 'text-indigo-600' : 'text-gray-500'"
						/>
						<div
							class="text-xs font-medium"
							:class="layout === opt.value
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>
							{{ opt.label }}
						</div>
					</button>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Max Guests</span>
					<span class="text-gray-500">{{ maxGuests }}</span>
				</div>
				<input
					v-model.number="maxGuests"
					type="range"
					min="1"
					max="8"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
				>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="allowRecording"
						type="checkbox"
						class="w-4 h-4 text-indigo-600 rounded"
					>
					<Icon name="mdi:record" class="w-4 h-4 text-red-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Allow Recording</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="allowScreenShare"
						type="checkbox"
						class="w-4 h-4 text-indigo-600 rounded"
					>
					<Icon name="mdi:monitor-share" class="w-4 h-4 text-blue-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Screen Share</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="muteOnJoin"
						type="checkbox"
						class="w-4 h-4 text-indigo-600 rounded"
					>
					<Icon name="mdi:volume-mute" class="w-4 h-4 text-gray-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Mute on Join</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="requireApproval"
						type="checkbox"
						class="w-4 h-4 text-indigo-600 rounded"
					>
					<Icon name="mdi:shield-check" class="w-4 h-4 text-green-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Require Approval</span>
				</label>
			</div>

			<div
				v-if="pendingGuests.length > 0"
				class="border-t border-gray-200 dark:border-gray-700 pt-4"
			>
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Pending Requests ({{ pendingGuests.length }})
				</h4>
				<div
					v-for="guest in pendingGuests"
					:key="guest.id"
					class="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
				>
					<div class="flex items-center gap-2">
						<Icon name="mdi:account-clock" class="w-5 h-5 text-yellow-600" />
						<span class="text-sm text-gray-700 dark:text-gray-300">{{
							guest.name
						}}</span>
						<span class="text-xs text-gray-500">{{ guest.requestedAt }}</span>
					</div>
					<div class="flex gap-1">
						<button class="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
							<Icon name="mdi:check" class="w-4 h-4" />
						</button>
						<button class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
							<Icon name="mdi:close" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Participants ({{ guests.length }})
				</h4>
				<div class="space-y-2">
					<div
						v-for="guest in guests"
						:key="guest.id"
						class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
					>
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm text-white font-bold">
								{{ guest.avatar }}
							</div>
							<div>
								<span
									class="text-sm font-medium text-gray-900 dark:text-white"
								>{{ guest.name }}</span>
								<span
									v-if="guest.isHost"
									class="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 px-1.5 py-0.5 rounded"
								>Host</span>
							</div>
						</div>
						<div class="flex gap-1">
							<button
								class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
								:class="guest.isMuted ? 'text-red-500' : 'text-green-500'"
							>
								<Icon
									:name="guest.isMuted ? 'mdi:microphone-off' : 'mdi:microphone'"
									class="w-4 h-4"
								/>
							</button>
							<button
								class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
								:class="guest.isVideoOn ? 'text-green-500' : 'text-red-500'"
							>
								<Icon
									:name="guest.isVideoOn ? 'mdi:video' : 'mdi:video-off'"
									class="w-4 h-4"
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
