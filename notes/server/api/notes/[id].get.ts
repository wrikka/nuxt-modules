import type { Note } from '#shared/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // In a real app, you would fetch this from a database
  const note: Note = {
    id: id || 'note-1',
    filename: `Note ${id}.md`,
    content: `# Note ${id}\n\nThis is the content for note ${id}.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return note
})
