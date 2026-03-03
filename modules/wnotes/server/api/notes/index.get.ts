import type { Note } from '#shared/types'

export default defineEventHandler(async () => {
  // In a real app, you would fetch this from a database
  const notes: Note[] = Array.from({ length: 10 }, (_, i) => ({
    id: `note-${i + 1}`,
    filename: `Note ${i + 1}.md`,
    content: `# Note ${i + 1}\n\nThis is the content for note ${i + 1}.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return notes
})
