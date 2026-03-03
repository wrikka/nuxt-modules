import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function reduceGlobalMutations(): Plugin {
  return {
    name: 'reduce-global-mutations',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      // Check for assignments to global objects like window, document
      const globalMutations = sg.findAll({ rule: { any: [
        { pattern: 'window.$PROP = $VAL' },
        { pattern: 'document.$PROP = $VAL' },
        { pattern: 'globalThis.$PROP = $VAL' }
      ] } })
      if (globalMutations.length > 0) {
        console.error(`Found global object mutations in ${id}. Avoid mutating global state.`)
      }

      return code
    }
  }
}
