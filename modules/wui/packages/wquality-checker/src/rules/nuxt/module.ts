import { defineNuxtModule } from '@nuxt/kit'
import { astGrep } from '@ast-grep/napi'

function nuxtVueRules() {
  return {
    name: 'nuxt-vue-rules',
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

export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.options.vite = nuxt.options.vite || {}
    nuxt.options.vite.plugins = nuxt.options.vite.plugins || []
    nuxt.options.vite.plugins.push(nuxtVueRules())
  }
})
