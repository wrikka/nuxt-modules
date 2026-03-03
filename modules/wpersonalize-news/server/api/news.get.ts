import type { NewsCategory, NewsItem } from '#shared/types/news';
import { getQuery } from 'h3';
import { getNewsItems } from '../lib/newsData';

export default defineEventHandler(event => {
  const query = getQuery(event);
  const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : '';
  const category = typeof query.category === 'string' ? query.category : 'All';
  const range = typeof query.range === 'string' ? query.range : 'all';
  const sourcesRaw = typeof query.sources === 'string' ? query.sources : '';
  const tagsRaw = typeof query.tags === 'string' ? query.tags : '';

  const items: NewsItem[] = getNewsItems();

  const normalizedCategory = category as NewsCategory;

  const sources = sourcesRaw
    .split(',')
    .map(x => x.trim())
    .filter(x => x.length > 0);

  const tags = tagsRaw
    .split(',')
    .map(x => x.trim())
    .filter(x => x.length > 0);

  const timestamps = items
    .map(x => new Date(x.publishedAtLabel).getTime())
    .filter(t => Number.isFinite(t));
  const newest = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
  const todayStart = new Date(newest);
  todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const filtered = items.filter(x => {
    const categoryOk = normalizedCategory === 'All' || x.category === normalizedCategory;
    const ts = new Date(x.publishedAtLabel).getTime();
    const rangeOk = range === 'all'
      || (range === 'today' && Number.isFinite(ts) && ts >= todayStart.getTime())
      || (range === '7d' && Number.isFinite(ts) && ts >= sevenDaysAgo.getTime());
    const sourcesOk = sources.length === 0 || sources.includes(x.source);
    const tagsOk = tags.length === 0 || tags.some(t => x.tags.includes(t));
    const qOk = q.length === 0
      || x.title.toLowerCase().includes(q)
      || x.source.toLowerCase().includes(q)
      || x.tags.some(t => t.toLowerCase().includes(q));
    return categoryOk && rangeOk && sourcesOk && tagsOk && qOk;
  });

  return { items: filtered };
});
