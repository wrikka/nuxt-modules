import { readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CommandPaletteConfig, Command } from '../types'

export interface ConfigExport {
  version: string
  timestamp: number
  config: CommandPaletteConfig
  commands: Command[]
  aliases: Record<string, string>
  macros: string[]
  theme: string
}

/**
 * Export/Import Config - Share and backup configurations
 */
export function useConfigImportExport() {
  const isExporting = ref(false)
  const isImporting = ref(false)
  const lastExport = ref<string | null>(null)

  const exportConfig = (
    config: CommandPaletteConfig,
    commands: Command[],
    aliases: Record<string, string>,
    macros: string[],
    theme: string
  ): string => {
    isExporting.value = true

    const exportData: ConfigExport = {
      version: '1.0',
      timestamp: Date.now(),
      config,
      commands,
      aliases,
      macros,
      theme
    }

    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `palette-config-${new Date().toISOString().split('T')[0]}.json`
    a.click()

    URL.revokeObjectURL(url)
    lastExport.value = json
    isExporting.value = false

    return json
  }

  const importConfig = async (file: File): Promise<ConfigExport | null> => {
    isImporting.value = true

    try {
      const text = await file.text()
      const data = JSON.parse(text) as ConfigExport

      if (!data.version || !data.config) {
        throw new Error('Invalid config file')
      }

      return data
    }
    catch (error) {
      console.error('Failed to import config:', error)
      return null
    }
    finally {
      isImporting.value = false
    }
  }

  const copyToClipboard = (config: ConfigExport): boolean => {
    try {
      navigator.clipboard.writeText(JSON.stringify(config, null, 2))
      return true
    }
    catch {
      return false
    }
  }

  const shareViaUrl = (config: ConfigExport): string => {
    const compressed = btoa(JSON.stringify(config))
    return `${window.location.origin}/palette?config=${compressed}`
  }

  return {
    isExporting: readonly(isExporting),
    isImporting: readonly(isImporting),
    lastExport: readonly(lastExport),
    exportConfig,
    importConfig,
    copyToClipboard,
    shareViaUrl
  }
}
