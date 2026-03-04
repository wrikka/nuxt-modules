export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

const TEMPLATES_STORAGE_KEY = 'wemail:templates';

export const useEmailTemplates = () => {
  const _templates = ref<EmailTemplate[]>([]);
  const _isLoaded = ref(false);

  const _generateId = (): string => {
    return `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const loadTemplates = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      try {
        _templates.value = JSON.parse(stored);
      } catch {
        _templates.value = [];
      }
    }
    _isLoaded.value = true;
  };

  const saveTemplates = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(_templates.value));
  };

  const createTemplate = (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate => {
    const now = Date.now();
    const template: EmailTemplate = {
      ...data,
      id: _generateId(),
      createdAt: now,
      updatedAt: now,
    };
    _templates.value.push(template);
    saveTemplates();
    return template;
  };

  const updateTemplate = (id: string, updates: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): EmailTemplate | null => {
    const index = _templates.value.findIndex(t => t.id === id);
    if (index === -1) return null;

    _templates.value[index] = {
      ..._templates.value[index],
      ...updates,
      updatedAt: Date.now(),
    };
    saveTemplates();
    return _templates.value[index];
  };

  const deleteTemplate = (id: string): boolean => {
    const index = _templates.value.findIndex(t => t.id === id);
    if (index === -1) return false;

    _templates.value.splice(index, 1);
    saveTemplates();
    return true;
  };

  const getTemplate = (id: string): EmailTemplate | undefined => {
    return _templates.value.find(t => t.id === id);
  };

  const searchTemplates = (query: string): EmailTemplate[] => {
    const lowerQuery = query.toLowerCase();
    return _templates.value.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.subject.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const applyTemplate = (template: EmailTemplate): { subject: string; body: string } => {
    return {
      subject: template.subject,
      body: template.body,
    };
  };

  const duplicateTemplate = (id: string): EmailTemplate | null => {
    const original = getTemplate(id);
    if (!original) return null;

    return createTemplate({
      name: `${original.name} (Copy)`,
      subject: original.subject,
      body: original.body,
      tags: [...original.tags],
    });
  };

  onMounted(() => {
    loadTemplates();
  });

  return {
    templates: _templates,
    isLoaded: _isLoaded,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    searchTemplates,
    applyTemplate,
    duplicateTemplate,
  };
};
