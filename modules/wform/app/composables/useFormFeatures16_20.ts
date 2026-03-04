import { ref } from 'vue';

// Feature 16: IP Restriction
export interface IPRestriction {
  allowedIPs?: string[];
  blockedIPs?: string[];
  allowedCountries?: string[];
  blockedCountries?: string[];
  allowVPN?: boolean;
  message?: string;
}

export function useIPRestriction() {
  const currentIP = ref<string>('');
  const currentCountry = ref<string>('');

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      currentIP.value = data.ip;
      return data.ip;
    } catch {
      return '';
    }
  };

  const checkIPRestriction = async (restriction: IPRestriction): Promise<{ allowed: boolean; reason?: string }> => {
    const ip = await getClientIP();

    // Check blocked IPs
    if (restriction.blockedIPs?.includes(ip)) {
      return {
        allowed: false,
        reason: restriction.message ?? 'Access denied from this IP address.',
      };
    }

    // Check allowed IPs (if specified)
    if (restriction.allowedIPs && restriction.allowedIPs.length > 0) {
      if (!restriction.allowedIPs.includes(ip)) {
        return {
          allowed: false,
          reason: restriction.message ?? 'Access restricted to specific IP addresses.',
        };
      }
    }

    // Check country restrictions
    if (restriction.allowedCountries || restriction.blockedCountries) {
      const country = await getCountryFromIP(ip);
      currentCountry.value = country;

      if (restriction.blockedCountries?.includes(country)) {
        return {
          allowed: false,
          reason: restriction.message ?? 'Access denied from your country.',
        };
      }

      if (restriction.allowedCountries && restriction.allowedCountries.length > 0) {
        if (!restriction.allowedCountries.includes(country)) {
          return {
            allowed: false,
            reason: restriction.message ?? 'Access restricted to specific countries.',
          };
        }
      }
    }

    return { allowed: true };
  };

  const getCountryFromIP = async (ip: string): Promise<string> => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/country/`);
      return await response.text();
    } catch {
      return '';
    }
  };

  return {
    currentIP,
    currentCountry,
    getClientIP,
    checkIPRestriction,
  };
}

// Feature 17: Webhook Retry Logic
export interface WebhookAttempt {
  id: string;
  webhookId: string;
  url: string;
  payload: unknown;
  attemptNumber: number;
  status: 'pending' | 'success' | 'failed';
  responseStatus?: number;
  responseBody?: string;
  error?: string;
  createdAt: Date;
  executedAt?: Date;
}

export function useWebhookRetry() {
  const attempts = ref<WebhookAttempt[]>([]);
  const isProcessing = ref(false);

  const retryConfig = {
    maxRetries: 5,
    retryDelays: [1000, 5000, 15000, 30000, 60000], // exponential backoff
    timeout: 30000,
  };

  const sendWebhook = async (
    webhookId: string,
    url: string,
    payload: unknown,
    headers?: Record<string, string>,
  ): Promise<WebhookAttempt> => {
    const attempt: WebhookAttempt = {
      id: `attempt_${Date.now()}`,
      webhookId,
      url,
      payload,
      attemptNumber: 1,
      status: 'pending',
      createdAt: new Date(),
    };

    attempts.value.push(attempt);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), retryConfig.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      attempt.responseStatus = response.status;
      attempt.responseBody = await response.text();
      attempt.status = response.ok ? 'success' : 'failed';
      attempt.executedAt = new Date();

      if (!response.ok) {
        await scheduleRetry(attempt);
      }
    } catch (error) {
      attempt.status = 'failed';
      attempt.error = error instanceof Error ? error.message : 'Unknown error';
      attempt.executedAt = new Date();

      await scheduleRetry(attempt);
    }

    return attempt;
  };

  const scheduleRetry = async (failedAttempt: WebhookAttempt) => {
    if (failedAttempt.attemptNumber >= retryConfig.maxRetries) {
      console.log(`Webhook ${failedAttempt.webhookId} failed permanently after ${failedAttempt.attemptNumber} attempts`);
      return;
    }

    const delay = retryConfig.retryDelays[failedAttempt.attemptNumber - 1] ?? 60000;

    setTimeout(async () => {
      await retryWebhook(failedAttempt);
    }, delay);
  };

  const retryWebhook = async (previousAttempt: WebhookAttempt): Promise<WebhookAttempt> => {
    const newAttempt: WebhookAttempt = {
      id: `attempt_${Date.now()}`,
      webhookId: previousAttempt.webhookId,
      url: previousAttempt.url,
      payload: previousAttempt.payload,
      attemptNumber: previousAttempt.attemptNumber + 1,
      status: 'pending',
      createdAt: new Date(),
    };

    attempts.value.push(newAttempt);

    try {
      const response = await fetch(previousAttempt.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previousAttempt.payload),
      });

      newAttempt.responseStatus = response.status;
      newAttempt.status = response.ok ? 'success' : 'failed';
      newAttempt.executedAt = new Date();

      if (!response.ok) {
        await scheduleRetry(newAttempt);
      }
    } catch (error) {
      newAttempt.status = 'failed';
      newAttempt.error = error instanceof Error ? error.message : 'Unknown error';
      newAttempt.executedAt = new Date();

      await scheduleRetry(newAttempt);
    }

    return newAttempt;
  };

  return {
    attempts,
    isProcessing,
    sendWebhook,
    retryWebhook,
  };
}

// Feature 18: Custom Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  type: 'notification' | 'autoresponse' | 'reminder';
  isDefault?: boolean;
}

export function useCustomEmailTemplates() {
  const templates = ref<EmailTemplate[]>([]);

  const defaultTemplates: EmailTemplate[] = [
    {
      id: 'default_notification',
      name: 'Default Notification',
      subject: 'New form submission: {{formTitle}}',
      body: `Hello,

You have received a new submission for "{{formTitle}}".

Submitted at: {{submissionDate}}

View all responses: {{responsesUrl}}

---
This is an automated message from {{appName}}.`,
      variables: ['formTitle', 'submissionDate', 'responsesUrl', 'appName'],
      type: 'notification',
      isDefault: true,
    },
    {
      id: 'default_autoresponse',
      name: 'Default Auto-response',
      subject: 'Thank you for your submission',
      body: `Hi {{respondentName}},

Thank you for submitting "{{formTitle}}". We have received your response.

{{#if submissionSummary}}
Your submission:
{{submissionSummary}}
{{/if}}

{{#if thankYouMessage}}
{{thankYouMessage}}
{{/if}}

Best regards,
{{organizationName}}`,
      variables: ['respondentName', 'formTitle', 'submissionSummary', 'thankYouMessage', 'organizationName'],
      type: 'autoresponse',
      isDefault: true,
    },
  ];

  const createTemplate = (template: Omit<EmailTemplate, 'id'>): EmailTemplate => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}`,
    };
    templates.value.push(newTemplate);
    return newTemplate;
  };

  const renderTemplate = (template: EmailTemplate, variables: Record<string, string>): { subject: string; body: string } => {
    let subject = template.subject;
    let body = template.body;

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    });

    // Handle conditionals (simple implementation)
    body = body.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });

    return { subject, body };
  };

  const getTemplateByType = (type: EmailTemplate['type']): EmailTemplate => {
    return templates.value.find(t => t.type === type) ??
      defaultTemplates.find(t => t.type === type) ??
      defaultTemplates[0];
  };

  return {
    templates,
    defaultTemplates,
    createTemplate,
    renderTemplate,
    getTemplateByType,
  };
}

// Feature 19: Response Notes
export interface ResponseNote {
  id: string;
  responseId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export function useResponseNotes() {
  const notes = ref<ResponseNote[]>([]);

  const addNote = (responseId: string, content: string, createdBy: string): ResponseNote => {
    const note: ResponseNote = {
      id: `note_${Date.now()}`,
      responseId,
      content,
      createdBy,
      createdAt: new Date(),
    };
    notes.value.push(note);
    return note;
  };

  const updateNote = (noteId: string, content: string): boolean => {
    const note = notes.value.find(n => n.id === noteId);
    if (!note) return false;

    note.content = content;
    note.updatedAt = new Date();
    return true;
  };

  const deleteNote = (noteId: string): boolean => {
    const index = notes.value.findIndex(n => n.id === noteId);
    if (index === -1) return false;

    notes.value.splice(index, 1);
    return true;
  };

  const getNotesForResponse = (responseId: string): ResponseNote[] => {
    return notes.value.filter(n => n.responseId === responseId);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForResponse,
  };
}

// Feature 20: Bulk Actions
export type BulkAction = 'delete' | 'export' | 'tag' | 'markRead' | 'assign' | 'archive';

export interface BulkActionConfig {
  action: BulkAction;
  targetIds: string[];
  params?: Record<string, unknown>;
}

export function useBulkActions() {
  const selectedIds = ref<string[]>([]);
  const isProcessing = ref(false);
  const progress = ref(0);

  const selectAll = (ids: string[]) => {
    selectedIds.value = [...ids];
  };

  const deselectAll = () => {
    selectedIds.value = [];
  };

  const toggleSelection = (id: string) => {
    const index = selectedIds.value.indexOf(id);
    if (index > -1) {
      selectedIds.value.splice(index, 1);
    } else {
      selectedIds.value.push(id);
    }
  };

  const executeBulkAction = async (config: BulkActionConfig): Promise<{ success: number; failed: number }> => {
    isProcessing.value = true;
    progress.value = 0;

    const total = config.targetIds.length;
    let success = 0;
    let failed = 0;

    for (let i = 0; i < total; i++) {
      try {
        await executeSingleAction(config.action, config.targetIds[i], config.params);
        success++;
      } catch {
        failed++;
      }

      progress.value = Math.round(((i + 1) / total) * 100);
    }

    isProcessing.value = false;
    return { success, failed };
  };

  const executeSingleAction = async (
    action: BulkAction,
    targetId: string,
    params?: Record<string, unknown>,
  ): Promise<void> => {
    switch (action) {
      case 'delete':
        console.log(`Deleting ${targetId}`);
        break;
      case 'export':
        console.log(`Exporting ${targetId}`);
        break;
      case 'tag':
        console.log(`Tagging ${targetId} with ${params?.tags}`);
        break;
      case 'markRead':
        console.log(`Marking ${targetId} as read`);
        break;
      case 'assign':
        console.log(`Assigning ${targetId} to ${params?.assignee}`);
        break;
      case 'archive':
        console.log(`Archiving ${targetId}`);
        break;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  return {
    selectedIds,
    isProcessing,
    progress,
    selectAll,
    deselectAll,
    toggleSelection,
    executeBulkAction,
  };
}
