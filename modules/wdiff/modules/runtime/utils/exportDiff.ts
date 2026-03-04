import type { DiffChunk, DiffLine } from '../types'

export type ExportFormat = 'json' | 'html' | 'csv' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  includeLineNumbers?: boolean
  includeContext?: boolean
  contextLines?: number
  customTemplate?: string
  highlightSyntax?: boolean
}

export interface ExportResult {
  success: boolean
  data: string | Blob
  filename: string
  mimeType: string
}

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightCode = (content: string): string => {
  let highlighted = escapeHtml(content)
  
  // Keywords
  highlighted = highlighted.replace(
    /\b(const|let|var|function|class|interface|type|import|export|from|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|async|await|yield)\b/g,
    '<span style="color: #c678dd; font-weight: 600;">$1</span>'
  )
  
  // Strings
  highlighted = highlighted.replace(
    /(['"`'])([^\\1]*?)\1/g,
    '<span style="color: #98c379;">$1$2$1</span>'
  )
  
  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span style="color: #d19a66;">$1</span>'
  )
  
  // Comments
  highlighted = highlighted.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/gm,
    '<span style="color: #5c6370; font-style: italic;">$1</span>'
  )
  
  return highlighted
}

const generateHtmlTemplate = (
  chunks: DiffChunk[],
  options: ExportOptions,
  stats: { added: number; deleted: number; modified: number }
): string => {
  const lines = chunks.flatMap((chunk) => chunk.lines)
  
  const lineRows = lines
    .map((line) => {
      const type = line.type
      const oldNum = line.oldLineNumber ?? ''
      const newNum = line.newLineNumber ?? ''
      const marker = type === 'added' ? '+' : type === 'deleted' ? '-' : ' '
      const bgColor =
        type === 'added'
          ? '#d4edda'
          : type === 'deleted'
            ? '#f8d7da'
            : type === 'modified'
              ? '#fff3cd'
              : 'transparent'
      const borderColor =
        type === 'added'
          ? '#28a745'
          : type === 'deleted'
            ? '#dc3545'
            : type === 'modified'
              ? '#ffc107'
              : '#dee2e6'

      return `
        <tr style="background-color: ${bgColor}; border-left: 3px solid ${borderColor};">
          ${options.includeLineNumbers ? `<td style="padding: 4px 8px; color: #6c757d; font-size: 12px; text-align: right; border-right: 1px solid #dee2e6;">${oldNum}</td>` : ''}
          ${options.includeLineNumbers ? `<td style="padding: 4px 8px; color: #6c757d; font-size: 12px; text-align: right; border-right: 1px solid #dee2e6;">${newNum}</td>` : ''}
          <td style="padding: 4px 8px; width: 20px; color: ${borderColor}; font-weight: bold;">${marker}</td>
          <td style="padding: 4px 8px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; white-space: pre;">${options.highlightSyntax ? highlightCode(line.content) : escapeHtml(line.content)}</td>
        </tr>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diff Export</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      padding: 20px;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
    }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .stats {
      display: flex;
      gap: 16px;
      font-size: 14px;
      opacity: 0.9;
    }
    .stats span {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 16px;
    }
    .content { padding: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    td {
      border-bottom: 1px solid #f1f3f4;
    }
    .footer {
      background: #f8f9fa;
      padding: 12px 20px;
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Diff Report</h1>
      <div class="stats">
        <span>+${stats.added} additions</span>
        <span>-${stats.deleted} deletions</span>
        <span>~${stats.modified} modifications</span>
      </div>
    </div>
    <div class="content">
      <table>
        <tbody>
          ${lineRows}
        </tbody>
      </table>
    </div>
    <div class="footer">
      Generated by @wrikka/diff • ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>`
}

const exportToJson = (chunks: DiffChunk[], stats: object): ExportResult => {
  const data = {
    meta: {
      exportedAt: new Date().toISOString(),
      ...stats,
    },
    chunks,
  }

  return {
    success: true,
    data: JSON.stringify(data, null, 2),
    filename: `diff-export-${Date.now()}.json`,
    mimeType: 'application/json',
  }
}

const exportToHtml = (
  chunks: DiffChunk[],
  options: ExportOptions,
  stats: { added: number; deleted: number; modified: number }
): ExportResult => {
  const html = options.customTemplate
    ? options.customTemplate.replace('{{DIFF_CONTENT}}', generateHtmlTemplate(chunks, options, stats))
    : generateHtmlTemplate(chunks, options, stats)

  return {
    success: true,
    data: html,
    filename: `diff-report-${Date.now()}.html`,
    mimeType: 'text/html',
  }
}

const exportToCsv = (
  chunks: DiffChunk[],
  options: ExportOptions
): ExportResult => {
  const lines = chunks.flatMap((chunk) => chunk.lines)
  const headers = ['Type', 'Old Line', 'New Line', 'Content']

  const rows = lines.map((line) => [
    line.type,
    line.oldLineNumber ?? '',
    line.newLineNumber ?? '',
    `"${line.content.replace(/"/g, '""')}"`,
  ])

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  return {
    success: true,
    data: csv,
    filename: `diff-export-${Date.now()}.csv`,
    mimeType: 'text/csv',
  }
}

const exportToPdf = async (
  chunks: DiffChunk[],
  options: ExportOptions,
  stats: { added: number; deleted: number; modified: number }
): Promise<ExportResult> => {
  // In browser environment, we generate a print-friendly HTML
  // and rely on browser's print to PDF functionality
  const html = generateHtmlTemplate(chunks, options, stats)

  // Create a Blob for the print view
  const blob = new Blob([html], { type: 'text/html' })

  return {
    success: true,
    data: blob,
    filename: `diff-report-${Date.now()}.pdf`,
    mimeType: 'application/pdf',
  }
}

export const exportDiff = async (
  chunks: DiffChunk[],
  options: ExportOptions,
  stats: { added: number; deleted: number; modified: number }
): Promise<ExportResult> => {
  switch (options.format) {
    case 'json':
      return exportToJson(chunks, stats)
    case 'html':
      return exportToHtml(chunks, options, stats)
    case 'csv':
      return exportToCsv(chunks, options)
    case 'pdf':
      return exportToPdf(chunks, options, stats)
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

export const downloadExport = (result: ExportResult): void => {
  const blob =
    result.data instanceof Blob
      ? result.data
      : new Blob([result.data], { type: result.mimeType })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = result.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const printDiff = (
  chunks: DiffChunk[],
  stats: { added: number; deleted: number; modified: number }
): void => {
  const html = generateHtmlTemplate(chunks, {
    format: 'html',
    includeLineNumbers: true,
    highlightSyntax: true,
  }, stats)

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }
}

// Custom template helpers
export const createCustomTemplate = (
  baseTemplate: string,
  customizations: {
    headerColor?: string
    fontFamily?: string
    showTimestamp?: boolean
  }
): string => {
  let template = baseTemplate

  if (customizations.headerColor) {
    template = template.replace(
      /background: linear-gradient\(135deg, #[a-fA-F0-9]{6} 0%, #[a-fA-F0-9]{6} 100%\)/,
      `background: ${customizations.headerColor}`
    )
  }

  if (customizations.fontFamily) {
    template = template.replace(
      /font-family: -apple-system[^;]+;/,
      `font-family: ${customizations.fontFamily};`
    )
  }

  return template
}

export const previewExport = (
  chunks: DiffChunk[],
  options: ExportOptions,
  stats: { added: number; deleted: number; modified: number }
): string => {
  if (options.format === 'html') {
    return generateHtmlTemplate(chunks, options, stats)
  }

  if (options.format === 'json') {
    return JSON.stringify(
      {
        meta: { exportedAt: new Date().toISOString(), ...stats },
        chunks: chunks.slice(0, 10), // Preview first 10 chunks
      },
      null,
      2
    )
  }

  if (options.format === 'csv') {
    const lines = chunks.flatMap((chunk) => chunk.lines).slice(0, 20)
    const headers = ['Type', 'Old Line', 'New Line', 'Content']
    const rows = lines.map((line) =>
      [line.type, line.oldLineNumber ?? '', line.newLineNumber ?? '', line.content].join(',')
    )
    return [headers.join(','), ...rows].join('\n')
  }

  return 'Preview not available for this format'
}
