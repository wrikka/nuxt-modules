import { defineConfig } from 'unocss'

export default defineConfig({
  theme: {
    animation: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easings: {
        ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
        easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
        elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
})
