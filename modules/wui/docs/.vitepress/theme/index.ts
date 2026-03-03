import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import DemoBlock from './components/DemoBlock.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('DemoBlock', DemoBlock)
    // Import and register components from modules/wui
    // This will be handled by alias in config.ts
  }
}
