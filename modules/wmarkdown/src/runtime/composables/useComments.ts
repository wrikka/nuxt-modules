import { ref, computed } from 'vue'
import type { Comment } from '../types'

interface CommentPosition {
  start: number
  end: number
}

interface CommentWithPosition extends Comment {
  position: CommentPosition
  resolved: boolean
  replies: Comment[]
}

export function useComments() {
  const comments = ref<CommentWithPosition[]>([])
  const selectedCommentId = ref<string | null>(null)
  const isAddingComment = ref(false)

  const activeComments = computed(() => {
    return comments.value.filter(c => !c.resolved)
  })

  const resolvedComments = computed(() => {
    return comments.value.filter(c => c.resolved)
  })

  const addComment = (text: string, author: string, position: CommentPosition): string => {
    const id = generateId()
    const comment: CommentWithPosition = {
      id,
      text,
      author,
      timestamp: Date.now(),
      position,
      resolved: false,
      replies: []
    }
    comments.value.push(comment)
    return id
  }

  const replyToComment = (parentId: string, text: string, author: string): boolean => {
    const parent = comments.value.find(c => c.id === parentId)
    if (!parent) return false

    const reply: Comment = {
      id: generateId(),
      text,
      author,
      timestamp: Date.now(),
      position: parent.position
    }

    parent.replies.push(reply)
    return true
  }

  const resolveComment = (id: string): boolean => {
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      comment.resolved = true
      return true
    }
    return false
  }

  const unresolveComment = (id: string): boolean => {
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      comment.resolved = false
      return true
    }
    return false
  }

  const deleteComment = (id: string): boolean => {
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comments.value.splice(index, 1)
      return true
    }
    return false
  }

  const updateComment = (id: string, newText: string): boolean => {
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      comment.text = newText
      return true
    }
    return false
  }

  const getCommentsInRange = (start: number, end: number): CommentWithPosition[] => {
    return comments.value.filter(
      c => c.position.start >= start && c.position.end <= end
    )
  }

  const selectComment = (id: string | null) => {
    selectedCommentId.value = id
  }

  const getSelectedComment = computed(() => {
    return comments.value.find(c => c.id === selectedCommentId.value) || null
  })

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const clearAllComments = () => {
    comments.value = []
    selectedCommentId.value = null
  }

  const exportComments = (): string => {
    return JSON.stringify(comments.value, null, 2)
  }

  const importComments = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json)
      if (Array.isArray(parsed)) {
        comments.value = parsed
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const getCommentCount = computed(() => {
    return {
      total: comments.value.length,
      active: activeComments.value.length,
      resolved: resolvedComments.value.length
    }
  })

  return {
    comments,
    selectedCommentId,
    isAddingComment,
    activeComments,
    resolvedComments,
    getSelectedComment,
    getCommentCount,
    addComment,
    replyToComment,
    resolveComment,
    unresolveComment,
    deleteComment,
    updateComment,
    getCommentsInRange,
    selectComment,
    formatTimestamp,
    clearAllComments,
    exportComments,
    importComments
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
