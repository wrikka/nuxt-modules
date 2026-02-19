<script setup lang="ts">
interface Props {
	padding?: 'none' | 'sm' | 'md' | 'lg'
	className?: string
}

const props = withDefaults(defineProps<Props>(), {
	padding: 'md',
	className: ''
})

const paddingClass = computed(() => {
	switch (props.padding) {
		case 'none':
			return ''
		case 'sm':
			return 'p-4'
		case 'lg':
			return 'p-8'
		default:
			return 'p-6'
	}
})
</script>

<template>

	<div 
		:class="[
			'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
			paddingClass,
			className
		]"
	>
		<div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<slot name="header" />
		</div>
		
		<div :class="paddingClass">
			<slot />
		</div>
		
		<div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
			<slot name="footer" />
		</div>
	</div>

</template>
