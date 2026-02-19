import { labels } from '../../db/labels';

export default defineEventHandler(async (event) => {
  const { label, icon } = await readBody(event);
  if (!label) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Label name is required',
    });
  }

  const newLabel = { name: label, icon: icon || 'mdi:tag' };
  labels.push(newLabel);

  return { success: true, label: newLabel };
});
