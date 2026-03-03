import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function tsUtilsPurity(): Plugin {
  return {
    name: 'ts-utils-purity',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts')) return

      if (!id.includes('/utils/')) return

      const sg = astGrep(code, { parser: 'typescript' })

      // Utils must be pure logic, no side effects
      const consoles = sg.findAll({ rule: { pattern: 'console.$_' } })
      if (consoles.length > 0) {
        console.error(`Utils file ${id} must be pure logic with no side effects. Found console statements.`)
      }

      // Additional checks for purity can be added

      return code
    }
  }
}
