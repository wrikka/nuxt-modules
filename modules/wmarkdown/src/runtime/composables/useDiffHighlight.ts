import { ref, computed } from 'vue'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

interface DiffHunk {
  oldStart: number
  oldLength: number
  newStart: number
  newLength: number
  lines: DiffLine[]
}

export function useDiffHighlight() {
  const hunks = ref<DiffHunk[]>([])

  const parseDiff = (diffText: string): DiffHunk[] => {
    const lines = diffText.split('\n')
    const result: DiffHunk[] = []
    let currentHunk: DiffHunk | null = null
    let oldLine = 0
    let newLine = 0

    for (const line of lines) {
      // Match hunk header: @@ -start,length +start,length @@
      const hunkMatch = line.match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/)
      if (hunkMatch) {
        if (currentHunk) {
          result.push(currentHunk)
        }
        currentHunk = {
          oldStart: parseInt(hunkMatch[1]),
          oldLength: parseInt(hunkMatch[2]) || 1,
          newStart: parseInt(hunkMatch[3]),
          newLength: parseInt(hunkMatch[4]) || 1,
          lines: []
        }
        oldLine = currentHunk.oldStart
        newLine = currentHunk.newStart
        continue
      }

      if (!currentHunk) continue

      const type = line.charAt(0)
      const content = line.slice(1)

      switch (type) {
        case '+':
          currentHunk.lines.push({
            type: 'added',
            content,
            newLineNumber: newLine++
          })
          break
        case '-':
          currentHunk.lines.push({
            type: 'removed',
            content,
            oldLineNumber: oldLine++
          })
          break
        case ' ':
          currentHunk.lines.push({
            type: 'unchanged',
            content,
            oldLineNumber: oldLine++,
            newLineNumber: newLine++
          })
          break
        case '\\':
          // Skip "no newline at end of file" markers
          break
        default:
          // Header or other metadata line
          break
      }
    }

    if (currentHunk) {
      result.push(currentHunk)
    }

    hunks.value = result
    return result
  }

  const renderDiff = (diffText: string, lang?: string): string => {
    const hunks = parseDiff(diffText)

    if (hunks.length === 0) {
      return `<pre><code>${escapeHtml(diffText)}</code></pre>`
    }

    const lines = hunks.flatMap(hunk =>
      hunk.lines.map(line => {
        const oldNum = line.oldLineNumber ?? ''
        const newNum = line.newLineNumber ?? ''
        const className = `diff-line diff-${line.type}`
        const sign = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '

        return `<tr class="${className}">
          <td class="diff-line-num diff-line-num-old">${oldNum}</td>
          <td class="diff-line-num diff-line-num-new">${newNum}</td>
          <td class="diff-line-sign">${sign}</td>
          <td class="diff-line-content"><code>${escapeHtml(line.content)}</code></td>
        </tr>`
      })
    )

    return `<div class="wmarkdown-diff">
      <table class="diff-table">
        <thead>
          <tr>
            <th class="diff-line-num">Old</th>
            <th class="diff-line-num">New</th>
            <th class="diff-line-sign"></th>
            <th class="diff-line-content">${lang ? `Code (${lang})` : 'Code'}</th>
          </tr>
        </thead>
        <tbody>
          ${lines.join('\n')}
        </tbody>
      </table>
    </div>`
  }

  const stats = computed(() => {
    let added = 0
    let removed = 0

    for (const hunk of hunks.value) {
      for (const line of hunk.lines) {
        if (line.type === 'added') added++
        if (line.type === 'removed') removed++
      }
    }

    return { added, removed, changed: added + removed }
  })

  const getSimpleDiff = (oldText: string, newText: string): string => {
    const oldLines = oldText.split('\n')
    const newLines = newText.split('\n')

    let diff = '--- a/file\n'
    diff += '+++ b/file\n'
    diff += `@@ -1,${oldLines.length} +1,${newLines.length} @@\n`

    // Simple line-by-line comparison
    const maxLines = Math.max(oldLines.length, newLines.length)
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i]
      const newLine = newLines[i]

      if (oldLine === newLine) {
        diff += ` ${oldLine ?? ''}\n`
      } else {
        if (oldLine !== undefined) {
          diff += `-${oldLine}\n`
        }
        if (newLine !== undefined) {
          diff += `+${newLine}\n`
        }
      }
    }

    return diff
  }

  return {
    hunks,
    stats,
    parseDiff,
    renderDiff,
    getSimpleDiff
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
