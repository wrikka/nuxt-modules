import { defineEventHandler, getQuery, type H3Event } from 'h3';
import type { AnnotationAuthor, FlagAnnotation } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const flagKey = query.flagKey as string;

  const authors: AnnotationAuthor[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const annotations: FlagAnnotation[] = [
    {
      id: '1',
      flagKey,
      type: 'note',
      content: 'This flag is being used for the new dashboard rollout. Proceed with caution when disabling.',
      author: authors[0],
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
      isPinned: true,
      isResolved: false,
      replies: [],
    },
    {
      id: '2',
      flagKey,
      type: 'todo',
      content: 'Need to clean up this flag after Q1 release',
      author: authors[1],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      isPinned: false,
      isResolved: false,
      replies: [
        { id: 'r1', content: 'I can help with this', author: authors[0], createdAt: Date.now() - 3600000 },
      ],
    },
  ];

  return { annotations };
});
