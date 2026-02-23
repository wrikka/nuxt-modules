// Chat plugin system
export interface ChatPlugin {
  id: string
  name: string
  version: string
  description: string
  initialize(): void
  destroy(): void
}

export interface ChatPluginContext {
  sendMessage: (message: string) => Promise<void>
  addMessage: (message: any) => void
  getSession: () => any
}

export class ChatPluginManager {
  private plugins = new Map<string, ChatPlugin>()
  
  register(plugin: ChatPlugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} is already registered`)
    }
    
    this.plugins.set(plugin.id, plugin)
    plugin.initialize()
  }
  
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.destroy()
      this.plugins.delete(pluginId)
    }
  }
  
  getPlugin(pluginId: string): ChatPlugin | undefined {
    return this.plugins.get(pluginId)
  }
  
  getAllPlugins(): ChatPlugin[] {
    return Array.from(this.plugins.values())
  }
}
