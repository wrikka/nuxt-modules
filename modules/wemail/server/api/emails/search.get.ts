import { emails } from '../../db/emails';
import type { Email } from '../../../shared/types/email';

interface SearchQuery {
  q?: string;
  from?: string;
  to?: string;
  subject?: string;
  folder?: string;
  label?: string;
  starred?: string;
  after?: string;
  before?: string;
}

export default defineEventHandler((event) => {
  const query = getQuery<SearchQuery>(event);
  let results = [...emails];

  // Text search (q parameter)
  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    results = results.filter(email =>
      email.subject.toLowerCase().includes(searchTerm) ||
      email.from.toLowerCase().includes(searchTerm) ||
      email.body.toLowerCase().includes(searchTerm)
    );
  }

  // From filter
  if (query.from) {
    const fromTerm = query.from.toLowerCase();
    results = results.filter(email =>
      email.from.toLowerCase().includes(fromTerm)
    );
  }

  // To filter
  if (query.to) {
    const toTerm = query.to.toLowerCase();
    results = results.filter(email =>
      email.to?.toLowerCase().includes(toTerm)
    );
  }

  // Subject filter
  if (query.subject) {
    const subjectTerm = query.subject.toLowerCase();
    results = results.filter(email =>
      email.subject.toLowerCase().includes(subjectTerm)
    );
  }

  // Folder filter
  if (query.folder) {
    results = results.filter(email => email.folder === query.folder);
  }

  // Label filter
  if (query.label) {
    results = results.filter(email =>
      email.labels?.includes(query.label!)
    );
  }

  // Starred filter
  if (query.starred === 'true') {
    results = results.filter(email => email.starred);
  }

  // Date filters
  if (query.after) {
    const afterDate = new Date(query.after);
    results = results.filter(email => new Date(email.time) >= afterDate);
  }

  if (query.before) {
    const beforeDate = new Date(query.before);
    results = results.filter(email => new Date(email.time) <= beforeDate);
  }

  // Ensure labels array exists
  return results.map(email => ({ ...email, labels: email.labels || [] }));
});
