import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function performanceRecursiveFunctions(): Plugin {
  return {
    name: 'performance-recursive-functions',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      // Check for potential recursive functions (rough pattern)
      const recursivePatterns = sg.findAll({ rule: { pattern: 'function $NAME($ARGS) { $BODY $NAME($CALL) $BODY }' } })
      if (recursivePatterns.length > 0) {
        console.error(`Found potential recursive function pattern in ${id}. Ensure proper termination to avoid stack overflow.`)
      }

      return code
    }
  }
}
