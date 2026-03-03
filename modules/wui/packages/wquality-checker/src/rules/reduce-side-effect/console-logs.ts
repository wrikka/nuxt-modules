import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function reduceConsoleLogs(): Plugin {
  return {
    name: 'reduce-console-logs',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      const consoles = sg.findAll('console.log')
      if (consoles.length > 0) {
        console.error(`Found console.log in ${id}. Reduce side effects.`)
      }

      return code
    }
  }
}
