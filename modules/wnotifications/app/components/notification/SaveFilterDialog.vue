<script setup lang="ts">
const props = defineProps<{
	name: string
	show: boolean
}>()

const emit = defineEmits<{
	update: [value: string]
	save: []
	cancel: []
}>()
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div v-if="show" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" @click="emit('cancel')" />
		</Transition>
		<Transition name="slide-up">
			<div v-if="show" class="fixed bottom-0 left-0 right-0 z-[60] rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
				<h3 class="mb-4 text-lg font-semibold">Save Filter</h3>
				<input
					:value="name"
					type="text"
					placeholder="Filter name"
					class="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
					@keyup.enter="emit('save')"
					@input="emit('update', ($event.target as HTMLInputElement).value)"
				/>
				<div class="flex gap-2">
					<button class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800" @click="emit('cancel')">Cancel</button>
					<button class="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" @click="emit('save')">Save</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
