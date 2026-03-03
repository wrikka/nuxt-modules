import type { Plugin } from 'vite'

export function wuiNoDarkClasses(): Plugin {
  return {
    name: 'wui-no-dark-classes',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue') && !id.endsWith('.tsx')) return

      // Simple check for 'dark' in class attributes
      const classRegex = /(?:class|className)="([^"]*)"/g
      let match: RegExpExecArray | null
      while ((match = classRegex.exec(code)) !== null) {
        const classesStr = match[1]
        const classes = classesStr.split(/\s+/).filter(Boolean)
        for (const cls of classes) {
          if (cls.includes('dark')) {
            console.error(`Found 'dark' in class "${cls}" in ${id}. Dark classes are not allowed.`)
          }
        }
      }

      return code
    }
  }
}
