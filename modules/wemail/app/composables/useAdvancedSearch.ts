export interface SearchQuery {
  raw: string;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  hasAttachment?: boolean;
  isStarred?: boolean;
  isRead?: boolean;
  folder?: string;
  after?: string; // ISO date
  before?: string; // ISO date
  label?: string;
}

export const useAdvancedSearch = () => {
  const _query = ref('');
  const _parsedQuery = ref<SearchQuery>({ raw: '' });
  const _showAdvanced = ref(false);

  const _operators = [
    { key: 'from:', type: 'from' },
    { key: 'to:', type: 'to' },
    { key: 'subject:', type: 'subject' },
    { key: 'body:', type: 'body' },
    { key: 'has:', type: 'has' },
    { key: 'is:', type: 'is' },
    { key: 'in:', type: 'folder' },
    { key: 'after:', type: 'after' },
    { key: 'before:', type: 'before' },
    { key: 'label:', type: 'label' },
  ];

  const parseQuery = (rawQuery: string): SearchQuery => {
    const result: SearchQuery = { raw: rawQuery };

    // Parse operators
    const operatorRegex = /(\w+):("[^"]+"|[^\s]+)/g;
    let match;

    while ((match = operatorRegex.exec(rawQuery)) !== null) {
      const [, operator, value] = match;
      const cleanValue = value.replace(/^"|"$/g, '');

      switch (operator) {
        case 'from':
          result.from = cleanValue;
          break;
        case 'to':
          result.to = cleanValue;
          break;
        case 'subject':
          result.subject = cleanValue;
          break;
        case 'body':
          result.body = cleanValue;
          break;
        case 'has':
          if (cleanValue === 'attachment') result.hasAttachment = true;
          break;
        case 'is':
          if (cleanValue === 'starred') result.isStarred = true;
          if (cleanValue === 'read') result.isRead = true;
          if (cleanValue === 'unread') result.isRead = false;
          break;
        case 'in':
          result.folder = cleanValue;
          break;
        case 'after':
          result.after = cleanValue;
          break;
        case 'before':
          result.before = cleanValue;
          break;
        case 'label':
          result.label = cleanValue;
          break;
      }
    }

    // Remove operators from raw query for text search
    let textQuery = rawQuery.replace(operatorRegex, '').trim();
    if (textQuery) {
      result.body = textQuery;
    }

    return result;
  };

  const buildQuery = (params: Omit<SearchQuery, 'raw'>): string => {
    const parts: string[] = [];

    if (params.from) parts.push(`from:"${params.from}"`);
    if (params.to) parts.push(`to:"${params.to}"`);
    if (params.subject) parts.push(`subject:"${params.subject}"`);
    if (params.body && !params.from && !params.to && !params.subject) parts.push(params.body);
    if (params.hasAttachment) parts.push('has:attachment');
    if (params.isStarred) parts.push('is:starred');
    if (params.isRead === true) parts.push('is:read');
    if (params.isRead === false) parts.push('is:unread');
    if (params.folder) parts.push(`in:${params.folder}`);
    if (params.after) parts.push(`after:${params.after}`);
    if (params.before) parts.push(`before:${params.before}`);
    if (params.label) parts.push(`label:"${params.label}"`);

    return parts.join(' ');
  };

  const search = async (rawQuery: string) => {
    _query.value = rawQuery;
    _parsedQuery.value = parseQuery(rawQuery);

    const params: Record<string, string> = {};

    if (_parsedQuery.value.from) params.from = _parsedQuery.value.from;
    if (_parsedQuery.value.to) params.to = _parsedQuery.value.to;
    if (_parsedQuery.value.subject) params.subject = _parsedQuery.value.subject;
    if (_parsedQuery.value.body) params.q = _parsedQuery.value.body;
    if (_parsedQuery.value.folder) params.folder = _parsedQuery.value.folder;
    if (_parsedQuery.value.label) params.label = _parsedQuery.value.label;
    if (_parsedQuery.value.isStarred) params.starred = 'true';

    return $fetch('/api/emails/search', {
      method: 'GET',
      params,
    });
  };

  const suggestions = computed(() => {
    const input = _query.value.toLowerCase();
    if (!input || input.includes(':')) return [];

    return _operators
      .filter(op => op.key.startsWith(input) || input.startsWith(op.key))
      .map(op => ({
        label: `${op.key}`,
        description: `Filter by ${op.type}`,
      }));
  });

  const toggleAdvanced = () => {
    _showAdvanced.value = !_showAdvanced.value;
  };

  return {
    query: _query,
    parsedQuery: _parsedQuery,
    showAdvanced: _showAdvanced,
    suggestions,
    parseQuery,
    buildQuery,
    search,
    toggleAdvanced,
  };
};
