import type { ChatSession, SessionExport, ChatMessage } from '../../types'

export class ChatExportService {
  exportSession(session: ChatSession, options: SessionExport): string {
    switch (options.format) {
      case 'json':
        return this.exportToJson(session, options)
      case 'markdown':
        return this.exportToMarkdown(session, options)
      case 'txt':
        return this.exportToText(session, options)
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  private exportToJson(session: ChatSession, options: SessionExport): string {
    const exportData: any = {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: options.messageFilter
        ? session.messages.filter(options.messageFilter)
        : session.messages
    }

    if (options.includeMetadata) {
      exportData.metadata = session.metadata
    }

    return JSON.stringify(exportData, null, 2)
  }

  private exportToMarkdown(session: ChatSession, options: SessionExport): string {
    const messages = options.messageFilter
      ? session.messages.filter(options.messageFilter)
      : session.messages

    let markdown = `# ${session.title}\n\n`
    markdown += `*Session ID: ${session.id}*\n`
    markdown += `*Created: ${session.createdAt.toLocaleDateString()}*\n\n`
    markdown += `---\n\n`

    messages.forEach((message: ChatMessage) => {
      const role = message.role === 'user' ? '👤 User' : '🤖 Assistant'
      markdown += `## ${role}\n\n`
      markdown += `${message.content}\n\n`

      if (message.metadata && Object.keys(message.metadata).length > 0) {
        markdown += `*Metadata: ${JSON.stringify(message.metadata, null, 2)}*\n\n`
      }

      markdown += `---\n\n`
    })

    return markdown
  }

  private exportToText(session: ChatSession, options: SessionExport): string {
    const messages = options.messageFilter
      ? session.messages.filter(options.messageFilter)
      : session.messages

    let text = `${session.title}\n`
    text += `${'='.repeat(session.title.length)}\n\n`
    text += `Session ID: ${session.id}\n`
    text += `Created: ${session.createdAt.toLocaleDateString()}\n\n`
    text += `${'-'.repeat(50)}\n\n`

    messages.forEach((message: ChatMessage) => {
      text += `[${message.role.toUpperCase()}] - ${message.timestamp.toLocaleString()}\n`
      text += `${message.content}\n\n`
      text += `${'-'.repeat(50)}\n\n`
    })

    return text
  }

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  exportAndDownload(session: ChatSession, options: SessionExport): void {
    const content = this.exportSession(session, options)

    const filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
    const extensions = {
      json: 'json',
      markdown: 'md',
      txt: 'txt'
    }

    const mimeTypes = {
      json: 'application/json',
      markdown: 'text/markdown',
      txt: 'text/plain'
    }

    const extension = extensions[options.format]
    const mimeType = mimeTypes[options.format]

    this.downloadFile(content, `${filename}.${extension}`, mimeType)
  }
}

export const chatExportService = new ChatExportService()
export const useChatExportService = () => chatExportService
