import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function performanceLargeObjects(): Plugin {
  return {
    name: 'performance-large-objects',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      // Check for large object literals (heuristic: objects with many properties)
      const largeObjects = sg.findAll({ rule: { pattern: '{ $PROP1: $VAL1, $PROP2: $VAL2, $PROP3: $VAL3, $PROP4: $VAL4, $PROP5: $VAL5 }' } })
      if (largeObjects.length > 0) {
        console.error(`Found potentially large object literal in ${id}. Consider performance implications and memory usage.`)
      }

      return code
    }
  }
}
