import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function tsLibExports(): Plugin {
  return {
    name: 'ts-lib-exports',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts')) return

      if (!id.includes('/lib/')) return

      const sg = astGrep(code, { parser: 'typescript' })

      // Lib requirements: e.g., must have proper exports
      const exports = sg.findAll('export')
      if (exports.length === 0) {
        console.error(`Lib file ${id} must have proper exports.`)
      }

      // Additional lib checks

      return code
    }
  }
}
