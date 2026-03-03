import { labels } from '../../db/labels';
import type { Label } from '../../../shared/types/label';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { originalName, updatedLabel } = body as { originalName: string, updatedLabel: Label };

  if (!originalName || !updatedLabel) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Original name and updated label are required',
    });
  }

  const index = labels.findIndex(l => l.name === originalName);

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Label not found',
    });
  }

  labels[index] = updatedLabel;

  return { success: true, label: updatedLabel };
});
