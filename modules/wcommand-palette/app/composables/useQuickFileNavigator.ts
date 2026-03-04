import { useLocalStorage, useFetch } from '@vueuse/core'
import { readonly, ref } from 'vue'
import Fuse from 'fuse.js'
import type { Command } from '../types'

export interface FileEntry {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  modifiedAt?: number
}

export function useQuickFileNavigator() {
  const files = ref<FileEntry[]>([])
  const isScanning = ref(false)
  const recentFiles = useLocalStorage<FileEntry[]>('palette:recent-files', [])

  const scanFiles = async (basePath: string = '/') => {
    isScanning.value = true
    try {
      const { data } = await useFetch<FileEntry[]>('/api/palette/files', {
        query: { path: basePath },
        default: () => []
      })
      files.value = data.value || []
    }
    finally {
      isScanning.value = false
    }
  }

  const searchFiles = (query: string): FileEntry[] => {
    if (!query) return recentFiles.value.slice(0, 10)

    const fuse = new Fuse(files.value, {
      keys: ['name', 'path'],
      threshold: 0.3
    })

    return fuse.search(query).map((r: { item: FileEntry }) => r.item)
  }

  const openFile = async (entry: FileEntry) => {
    recentFiles.value = [
      entry,
      ...recentFiles.value.filter((f: FileEntry) => f.path !== entry.path)
    ].slice(0, 20)

    if (entry.type === 'file') {
      window.open(`/preview?file=${encodeURIComponent(entry.path)}`, '_blank')
    }
    else {
      await scanFiles(entry.path)
    }
  }

  const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const icons: Record<string, string> = {
      ts: '🔷', tsx: '🔷', js: '📜', jsx: '📜',
      vue: '💚', html: '🌐', css: '🎨', scss: '🎨',
      json: '📋', md: '📝', yaml: '📋', yml: '📋',
      py: '🐍', rs: '🦀', go: '🐹', rb: '💎',
      java: '☕', cpp: '⚙️', c: '⚙️', h: '📄',
      sh: '🔧', ps1: '🔧', bat: '🔧', cmd: '🔧',
      gitignore: '🔀', dockerfile: '🐳', env: '🔐',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️',
      mp4: '🎬', mp3: '🎵', pdf: '📄', zip: '📦'
    }
    return icons[ext || ''] || '📄'
  }

  const createFileCommand = (entry: FileEntry): Command => ({
    id: `file-${entry.path}`,
    name: entry.name,
    title: entry.name,
    description: entry.path,
    icon: getFileIcon(entry.name),
    group: entry.type === 'directory' ? 'folders' : 'files',
    action: () => openFile(entry)
  })

  return {
    files: readonly(files),
    isScanning: readonly(isScanning),
    recentFiles: readonly(recentFiles),
    scanFiles,
    searchFiles,
    openFile,
    getFileIcon,
    createFileCommand
  }
}

