import type { BackupData, BackupMetadata } from '../types'

// Chat Backup/Restore - Encrypted cloud backup
export const useChatBackup = () => {
  const config = useRuntimeConfig()
  const isBackingUp = ref(false)
  const isRestoring = ref(false)
  const backups = ref<BackupMetadata[]>([])
  const backupProgress = ref(0)
  const restoreProgress = ref(0)
  const autoBackupEnabled = useLocalStorage('wchat:backup:auto', true)
  const backupFrequency = useLocalStorage<'daily' | 'weekly' | 'monthly'>('wchat:backup:frequency', 'weekly')
  const lastBackup = useLocalStorage<string | null>('wchat:backup:last', null)
  const encryptionKey = useLocalStorage<string | null>('wchat:backup:key', null)

  // Generate encryption key
  const generateKey = async (): Promise<string> => {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    const exported = await crypto.subtle.exportKey('raw', key)
    const keyString = btoa(String.fromCharCode(...new Uint8Array(exported)))
    encryptionKey.value = keyString
    return keyString
  }

  // Create backup
  const createBackup = async (options?: {
    includeMedia?: boolean
    includeDeleted?: boolean
    chatIds?: string[]
  }): Promise<BackupMetadata | null> => {
    if (!config.public.wchat?.enableBackup) return null

    isBackingUp.value = true
    backupProgress.value = 0

    try {
      // Get backup data from server
      const data = await $fetch<BackupData>('/api/chat/backup/export', {
        method: 'POST',
        body: options
      })

      // Encrypt if key exists
      let encryptedData = JSON.stringify(data)
      if (encryptionKey.value) {
        const key = await importKey(encryptionKey.value)
        encryptedData = await encryptData(encryptedData, key)
      }

      // Upload to cloud
      const blob = new Blob([encryptedData], { type: 'application/json' })
      const formData = new FormData()
      formData.append('backup', blob)
      formData.append('metadata', JSON.stringify({
        size: blob.size,
        chatCount: data.chats.length,
        messageCount: data.messages.length,
        ...options
      }))

      const metadata = await $fetch<BackupMetadata>('/api/chat/backup/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progress) => {
          backupProgress.value = progress.progress
        }
      })

      backups.value.unshift(metadata)
      lastBackup.value = new Date().toISOString()

      return metadata
    } finally {
      isBackingUp.value = false
      backupProgress.value = 0
    }
  }

  // List backups
  const listBackups = async (): Promise<BackupMetadata[]> => {
    const data = await $fetch<BackupMetadata[]>('/api/chat/backup/list')
    backups.value = data
    return data
  }

  // Restore backup
  const restoreBackup = async (backupId: string): Promise<boolean> => {
    if (!config.public.wchat?.enableBackup) return false

    isRestoring.value = true
    restoreProgress.value = 0

    try {
      // Download backup
      const blob = await $fetch<Blob>(`/api/chat/backup/${backupId}/download`)
      const encryptedData = await blob.text()

      // Decrypt if needed
      let data: BackupData
      if (encryptionKey.value) {
        const key = await importKey(encryptionKey.value)
        const decrypted = await decryptData(encryptedData, key)
        data = JSON.parse(decrypted)
      } else {
        data = JSON.parse(encryptedData)
      }

      // Restore to server
      await $fetch('/api/chat/backup/restore', {
        method: 'POST',
        body: data,
        onUploadProgress: (progress) => {
          restoreProgress.value = progress.progress
        }
      })

      return true
    } finally {
      isRestoring.value = false
      restoreProgress.value = 0
    }
  }

  // Delete backup
  const deleteBackup = async (backupId: string): Promise<void> => {
    await $fetch(`/api/chat/backup/${backupId}`, { method: 'DELETE' })
    backups.value = backups.value.filter(b => b.id !== backupId)
  }

  // Export to local file
  const exportToFile = async (options?: {
    includeMedia?: boolean
    chatIds?: string[]
  }): Promise<void> => {
    const data = await $fetch<BackupData>('/api/chat/backup/export', {
      method: 'POST',
      body: options
    })

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `wchat-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

  // Import from file
  const importFromFile = async (file: File): Promise<boolean> => {
    const text = await file.text()
    const data: BackupData = JSON.parse(text)

    await $fetch('/api/chat/backup/restore', {
      method: 'POST',
      body: data
    })

    return true
  }

  // Toggle auto backup
  const toggleAutoBackup = (enabled: boolean): void => {
    autoBackupEnabled.value = enabled
  }

  // Set backup frequency
  const setBackupFrequency = (frequency: 'daily' | 'weekly' | 'monthly'): void => {
    backupFrequency.value = frequency
  }

  // Schedule auto backup check
  const checkAutoBackup = async (): Promise<void> => {
    if (!autoBackupEnabled.value) return

    const last = lastBackup.value ? new Date(lastBackup.value) : null
    const now = new Date()

    let shouldBackup = false
    if (!last) {
      shouldBackup = true
    } else {
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
      switch (backupFrequency.value) {
        case 'daily':
          shouldBackup = diffDays >= 1
          break
        case 'weekly':
          shouldBackup = diffDays >= 7
          break
        case 'monthly':
          shouldBackup = diffDays >= 30
          break
      }
    }

    if (shouldBackup) {
      await createBackup()
    }
  }

  // Encryption helpers
  const importKey = async (keyString: string): Promise<CryptoKey> => {
    const raw = Uint8Array.from(atob(keyString), c => c.charCodeAt(0))
    return await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt'])
  }

  const encryptData = async (data: string, key: CryptoKey): Promise<string> => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(data)
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
    return btoa(String.fromCharCode(...iv)) + ':' + btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  }

  const decryptData = async (encrypted: string, key: CryptoKey): Promise<string> => {
    const [ivStr, dataStr] = encrypted.split(':')
    const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0))
    const data = Uint8Array.from(atob(dataStr), c => c.charCodeAt(0))
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return new TextDecoder().decode(decrypted)
  }

  return {
    isBackingUp: readonly(isBackingUp),
    isRestoring: readonly(isRestoring),
    backups: readonly(backups),
    backupProgress: readonly(backupProgress),
    restoreProgress: readonly(restoreProgress),
    autoBackupEnabled: readonly(autoBackupEnabled),
    backupFrequency: readonly(backupFrequency),
    lastBackup: readonly(lastBackup),
    createBackup,
    listBackups,
    restoreBackup,
    deleteBackup,
    exportToFile,
    importFromFile,
    toggleAutoBackup,
    setBackupFrequency,
    checkAutoBackup,
    generateKey
  }
}

// Auto backup scheduler
export const useAutoBackup = () => {
  const { checkAutoBackup } = useChatBackup()

  onMounted(() => {
    // Check on mount
    checkAutoBackup()

    // Check every hour
    const interval = setInterval(checkAutoBackup, 60 * 60 * 1000)
    onUnmounted(() => clearInterval(interval))
  })
}
