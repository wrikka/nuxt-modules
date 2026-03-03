<script setup lang="ts">
import { usePaletteProvider, type PaletteProviderOptions } from '../composables/usePaletteProvider'
import { recentPlugin, pinnedPlugin, shortcutPlugin } from '../../core/plugins'

interface Props {
	id: string
	plugins?: PaletteProviderOptions['plugins']
	pluginOptions?: PaletteProviderOptions['pluginOptions']
}

const props = withDefaults(defineProps<Props>(), {
	plugins: () => [recentPlugin, pinnedPlugin, shortcutPlugin]
})

const context = usePaletteProvider(props.id, {
	plugins: props.plugins,
	pluginOptions: props.pluginOptions
})

defineExpose({
	context,
	instance: context.instance
})
</script>

<template>
	<slot :palette="context" />
</template>
