import type { WhiteboardState, Comment, CommentId } from '../../../shared/types/whiteboard'

export function defineCommentActions(state: WhiteboardState) {
  const addComment = (x: number, y: number, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      x,
      y,
      text,
      author: 'User', // Placeholder author
      timestamp: Date.now(),
    }
    state.doc.comments[newComment.id] = newComment
  }

  const updateCommentText = (id: CommentId, text: string) => {
    const comment = state.doc.comments[id]
    if (comment) {
      comment.text = text
    }
  }

  const deleteComment = (id: CommentId) => {
    delete state.doc.comments[id]
  }

  return {
    addComment,
    updateCommentText,
    deleteComment,
  }
}
