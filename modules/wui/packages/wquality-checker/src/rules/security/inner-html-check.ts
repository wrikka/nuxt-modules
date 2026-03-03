import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function securityInnerHTMLCheck(): Plugin {
  return {
    name: 'security-inner-html-check',
    transform(code: string, id: string) {
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.vue')) return

      const parser = id.endsWith('.vue') ? 'html' : 'javascript'
      const sg = astGrep(code, { parser })

      const innerHTML = sg.findAll({ rule: { pattern: 'innerHTML =' } })
      if (innerHTML.length > 0) {
        console.error(`Found innerHTML assignment in ${id}. Security risk: potential XSS vulnerability.`)
      }

      return code
    }
  }
}
