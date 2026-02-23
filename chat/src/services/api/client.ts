import type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  CreateMessageRequest,
  UpdateMessageRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  SearchMessagesRequest,
  SearchMessagesResponse,
  FileUploadRequest,
  FileUploadResponse,
  VoiceUploadRequest,
  VoiceTranscriptionRequest,
  VoiceTranscriptionResponse,
  ChatAnalyticsRequest,
  ChatAnalyticsResponse
} from '../types/api'
import type { ChatMessage, ChatSession } from '../types/domain'

export class ChatApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ChatApiError'
  }
}

export class ChatApiService {
  private baseUrl = '/api/chat'
  private defaultHeaders = {
    'Content-Type': 'application/json'
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ChatApiError(
        errorData.code || `HTTP_${response.status}`,
        errorData.message || response.statusText,
        errorData.details
      )
    }

    const data = await response.json()
    return data
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    }

    try {
      const response = await fetch(url, config)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error
      }
      throw new ChatApiError('NETWORK_ERROR', 'Network error occurred', { originalError: error })
    }
  }

  // Message Operations
  async createMessage(
    sessionId: string,
    request: CreateMessageRequest
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ApiResponse<ChatMessage>>(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async updateMessage(
    sessionId: string,
    messageId: string,
    request: UpdateMessageRequest
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ApiResponse<ChatMessage>>(`/sessions/${sessionId}/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }

  async deleteMessage(
    sessionId: string,
    messageId: string
  ): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/sessions/${sessionId}/messages/${messageId}`, {
      method: 'DELETE'
    })
  }

  async getMessage(
    sessionId: string,
    messageId: string
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ApiResponse<ChatMessage>>(`/sessions/${sessionId}/messages/${messageId}`)
  }

  async getMessages(
    sessionId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<ChatMessage>> {
    return this.request<PaginatedResponse<ChatMessage>>(
      `/sessions/${sessionId}/messages?page=${page}&limit=${limit}`
    )
  }

  // Session Operations
  async createSession(request: CreateSessionRequest): Promise<ApiResponse<ChatSession>> {
    return this.request<ApiResponse<ChatSession>>('/sessions', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async updateSession(
    sessionId: string,
    request: UpdateSessionRequest
  ): Promise<ApiResponse<ChatSession>> {
    return this.request<ApiResponse<ChatSession>>(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/sessions/${sessionId}`, {
      method: 'DELETE'
    })
  }

  async getSession(sessionId: string): Promise<ApiResponse<ChatSession>> {
    return this.request<ApiResponse<ChatSession>>(`/sessions/${sessionId}`)
  }

  async getSessions(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<ChatSession>> {
    return this.request<PaginatedResponse<ChatSession>>(
      `/sessions?page=${page}&limit=${limit}`
    )
  }

  // Search Operations
  async searchMessages(
    request: SearchMessagesRequest
  ): Promise<ApiResponse<SearchMessagesResponse>> {
    return this.request<ApiResponse<SearchMessagesResponse>>('/search/messages', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // File Operations
  async uploadFile(request: FileUploadRequest): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('sessionId', request.sessionId)
    if (request.messageId) {
      formData.append('messageId', request.messageId)
    }
    formData.append('type', request.type)

    return this.request<ApiResponse<FileUploadResponse>>('/files/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    })
  }

  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/files/${fileId}`, {
      method: 'DELETE'
    })
  }

  // Voice Operations
  async uploadVoiceMessage(request: VoiceUploadRequest): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData()
    formData.append('audio', request.audioBlob, 'voice.wav')
    formData.append('sessionId', request.sessionId)
    formData.append('duration', request.duration.toString())
    if (request.format) {
      formData.append('format', request.format)
    }

    return this.request<ApiResponse<FileUploadResponse>>('/voice/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    })
  }

  async transcribeVoice(request: VoiceTranscriptionRequest): Promise<ApiResponse<VoiceTranscriptionResponse>> {
    const formData = new FormData()
    formData.append('audio', request.audioFile)
    if (request.language) {
      formData.append('language', request.language)
    }

    return this.request<ApiResponse<VoiceTranscriptionResponse>>('/voice/transcribe', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    })
  }

  // Analytics Operations
  async getAnalytics(request: ChatAnalyticsRequest): Promise<ApiResponse<ChatAnalyticsResponse>> {
    const params = new URLSearchParams()

    if (request.sessionId) {
      params.append('sessionId', request.sessionId)
    }

    if (request.dateRange) {
      params.append('startDate', request.dateRange.start.toISOString())
      params.append('endDate', request.dateRange.end.toISOString())
    }

    if (request.metrics) {
      params.append('metrics', request.metrics.join(','))
    }

    return this.request<ApiResponse<ChatAnalyticsResponse>>(`/analytics?${params.toString()}`)
  }

  // Reaction Operations
  async addReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/messages/${messageId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji, userId })
    })
  }

  async removeReaction(reactionId: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/reactions/${reactionId}`, {
      method: 'DELETE'
    })
  }

  async getReactions(messageId: string): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>(`/messages/${messageId}/reactions`)
  }

  // WebSocket connection for real-time features
  createWebSocketConnection(sessionId: string): WebSocket {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}${this.baseUrl}/ws/${sessionId}`
    return new WebSocket(wsUrl)
  }

  // Utility method to set authentication token
  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    }
  }

  // Utility method to remove authentication token
  removeAuthToken(): void {
    const { Authorization, ...rest } = this.defaultHeaders
    this.defaultHeaders = rest
  }
}

// Create singleton instance
export const chatApiService = new ChatApiService()

// Export composable for easy usage in Vue components
export const useChatApiService = () => chatApiService
