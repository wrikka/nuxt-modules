import type { Plugin } from 'vite'
import { astGrep } from '@ast-grep/napi'

export function vueScriptOrder(): Plugin {
  return {
    name: 'vue-script-order',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return

      const sg = astGrep(code, { parser: 'html' })
      const script = sg.find('script')
      const template = sg.find('template')

      if (script && template) {
        if (script.range().start.index > template.range().start.index) {
          console.error(`Script must be above template in ${id}`)
        }
      }

      return code
    }
  }
}
