import { ref, computed, watch } from 'vue'

interface AIAutocompleteOptions {
  provider: 'openai' | 'anthropic' | 'ollama' | 'custom'
  apiKey?: string
  endpoint?: string
  model?: string
  maxTokens?: number
  temperature?: number
  debounceMs?: number
  triggerDelay?: number
}

interface AIAutocompleteState {
  isLoading: boolean
  suggestion: string
  error: string | null
  context: string
}

interface AIProvider {
  generate: (prompt: string, context: string) => Promise<string>
}

export function useAIAutocomplete(options: AIAutocompleteOptions) {
  const state = ref<AIAutocompleteState>({
    isLoading: false,
    suggestion: '',
    error: null,
    context: ''
  })

  const isEnabled = ref(true)
  const cursorPosition = ref(0)
  let debounceTimer: NodeJS.Timeout | null = null

  const provider = createProvider(options)

  const showSuggestion = computed(() => {
    return isEnabled.value &&
           state.value.suggestion.length > 0 &&
           !state.value.isLoading &&
           state.value.error === null
  })

  const generateContext = (content: string, position: number): string => {
    const lines = content.split('\n')
    let currentPos = 0
    let currentLine = 0
    let column = 0

    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= position) {
        currentLine = i
        column = position - currentPos
        break
      }
      currentPos += lines[i].length + 1
    }

    // Get context: 3 lines before, current line, and partial text
    const contextLines = []
    for (let i = Math.max(0, currentLine - 3); i <= currentLine; i++) {
      if (i === currentLine) {
        contextLines.push(lines[i].substring(0, column))
      } else {
        contextLines.push(lines[i])
      }
    }

    return contextLines.join('\n')
  }

  const generatePrompt = (context: string): string => {
    return `You are an AI writing assistant. Continue the following markdown text naturally and concisely. Only provide the continuation, no explanations.

Context:
${context}

Continue:`
  }

  const fetchSuggestion = async (content: string, position: number) => {
    if (!isEnabled.value) return

    const context = generateContext(content, position)

    // Don't fetch if context is too short
    if (context.trim().length < 10) {
      state.value.suggestion = ''
      return
    }

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    state.value.context = context
    state.value.isLoading = true
    state.value.error = null

    debounceTimer = setTimeout(async () => {
      try {
        const prompt = generatePrompt(context)
        const suggestion = await provider.generate(prompt, context)

        // Clean up suggestion
        state.value.suggestion = suggestion
          .replace(/^["']|["']$/g, '')
          .trim()
          .split('\n')[0] // Only first line for inline suggestions
      } catch (err) {
        state.value.error = err instanceof Error ? err.message : 'Failed to generate suggestion'
        state.value.suggestion = ''
      } finally {
        state.value.isLoading = false
      }
    }, options.debounceMs || 300)
  }

  const acceptSuggestion = (): string => {
    const suggestion = state.value.suggestion
    state.value.suggestion = ''
    return suggestion
  }

  const rejectSuggestion = () => {
    state.value.suggestion = ''
  }

  const toggleEnabled = () => {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) {
      state.value.suggestion = ''
    }
  }

  const setCursorPosition = (position: number) => {
    cursorPosition.value = position
  }

  // Create provider implementations
  function createProvider(opts: AIAutocompleteOptions): AIProvider {
    switch (opts.provider) {
      case 'openai':
        return {
          generate: async (prompt, context) => {
            const response = await fetch(opts.endpoint || 'https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${opts.apiKey}`
              },
              body: JSON.stringify({
                model: opts.model || 'gpt-3.5-turbo',
                messages: [
                  { role: 'system', content: 'You are a helpful writing assistant.' },
                  { role: 'user', content: prompt }
                ],
                max_tokens: opts.maxTokens || 50,
                temperature: opts.temperature || 0.7
              })
            })

            if (!response.ok) {
              throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            return data.choices[0]?.message?.content || ''
          }
        }

      case 'anthropic':
        return {
          generate: async (prompt, context) => {
            const response = await fetch(opts.endpoint || 'https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': opts.apiKey || '',
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: opts.model || 'claude-3-haiku-20240307',
                max_tokens: opts.maxTokens || 50,
                messages: [{ role: 'user', content: prompt }]
              })
            })

            if (!response.ok) {
              throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            return data.content[0]?.text || ''
          }
        }

      case 'ollama':
        return {
          generate: async (prompt, context) => {
            const response = await fetch(opts.endpoint || 'http://localhost:11434/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: opts.model || 'llama2',
                prompt: prompt,
                stream: false,
                options: {
                  temperature: opts.temperature || 0.7,
                  num_predict: opts.maxTokens || 50
                }
              })
            })

            if (!response.ok) {
              throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            return data.response || ''
          }
        }

      default:
        return {
          generate: async () => ''
        }
    }
  }

  return {
    state,
    isEnabled,
    showSuggestion,
    cursorPosition,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    toggleEnabled,
    setCursorPosition
  }
}
