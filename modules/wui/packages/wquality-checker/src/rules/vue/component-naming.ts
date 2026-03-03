import type { Plugin } from 'vite'

export function vueComponentNaming(): Plugin {
  return {
    name: 'vue-component-naming',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return

      // Check if component file name is PascalCase
      const fileName = id.split('/').pop()?.split('.')[0] || ''
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(fileName)) {
        console.error(`Vue component file ${id} should be named in PascalCase.`)
      }

      return code
    }
  }
}
