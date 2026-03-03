import { emails } from '../../db/emails';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  let filteredEmails = emails;

  if (query.q) {
    const searchTerm = (query.q as string).toLowerCase();
    filteredEmails = filteredEmails.filter(email =>
      email.subject.toLowerCase().includes(searchTerm) ||
      email.from.toLowerCase().includes(searchTerm) ||
      email.body.toLowerCase().includes(searchTerm)
    );
  }

  if (query.starred) {
    filteredEmails = filteredEmails.filter(email => email.starred);
  }

  if (query.favorited) {
    filteredEmails = filteredEmails.filter(email => email.favorited);
  }

  if (query.folder) {
    filteredEmails = filteredEmails.filter(email => email.folder === query.folder);
  } else if (query.label) {
    filteredEmails = filteredEmails.filter(email => email.labels?.includes(query.label as string));
  } else {
    filteredEmails = filteredEmails.filter(email => email.folder === 'inbox');
    if (query.tab === 'Promotions') {
      filteredEmails = filteredEmails.filter(e => e.labels?.includes('Promotions'));
    } else if (query.tab === 'Updates') {
      filteredEmails = filteredEmails.filter(e => e.labels?.includes('Updates'));
    } else if (query.tab === 'Primary') {
      filteredEmails = filteredEmails.filter(e => !e.labels?.includes('Promotions') && !e.labels?.includes('Updates'));
    }
  }

  // Ensure every email has a `labels` array
  const result = filteredEmails.map(email => ({ ...email, labels: email.labels || [] }));

  return result;
});
