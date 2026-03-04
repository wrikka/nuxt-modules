import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function tsChecker(): Plugin {
  return {
    name: 'ts-checker',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts')) return

      const sg = astGrep(code, { parser: 'typescript' })

      if (id.includes('/utils/')) {
        // Utils must be pure logic, no side effects
        const consoles = sg.findAll({ rule: { pattern: 'console.$_' } })
        if (consoles.length > 0) {
          console.error(`Utils file ${id} must be pure logic with no side effects. Found console statements.`)
        }

        // Additional checks for purity can be added
      } else if (id.includes('/lib/')) {
        // Lib requirements: e.g., must have proper exports
        const exports = sg.findAll('export')
        if (exports.length === 0) {
          console.error(`Lib file ${id} must have proper exports.`)
        }

        // Additional lib checks
      } else if (id.includes('/server/')) {
        // Server requirements: e.g., no client-side globals
        const clientGlobals = sg.findAll({ rule: { any: ['window', 'document', 'localStorage'] } })
        if (clientGlobals.length > 0) {
          console.error(`Server file ${id} must not access client-side globals like window or document.`)
        }

        // Additional server checks
      }

      return code
    }
  }
}
