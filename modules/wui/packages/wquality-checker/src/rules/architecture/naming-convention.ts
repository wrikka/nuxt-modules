import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function architectureNamingConvention(): Plugin {
  return {
    name: 'architecture-naming-convention',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      // Check for function declarations with non-camelCase names
      const functions = sg.findAll({ rule: { pattern: 'function $NAME($ARGS) {' } })
      for (const func of functions) {
        const name = func.getMatch('NAME')?.text() || ''
        if (name && !/^[a-z][a-zA-Z0-9]*$/.test(name)) {
          console.error(`Function "${name}" in ${id} should be camelCase.`)
        }
      }

      return code
    }
  }
}
