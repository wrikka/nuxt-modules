import { ref } from 'vue'
import type { ExportOptions } from '../types'

export function useExport(options: ExportOptions) {
  const isExporting = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)

  const exportToMarkdown = (content: string, filename: string = 'document.md'): void => {
    if (!options.markdown) {
      error.value = 'Markdown export is disabled'
      return
    }

    try {
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Export failed'
    }
  }

  const exportToHTML = (htmlContent: string, filename: string = 'document.html'): void => {
    try {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      font-family: 'Monaco', 'Menlo', monospace;
    }
    img {
      max-width: 100%;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background: #f4f4f4;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`

      const blob = new Blob([fullHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Export failed'
    }
  }

  const exportToPDF = async (element: HTMLElement, filename: string = 'document.pdf'): Promise<void> => {
    if (!options.pdf) {
      error.value = 'PDF export is disabled'
      return
    }

    isExporting.value = true
    progress.value = 0
    error.value = null

    try {
      // Use browser's print to PDF capability
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Exported Document</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 2rem;
              line-height: 1.6;
            }
            pre {
              background: #f4f4f4;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
            }
            code {
              font-family: 'Monaco', 'Menlo', monospace;
            }
            img {
              max-width: 100%;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus()

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500))
      progress.value = 50

      printWindow.print()
      printWindow.close()

      progress.value = 100
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'PDF export failed'
    } finally {
      isExporting.value = false
    }
  }

  const exportToWord = async (htmlContent: string, filename: string = 'document.doc'): Promise<void> => {
    if (!options.word) {
      error.value = 'Word export is disabled'
      return
    }

    isExporting.value = true
    error.value = null

    try {
      // Create a Word-compatible HTML document
      const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Exported Document</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Times New Roman', serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Arial', sans-serif; }
    pre { background: #f4f4f4; padding: 10px; }
    code { font-family: 'Courier New', monospace; }
    table { border-collapse: collapse; }
    td, th { border: 1px solid black; padding: 5px; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`

      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword'
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Word export failed'
    } finally {
      isExporting.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isExporting,
    error,
    progress,
    exportToMarkdown,
    exportToHTML,
    exportToPDF,
    exportToWord,
    clearError
  }
}
