// Re-export everything from the new API client
export * from './client'

// Legacy exports for backward compatibility
export { chatApiService as default } from './client'
