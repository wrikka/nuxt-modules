import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function tsServerSafety(): Plugin {
  return {
    name: 'ts-server-safety',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts')) return

      if (!id.includes('/server/')) return

      const sg = astGrep(code, { parser: 'typescript' })

      // Server requirements: e.g., no client-side globals
      const clientGlobals = sg.findAll({ rule: { any: ['window', 'document', 'localStorage'] } })
      if (clientGlobals.length > 0) {
        console.error(`Server file ${id} must not access client-side globals like window or document.`)
      }

      // Additional server checks

      return code
    }
  }
}
