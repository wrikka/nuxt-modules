// Plugin manager for chat module
import { ChatPluginManager } from './chat-plugins'

let pluginManager: ChatPluginManager | null = null

export function getPluginManager(): ChatPluginManager {
  if (!pluginManager) {
    pluginManager = new ChatPluginManager()
  }
  return pluginManager
}

export function initializePluginManager(): ChatPluginManager {
  if (!pluginManager) {
    pluginManager = new ChatPluginManager()
  }
  return pluginManager
}

export function destroyPluginManager(): void {
  if (pluginManager) {
    // Unregister all plugins
    const plugins = pluginManager.getAllPlugins()
    plugins.forEach(plugin => {
      pluginManager!.unregister(plugin.id)
    })
    pluginManager = null
  }
}
