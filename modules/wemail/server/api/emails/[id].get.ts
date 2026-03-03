import { emails } from '../../db/emails';

export default defineEventHandler((event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID cannot be empty',
    });
  }

  const parsedId = parseInt(id, 10);
  const email = emails.find(e => e.id === parsedId);

  if (!email) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found',
    })
  }

  return email
})
