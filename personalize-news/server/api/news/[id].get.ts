import { createError, getRouterParam } from 'h3';
import { getNewsItemById } from '../../lib/newsData';

type NewsSource = {
  title: string;
  source: string;
  url: string;
};

type NewsAiSummary = {
  summary: string;
  keyPoints: string[];
  sources: NewsSource[];
};

export default defineEventHandler(event => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' });
  }

  const item = getNewsItemById(id);

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'News not found' });
  }

  const sources: NewsSource[] = [
    {
      title: item.title,
      source: item.source,
      url: item.url,
    },
    {
      title: `${item.title} (background & context)`,
      source: 'Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Main_Page',
    },
    {
      title: `${item.title} (analysis)`,
      source: 'The Conversation',
      url: 'https://theconversation.com/',
    },
  ];

  const ai: NewsAiSummary = {
    summary:
      'This is a mock AI summary. It will be replaced by a real model later. The goal is to provide a quick, neutral overview with key context and what to watch next.',
    keyPoints: [
      'What happened: a key development was reported by a primary outlet.',
      'Why it matters: it may impact stakeholders and near-term decisions.',
      'What to watch: follow-up announcements, data releases, and official statements.',
    ],
    sources,
  };

  return { item, ai };
});
