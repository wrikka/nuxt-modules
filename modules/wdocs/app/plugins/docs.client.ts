export default defineNuxtPlugin(() => {
  // WDocs initialization
  const config = useAppConfig()

  return {
    provide: {
      docs: {
        version: '0.1.0',
        config
      }
    }
  }
})
