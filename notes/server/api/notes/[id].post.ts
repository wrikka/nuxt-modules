import type { Note } from '#shared/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // In a real app, you would save this to a database
  console.log(`Saving note ${id}`, body)

  const updatedNote: Note = {
    id: id || `note-${Date.now()}`,
    filename: body.filename,
    content: body.content,
    createdAt: new Date(), // Should be original createdAt
    updatedAt: new Date(),
  }

  return updatedNote
})
