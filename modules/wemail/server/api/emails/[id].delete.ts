import { emails } from '../../db/emails';

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  const index = emails.findIndex(e => e.id === id);
  const success = index !== -1;
  if (success) {
    emails.splice(index, 1);
  }

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found',
    })
  }

  return { success: true }
})
