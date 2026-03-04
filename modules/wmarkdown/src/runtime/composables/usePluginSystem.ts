import { ref } from 'vue'
import type { Plugin, MarkdownToken } from '../types'

const plugins = ref<Plugin[]>([])

export function usePluginSystem() {
  const register = (plugin: Plugin) => {
    if (!plugins.value.find(p => p.name === plugin.name)) {
      plugins.value.push(plugin)
    }
  }

  const unregister = (name: string) => {
    const index = plugins.value.findIndex(p => p.name === name)
    if (index !== -1) {
      plugins.value.splice(index, 1)
    }
  }

  const transform = (tokens: MarkdownToken[]): MarkdownToken[] => {
    return plugins.value.reduce((acc, plugin) => {
      try {
        return plugin.transform(acc)
      } catch (error) {
        console.error(`Plugin ${plugin.name} failed:`, error)
        return acc
      }
    }, tokens)
  }

  const createPlugin = (name: string, transformFn: (tokens: MarkdownToken[]) => MarkdownToken[]): Plugin => {
    return {
      name,
      transform: transformFn
    }
  }

  const list = () => [...plugins.value]

  const has = (name: string) => plugins.value.some(p => p.name === name)

  return {
    plugins,
    register,
    unregister,
    transform,
    createPlugin,
    list,
    has
  }
}
