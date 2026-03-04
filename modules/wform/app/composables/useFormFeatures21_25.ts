import { ref } from 'vue';
import type { Form } from '../types';

// Feature 21: Form Scheduling
export interface FormSchedule {
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
  timezone: string;
  messageBeforeStart?: string;
  messageAfterEnd?: string;
  redirectUrlBeforeStart?: string;
  redirectUrlAfterEnd?: string;
}

export function useFormScheduling() {
  const currentStatus = ref<'open' | 'scheduled' | 'closed'>('open');
  const timeRemaining = ref<number>(0);

  const checkSchedule = (schedule: FormSchedule): {
    isOpen: boolean;
    message?: string;
    redirectUrl?: string;
    status: 'open' | 'not_started' | 'ended';
  } => {
    if (!schedule.enabled) {
      return { isOpen: true, status: 'open' };
    }

    const now = new Date();

    // Check if form hasn't started yet
    if (schedule.startDate && now < schedule.startDate) {
      timeRemaining.value = schedule.startDate.getTime() - now.getTime();
      return {
        isOpen: false,
        message: schedule.messageBeforeStart ?? 'This form is not yet open.',
        redirectUrl: schedule.redirectUrlBeforeStart,
        status: 'not_started',
      };
    }

    // Check if form has ended
    if (schedule.endDate && now > schedule.endDate) {
      return {
        isOpen: false,
        message: schedule.messageAfterEnd ?? 'This form is now closed.',
        redirectUrl: schedule.redirectUrlAfterEnd,
        status: 'ended',
      };
    }

    // Form is open
    if (schedule.endDate) {
      timeRemaining.value = schedule.endDate.getTime() - now.getTime();
    }

    currentStatus.value = 'open';
    return { isOpen: true, status: 'open' };
  };

  const formatTimeRemaining = (ms: number): string => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return {
    currentStatus,
    timeRemaining,
    checkSchedule,
    formatTimeRemaining,
  };
}

// Feature 22: Entry Edit Link
export interface EditToken {
  responseId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
}

export function useEntryEditLink() {
  const editTokens = ref<EditToken[]>([]);

  const generateEditToken = (responseId: string, expiresInHours = 24): EditToken => {
    const token: EditToken = {
      responseId,
      token: `edit_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      used: false,
    };

    editTokens.value.push(token);
    return token;
  };

  const validateEditToken = (token: string): { valid: boolean; responseId?: string; reason?: string } => {
    const editToken = editTokens.value.find(t => t.token === token);

    if (!editToken) {
      return { valid: false, reason: 'Invalid token' };
    }

    if (editToken.used) {
      return { valid: false, reason: 'Token has already been used' };
    }

    if (new Date() > editToken.expiresAt) {
      return { valid: false, reason: 'Token has expired' };
    }

    return { valid: true, responseId: editToken.responseId };
  };

  const markTokenUsed = (token: string): boolean => {
    const editToken = editTokens.value.find(t => t.token === token);
    if (!editToken) return false;

    editToken.used = true;
    editToken.usedAt = new Date();
    return true;
  };

  const sendEditLinkEmail = async (email: string, editUrl: string, expiresInHours: number): Promise<void> => {
    console.log(`Sending edit link to ${email}. Link: ${editUrl} (expires in ${expiresInHours} hours)`);
    // In production, this would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return {
    editTokens,
    generateEditToken,
    validateEditToken,
    markTokenUsed,
    sendEditLinkEmail,
  };
}

// Feature 23: Confirmation Number
export function useConfirmationNumber() {
  const generateConfirmationNumber = (formId: string, timestamp: Date): string => {
    const date = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const formCode = formId.slice(-4).toUpperCase();

    return `${formCode}-${date}-${random}`;
  };

  const generateShortCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (I, L, O, 0, 1)
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.match(/.{4}/g)?.join('-') ?? code;
  };

  const validateConfirmationNumber = (number: string, formId: string): boolean => {
    // Basic validation - in production, check against database
    const formCode = formId.slice(-4).toUpperCase();
    return number.startsWith(formCode);
  };

  return {
    generateConfirmationNumber,
    generateShortCode,
    validateConfirmationNumber,
  };
}

// Feature 24: Form Expiration
export interface FormExpiration {
  enabled: boolean;
  expiresAt?: Date;
  action: 'close' | 'archive' | 'delete';
  warningDays: number;
  notifyBeforeExpiration: boolean;
  notifyRecipients: string[];
}

export function useFormExpiration() {
  const isExpiring = ref(false);
  const daysUntilExpiration = ref<number>(0);

  const checkExpiration = (expiration: FormExpiration): {
    expired: boolean;
    expiringSoon: boolean;
    daysRemaining: number;
  } => {
    if (!expiration.enabled || !expiration.expiresAt) {
      return { expired: false, expiringSoon: false, daysRemaining: Infinity };
    }

    const now = new Date();
    const diffTime = expiration.expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    daysUntilExpiration.value = diffDays;

    return {
      expired: diffDays <= 0,
      expiringSoon: diffDays > 0 && diffDays <= expiration.warningDays,
      daysRemaining: diffDays,
    };
  };

  const scheduleExpirationAction = (
    formId: string,
    expiration: FormExpiration,
    callback: (action: FormExpiration['action']) => void,
  ): void => {
    if (!expiration.enabled || !expiration.expiresAt) return;

    const now = new Date();
    const delay = expiration.expiresAt.getTime() - now.getTime();

    if (delay <= 0) {
      // Already expired
      callback(expiration.action);
      return;
    }

    // Schedule expiration
    setTimeout(() => {
      callback(expiration.action);
    }, delay);
  };

  const sendExpirationWarning = async (
    formId: string,
    formTitle: string,
    daysRemaining: number,
    recipients: string[],
  ): Promise<void> => {
    console.log(`Sending expiration warning for "${formTitle}" (${daysRemaining} days remaining) to ${recipients.join(', ')}`);
    // In production, send email notification
  };

  return {
    isExpiring,
    daysUntilExpiration,
    checkExpiration,
    scheduleExpirationAction,
    sendExpirationWarning,
  };
}

// Feature 25: Clone Form Structure
export function useCloneForm() {
  const cloneForm = (sourceForm: Form, options?: {
    includeResponses?: boolean;
    newTitle?: string;
  }): Form => {
    const now = new Date();
    const clonedId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const clonedForm: Form = {
      ...sourceForm,
      id: clonedId,
      title: options?.newTitle ?? `${sourceForm.title} (Copy)`,
      status: 'draft',
      fields: sourceForm.fields.map(field => ({
        ...field,
        id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      })),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    return clonedForm;
  };

  const cloneFormTemplate = (sourceForm: Form): Partial<Form> => {
    return {
      title: sourceForm.title,
      description: sourceForm.description,
      fields: sourceForm.fields,
      settings: sourceForm.settings,
      theme: sourceForm.theme,
    };
  };

  const duplicateField = (field: Form['fields'][number]): Form['fields'][number] => {
    return {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      label: `${field.label} (Copy)`,
    };
  };

  return {
    cloneForm,
    cloneFormTemplate,
    duplicateField,
  };
}
