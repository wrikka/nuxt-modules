import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function wuiThemeValidator(): Plugin {
  const themeColors = ['border', 'input', 'ring', 'background', 'foreground', 'primary', 'secondary', 'destructive', 'muted', 'accent', 'popover', 'card']
  const themeRadii = ['lg', 'md', 'sm']

  return {
    name: 'wui-theme-validator',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue') && !id.endsWith('.tsx')) return

      const errors: string[] = []

      if (id.endsWith('.vue')) {
        // Use ast-grep for Vue files
        const sg = astGrep(code, { parser: 'html' })
        const matches = sg.findAll({ rule: { pattern: 'class="$CLASSES"' } })
        for (const match of matches) {
          const classesStr = match.getMatch('CLASSES')?.text() || ''
          const classes = classesStr.split(/\s+/).filter(Boolean)
          for (const cls of classes) {
            let isValid = false
            // Check color classes: bg-{color}, text-{color}, etc.
            const colorPrefixes = ['bg-', 'text-', 'border-', 'ring-']
            for (const prefix of colorPrefixes) {
              if (cls.startsWith(prefix)) {
                const color = cls.slice(prefix.length)
                if (themeColors.includes(color) || themeColors.some(tc => color.startsWith(tc + '-'))) {
                  isValid = true
                  break
                }
              }
            }
            // Check border radius: rounded-{radius}
            if (cls.startsWith('rounded-')) {
              const radius = cls.slice('rounded-'.length)
              if (themeRadii.includes(radius)) {
                isValid = true
              }
            }
            // If not valid, add error
            if (!isValid) {
              errors.push(`Class "${cls}" does not match theme in ${id}. Must use theme-defined colors or radii.`)
            }
          }
        }
      } else if (id.endsWith('.tsx')) {
        // Use regex for .tsx files
        const classRegex = /(?:class|className)="([^"]*)"/g
        let match: RegExpExecArray | null
        while ((match = classRegex.exec(code)) !== null) {
          const classesStr = match[1]
          const classes = classesStr.split(/\s+/).filter(Boolean)
          for (const cls of classes) {
            let isValid = false
            // Check color classes: bg-{color}, text-{color}, etc.
            const colorPrefixes = ['bg-', 'text-', 'border-', 'ring-']
            for (const prefix of colorPrefixes) {
              if (cls.startsWith(prefix)) {
                const color = cls.slice(prefix.length)
                if (themeColors.includes(color) || themeColors.some(tc => color.startsWith(tc + '-'))) {
                  isValid = true
                  break
                }
              }
            }
            // Check border radius: rounded-{radius}
            if (cls.startsWith('rounded-')) {
              const radius = cls.slice('rounded-'.length)
              if (themeRadii.includes(radius)) {
                isValid = true
              }
            }
            // If not valid, add error
            if (!isValid) {
              errors.push(`Class "${cls}" does not match theme in ${id}. Must use theme-defined colors or radii.`)
            }
          }
        }
      }

      if (errors.length > 0) {
        console.error(`Theme validation errors in ${id}:\n${errors.map(e => `  - ${e}`).join('\n')}`)
      }
      return code
    }
  }
}
