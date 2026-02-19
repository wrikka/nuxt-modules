import { emails } from '../../db/emails';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID cannot be empty',
    });
  }

  const index = emails.findIndex(e => e.id === parseInt(id, 10));
  let updatedEmail = null;
  if (index !== -1) {
    const emailToUpdate = emails[index];
    if (emailToUpdate) {
      updatedEmail = { ...emailToUpdate, ...body };
      emails[index] = updatedEmail;
    }
  }

  if (!updatedEmail) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found',
    })
  }

  return updatedEmail
})
