import { computed, ref } from 'vue';
import type { Notification, NotificationPriority, NotificationType } from '#notifications/types';
import { useNotifications } from './useNotifications';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  priority?: NotificationPriority;
  icon?: string;
  url?: string;
  variables: TemplateVariable[];
  channels?: Notification['channel'][];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
}

export interface TemplateConfig {
  enabled: boolean;
  strictMode: boolean;
  cacheTemplates: boolean;
}

const defaultConfig: TemplateConfig = {
  enabled: true,
  strictMode: false,
  cacheTemplates: true,
};

const templates = ref<Map<string, NotificationTemplate>>(new Map());
const templateCache = new Map<string, string>();

// Built-in templates
const builtInTemplates: NotificationTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Message',
    type: 'info',
    titleTemplate: 'Welcome, {{name}}!',
    messageTemplate: "Thanks for joining us, {{name}}. We're excited to have you here!",
    variables: [{ name: 'name', type: 'string', required: true }],
    icon: 'i-heroicons-sparkles',
  },
  {
    id: 'payment-success',
    name: 'Payment Success',
    type: 'success',
    titleTemplate: 'Payment Successful',
    messageTemplate: 'Your payment of {{amount}} {{currency}} has been processed successfully.',
    priority: 'high',
    variables: [
      { name: 'amount', type: 'number', required: true },
      { name: 'currency', type: 'string', required: false, defaultValue: 'USD' },
    ],
    icon: 'i-heroicons-credit-card',
  },
  {
    id: 'payment-failed',
    name: 'Payment Failed',
    type: 'error',
    titleTemplate: 'Payment Failed',
    messageTemplate: 'Your payment of {{amount}} {{currency}} could not be processed. Reason: {{reason}}',
    priority: 'urgent',
    variables: [
      { name: 'amount', type: 'number', required: true },
      { name: 'currency', type: 'string', required: false, defaultValue: 'USD' },
      { name: 'reason', type: 'string', required: false, defaultValue: 'Unknown error' },
    ],
    icon: 'i-heroicons-exclamation-circle',
  },
  {
    id: 'new-message',
    name: 'New Message',
    type: 'message',
    titleTemplate: 'New message from {{sender}}',
    messageTemplate: '{{preview}}',
    variables: [
      { name: 'sender', type: 'string', required: true },
      { name: 'preview', type: 'string', required: true },
    ],
    icon: 'i-heroicons-chat-bubble-left',
  },
  {
    id: 'system-update',
    name: 'System Update',
    type: 'system',
    titleTemplate: 'System Update Available',
    messageTemplate: 'Version {{version}} is now available. {{notes}}',
    variables: [
      { name: 'version', type: 'string', required: true },
      { name: 'notes', type: 'string', required: false, defaultValue: '' },
    ],
    icon: 'i-heroicons-arrow-path',
  },
  {
    id: 'reminder',
    name: 'Reminder',
    type: 'warning',
    titleTemplate: 'Reminder: {{title}}',
    messageTemplate: '{{description}}',
    priority: 'high',
    variables: [
      { name: 'title', type: 'string', required: true },
      { name: 'description', type: 'string', required: false, defaultValue: '' },
    ],
    icon: 'i-heroicons-clock',
  },
];

export const useNotificationTemplates = (config?: Partial<TemplateConfig>) => {
  const mergedConfig = { ...defaultConfig, ...config };

  // Initialize with built-in templates
  if (templates.value.size === 0) {
    for (const template of builtInTemplates) {
      templates.value.set(template.id, template);
    }
  }

  const interpolate = (template: string, variables: Record<string, unknown>): string => {
    const cacheKey = `${template}:${JSON.stringify(variables)}`;
    if (mergedConfig.cacheTemplates && templateCache.has(cacheKey)) {
      return templateCache.get(cacheKey)!;
    }

    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      result = result.replace(pattern, String(value));
    }

    // Remove any remaining unreplaced variables
    if (mergedConfig.strictMode) {
      const unreplacedPattern = /\{\{\s*\w+\s*\}\}/g;
      if (unreplacedPattern.test(result)) {
        throw new Error('Template contains unreplaced variables');
      }
    }

    if (mergedConfig.cacheTemplates) {
      templateCache.set(cacheKey, result);
    }

    return result;
  };

  const validateVariables = (
    template: NotificationTemplate,
    variables: Record<string, unknown>,
  ): { valid: boolean; errors: string[]; } => {
    const errors: string[] = [];

    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        if (variable.defaultValue === undefined) {
          errors.push(`Missing required variable: ${variable.name}`);
        }
      }

      if (variable.name in variables) {
        const value = variables[variable.name];
        const expectedType = variable.type;

        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`Variable ${variable.name} must be a string`);
        } else if (expectedType === 'number' && typeof value !== 'number') {
          errors.push(`Variable ${variable.name} must be a number`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Variable ${variable.name} must be a boolean`);
        } else if (expectedType === 'date' && !(value instanceof Date) && typeof value !== 'string') {
          errors.push(`Variable ${variable.name} must be a Date or string`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  };

  const render = (
    templateId: string,
    variables: Record<string, unknown> = {},
  ): Notification | null => {
    if (!mergedConfig.enabled) {
      return null;
    }

    const template = templates.value.get(templateId);
    if (!template) {
      return null;
    }

    const validation = validateVariables(template, variables);
    if (!validation.valid) {
      console.error('[Notifications] Template validation failed:', validation.errors);
      return null;
    }

    // Apply default values
    const finalVariables: Record<string, unknown> = {};
    for (const variable of template.variables) {
      if (variable.name in variables) {
        finalVariables[variable.name] = variables[variable.name];
      } else if (variable.defaultValue !== undefined) {
        finalVariables[variable.name] = variable.defaultValue;
      }
    }

    const title = interpolate(template.titleTemplate, finalVariables);
    const message = interpolate(template.messageTemplate, finalVariables);

    return {
      id: '',
      type: template.type,
      title,
      message,
      icon: template.icon,
      priority: template.priority ?? 'normal',
      channel: template.channels?.[0] ?? 'in-app',
      url: template.url,
      read: false,
      createdAt: new Date(),
      data: { templateId, variables: finalVariables },
    };
  };

  const addTemplate = (template: NotificationTemplate): boolean => {
    if (templates.value.has(template.id)) {
      return false;
    }

    templates.value.set(template.id, template);
    return true;
  };

  const updateTemplate = (
    id: string,
    updates: Partial<Omit<NotificationTemplate, 'id'>>,
  ): boolean => {
    const existing = templates.value.get(id);
    if (!existing) {
      return false;
    }

    templates.value.set(id, { ...existing, ...updates });
    return true;
  };

  const removeTemplate = (id: string): boolean => {
    // Prevent removing built-in templates
    if (builtInTemplates.some(t => t.id === id)) {
      return false;
    }

    return templates.value.delete(id);
  };

  const getTemplate = (id: string): NotificationTemplate | undefined => {
    return templates.value.get(id);
  };

  const getAllTemplates = computed(() => {
    return Array.from(templates.value.values());
  });

  const getTemplatesByType = (type: NotificationType): NotificationTemplate[] => {
    return getAllTemplates.value.filter(t => t.type === type);
  };

  const quickNotify = (
    templateId: string,
    variables: Record<string, unknown> = {},
  ): Notification | null => {
    const notification = render(templateId, variables);
    if (notification) {
      const { add } = useNotifications();
      return add(notification);
    }
    return null;
  };

  return {
    templates: getAllTemplates,
    render,
    validateVariables,
    addTemplate,
    updateTemplate,
    removeTemplate,
    getTemplate,
    getTemplatesByType,
    quickNotify,
    interpolate,
  };
};
