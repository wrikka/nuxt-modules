export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tags: string[];
  importedAt: string;
}

export const useImportContacts = () => {
  const _contacts = ref<Contact[]>([]);
  const _isImporting = ref(false);
  const _importError = ref<string | null>(null);
  const _importProgress = ref(0);

  const CONTACTS_STORAGE_KEY = 'wemail:contacts';

  const loadContacts = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (stored) {
      try {
        _contacts.value = JSON.parse(stored);
      } catch {
        _contacts.value = [];
      }
    }
  };

  const saveContacts = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(_contacts.value));
  };

  const _parseCSV = (content: string): Partial<Contact>[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    const phoneIndex = headers.findIndex(h => h.includes('phone'));
    const companyIndex = headers.findIndex(h => h.includes('company'));

    const results: Partial<Contact>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const contact: Partial<Contact> = {};

      if (nameIndex >= 0) contact.name = values[nameIndex];
      if (emailIndex >= 0) contact.email = values[emailIndex];
      if (phoneIndex >= 0) contact.phone = values[phoneIndex];
      if (companyIndex >= 0) contact.company = values[companyIndex];

      if (contact.email) {
        results.push(contact);
      }
    }

    return results;
  };

  const _parseVCard = (content: string): Partial<Contact>[] => {
    const contacts: Partial<Contact>[] = [];
    const vcards = content.split('BEGIN:VCARD');

    for (const vcard of vcards) {
      if (!vcard.includes('END:VCARD')) continue;

      const lines = vcard.split('\n');
      const contact: Partial<Contact> = {};

      for (const line of lines) {
        if (line.startsWith('FN:')) {
          contact.name = line.substring(3);
        } else if (line.startsWith('EMAIL')) {
          const emailMatch = line.match(/:(.+)$/);
          if (emailMatch) contact.email = emailMatch[1];
        } else if (line.startsWith('TEL')) {
          const phoneMatch = line.match(/:(.+)$/);
          if (phoneMatch) contact.phone = phoneMatch[1];
        } else if (line.startsWith('ORG:')) {
          contact.company = line.substring(4);
        }
      }

      if (contact.email) {
        contacts.push(contact);
      }
    }

    return contacts;
  };

  const importFromCSV = async (file: File): Promise<number> => {
    _isImporting.value = true;
    _importError.value = null;
    _importProgress.value = 0;

    try {
      const content = await file.text();
      const parsed = _parseCSV(content);

      _importProgress.value = 50;

      const newContacts: Contact[] = parsed.map(p => ({
        id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: p.name || '',
        email: p.email || '',
        phone: p.phone,
        company: p.company,
        tags: ['imported'],
        importedAt: new Date().toISOString(),
      }));

      _contacts.value.push(...newContacts);
      saveContacts();

      _importProgress.value = 100;
      _isImporting.value = false;

      return newContacts.length;
    } catch (err) {
      _importError.value = err instanceof Error ? err.message : 'Failed to import CSV';
      _isImporting.value = false;
      return 0;
    }
  };

  const importFromVCard = async (file: File): Promise<number> => {
    _isImporting.value = true;
    _importError.value = null;
    _importProgress.value = 0;

    try {
      const content = await file.text();
      const parsed = _parseVCard(content);

      _importProgress.value = 50;

      const newContacts: Contact[] = parsed.map(p => ({
        id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: p.name || '',
        email: p.email || '',
        phone: p.phone,
        company: p.company,
        tags: ['imported', 'vcard'],
        importedAt: new Date().toISOString(),
      }));

      _contacts.value.push(...newContacts);
      saveContacts();

      _importProgress.value = 100;
      _isImporting.value = false;

      return newContacts.length;
    } catch (err) {
      _importError.value = err instanceof Error ? err.message : 'Failed to import vCard';
      _isImporting.value = false;
      return 0;
    }
  };

  const deleteContact = (id: string): boolean => {
    const index = _contacts.value.findIndex(c => c.id === id);
    if (index === -1) return false;

    _contacts.value.splice(index, 1);
    saveContacts();
    return true;
  };

  const searchContacts = (query: string): Contact[] => {
    const lowerQuery = query.toLowerCase();
    return _contacts.value.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.company?.toLowerCase().includes(lowerQuery) ||
      c.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  };

  const getContactsByTag = (tag: string): Contact[] => {
    return _contacts.value.filter(c => c.tags.includes(tag));
  };

  onMounted(() => {
    loadContacts();
  });

  return {
    contacts: _contacts,
    isImporting: _isImporting,
    importError: _importError,
    importProgress: _importProgress,
    loadContacts,
    importFromCSV,
    importFromVCard,
    deleteContact,
    searchContacts,
    getContactsByTag,
  };
};
