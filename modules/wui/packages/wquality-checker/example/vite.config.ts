import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { createWQualityChecker } from '../../../src/index'

export default defineConfig({
  plugins: [
    ...createWQualityChecker(),
    vue(),
    UnoCSS()
  ]
})
