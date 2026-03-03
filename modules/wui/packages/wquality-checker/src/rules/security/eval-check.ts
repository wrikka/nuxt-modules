import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function securityEvalCheck(): Plugin {
  return {
    name: 'security-eval-check',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      const evals = sg.findAll('eval')
      if (evals.length > 0) {
        console.error(`Found eval in ${id}. Security risk: eval can execute malicious code.`)
      }

      return code
    }
  }
}
