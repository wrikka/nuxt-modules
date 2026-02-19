import { labels } from '../../db/labels';

export default defineEventHandler(async (event) => {
  const { label } = await readBody(event);
  if (!label) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Label name is required',
    });
  }

  const index = labels.findIndex(l => l.name === label);
  if (index !== -1) {
    labels.splice(index, 1);
  }

  return { success: true };
});
