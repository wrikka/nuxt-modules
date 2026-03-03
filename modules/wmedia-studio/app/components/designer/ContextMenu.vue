<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

interface MenuItem {
	label: string;
	action?: () => void;
	icon?: string;
	shortcut?: string;
	separator?: boolean;
	disabled?: boolean;
}

const props = defineProps<{
	items: MenuItem[];
	x: number;
	y: number;
	show: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const menuRef = ref<HTMLElement | null>(null);

onClickOutside(menuRef, () => {
	emit("close");
});

const handleClick = (item: MenuItem) => {
	if (!item.disabled && item.action) {
		item.action();
		emit("close");
	}
};
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="show"
				ref="menuRef"
				class="fixed z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
				:style="{ left: `${x}px`, top: `${y}px` }"
				role="menu"
			>
				<template v-for="(item, idx) in items" :key="idx">
					<div
						v-if="item.separator"
						class="my-1 border-t border-gray-200 dark:border-gray-700"
					/>
					<button
						v-else
						class="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						:class="{ 'text-gray-400 dark:text-gray-500': item.disabled }"
						:disabled="item.disabled"
						@click="handleClick(item)"
						role="menuitem"
					>
						<span class="flex items-center gap-2">
							<svg
								v-if="item.icon"
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									:d="item.icon"
								/>
							</svg>
							{{ item.label }}
						</span>
						<span v-if="item.shortcut" class="text-xs text-gray-400">{{
							item.shortcut
						}}</span>
					</button>
				</template>
			</div>
		</Transition>
	</Teleport>
</template>
