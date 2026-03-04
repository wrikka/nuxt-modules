import { ref } from 'vue'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'note'

interface CalloutStyle {
  icon: string
  color: string
  label: string
}

const calloutStyles: Record<CalloutType, CalloutStyle> = {
  info: {
    icon: 'info',
    color: '#3b82f6',
    label: 'Info'
  },
  warning: {
    icon: 'alert-triangle',
    color: '#f59e0b',
    label: 'Warning'
  },
  error: {
    icon: 'x-circle',
    color: '#ef4444',
    label: 'Error'
  },
  success: {
    icon: 'check-circle',
    color: '#22c55e',
    label: 'Success'
  },
  tip: {
    icon: 'lightbulb',
    color: '#8b5cf6',
    label: 'Tip'
  },
  note: {
    icon: 'file-text',
    color: '#6b7280',
    label: 'Note'
  }
}

export function useCallout() {
  const callouts = ref<{ type: CalloutType; content: string; collapsible?: boolean }[]>([])

  const getStyle = (type: CalloutType): CalloutStyle => {
    return calloutStyles[type] || calloutStyles.info
  }

  const createCallout = (type: CalloutType, content: string, collapsible = false): string => {
    const style = getStyle(type)

    if (collapsible) {
      return `<details class="wmarkdown-callout wmarkdown-callout-${type}">
  <summary style="color: ${style.color}">
    <span class="callout-icon">${style.icon}</span>
    <span class="callout-label">${style.label}</span>
  </summary>
  <div class="callout-content">${content}</div>
</details>`
    }

    return `<div class="wmarkdown-callout wmarkdown-callout-${type}" style="border-left-color: ${style.color}">
  <div class="callout-header" style="color: ${style.color}">
    <span class="callout-icon">${style.icon}</span>
    <span class="callout-label">${style.label}</span>
  </div>
  <div class="callout-content">${content}</div>
</div>`
  }

  const parseCalloutSyntax = (markdown: string): string => {
    const calloutRegex = /^>\s*\[!?(INFO|WARNING|ERROR|SUCCESS|TIP|NOTE)\]\s*(\+)?\s*\n((?:>.*\n?)*)/gim

    return markdown.replace(calloutRegex, (match, type, collapsible, content) => {
      const calloutType = type.toLowerCase() as CalloutType
      const cleanContent = content
        .split('\n')
        .map((line: string) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim()

      return createCallout(calloutType, cleanContent, !!collapsible)
    })
  }

  const addCallout = (type: CalloutType, content: string, collapsible = false) => {
    callouts.value.push({ type, content, collapsible })
  }

  const removeCallout = (index: number) => {
    callouts.value.splice(index, 1)
  }

  const getAllTypes = (): CalloutType[] => {
    return Object.keys(calloutStyles) as CalloutType[]
  }

  return {
    callouts,
    calloutStyles,
    getStyle,
    createCallout,
    parseCalloutSyntax,
    addCallout,
    removeCallout,
    getAllTypes
  }
}
