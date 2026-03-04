import { ref } from 'vue'
import type { ChatMessage } from './types/chat'

export function useChatExport() {
  const isExporting = ref(false)
  const exportProgress = ref(0)

  const exportConversation = async (messages: ChatMessage[], title: string, options: any) => {
    isExporting.value = true
    exportProgress.value = 0
    
    let content = ''
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}`

    switch (options.format) {
      case 'markdown':
        content = `# ${title}\n\n${messages.map(m => `**${m.role}**: ${m.content}`).join('\n\n---\n\n')}`
        downloadFile(content, `${filename}.md`, 'text/markdown')
        break
      case 'json':
        content = JSON.stringify({ title, messages }, null, 2)
        downloadFile(content, `${filename}.json`, 'application/json')
        break
      case 'txt':
        content = messages.map(m => `[${m.role}]: ${m.content}`).join('\n\n')
        downloadFile(content, `${filename}.txt`, 'text/plain')
        break
    }
    
    exportProgress.value = 100
    isExporting.value = false
    return content
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return { isExporting, exportProgress, exportConversation }
}
