import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  return {
    provide: {
      colorMode
    }
  }
})
