import { ref } from 'vue';

// Feature 11: Form Abandonment Recovery
export interface AbandonmentRecovery {
  responseId: string;
  email: string;
  fieldsCompleted: number;
  totalFields: number;
  abandonedAt: Date;
  reminderSent: boolean;
  reminderSentAt?: Date;
}

export function useFormAbandonmentRecovery() {
  const abandonedForms = ref<AbandonmentRecovery[]>([]);
  const isTracking = ref(false);

  const trackAbandonment = (
    responseId: string,
    email: string,
    fieldsCompleted: number,
    totalFields: number,
  ) => {
    const recovery: AbandonmentRecovery = {
      responseId,
      email,
      fieldsCompleted,
      totalFields,
      abandonedAt: new Date(),
      reminderSent: false,
    };

    abandonedForms.value.push(recovery);

    // Schedule reminder email after 1 hour
    setTimeout(() => {
      sendReminder(recovery);
    }, 60 * 60 * 1000);
  };

  const sendReminder = async (recovery: AbandonmentRecovery) => {
    if (recovery.reminderSent) return;

    // Send reminder email
    console.log(`Sending abandonment reminder to ${recovery.email}`);

    recovery.reminderSent = true;
    recovery.reminderSentAt = new Date();
  };

  const markAsRecovered = (responseId: string) => {
    const index = abandonedForms.value.findIndex(a => a.responseId === responseId);
    if (index > -1) {
      abandonedForms.value.splice(index, 1);
    }
  };

  return {
    abandonedForms,
    isTracking,
    trackAbandonment,
    sendReminder,
    markAsRecovered,
  };
}

// Feature 12: A/B Testing
export interface ABTestVariant {
  id: string;
  name: string;
  formId: string;
  trafficPercentage: number;
  views: number;
  submissions: number;
  conversionRate: number;
}

export interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  startDate?: Date;
  endDate?: Date;
  winningVariantId?: string;
  confidenceLevel: number;
}

export function useABTesting() {
  const tests = ref<ABTest[]>([]);
  const activeTest = ref<ABTest | null>(null);

  const createTest = (name: string, variants: Omit<ABTestVariant, 'views' | 'submissions' | 'conversionRate'>[]): ABTest => {
    const test: ABTest = {
      id: `test_${Date.now()}`,
      name,
      status: 'draft',
      variants: variants.map(v => ({
        ...v,
        views: 0,
        submissions: 0,
        conversionRate: 0,
      })),
      confidenceLevel: 95,
    };

    tests.value.push(test);
    return test;
  };

  const startTest = (testId: string) => {
    const test = tests.value.find(t => t.id === testId);
    if (test) {
      test.status = 'running';
      test.startDate = new Date();
      activeTest.value = test;
    }
  };

  const assignVariant = (testId: string): string => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.status !== 'running') return '';

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.trafficPercentage;
      if (random <= cumulative) {
        variant.views++;
        return variant.id;
      }
    }

    return test.variants[test.variants.length - 1]?.id ?? '';
  };

  const recordConversion = (testId: string, variantId: string) => {
    const test = tests.value.find(t => t.id === testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.submissions++;
      variant.conversionRate = (variant.submissions / variant.views) * 100;
    }
  };

  const determineWinner = (testId: string): ABTestVariant | null => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.variants.length < 2) return null;

    // Sort by conversion rate
    const sorted = [...test.variants].sort((a, b) => b.conversionRate - a.conversionRate);
    const winner = sorted[0];

    if (winner.conversionRate > 0) {
      test.winningVariantId = winner.id;
      test.status = 'completed';
      test.endDate = new Date();
      return winner;
    }

    return null;
  };

  return {
    tests,
    activeTest,
    createTest,
    startTest,
    assignVariant,
    recordConversion,
    determineWinner,
  };
}

// Feature 13: Dynamic Thank You Pages
export interface ThankYouPage {
  id: string;
  name: string;
  conditions: Array<{
    fieldId: string;
    operator: string;
    value: unknown;
  }>;
  content: {
    title: string;
    message: string;
    redirectUrl?: string;
    showResults?: boolean;
    showScore?: boolean;
    customHtml?: string;
  };
}

export function useDynamicThankYouPages() {
  const pages = ref<ThankYouPage[]>([]);
  const defaultPage = ref<ThankYouPage>({
    id: 'default',
    name: 'Default',
    conditions: [],
    content: {
      title: 'Thank You!',
      message: 'Your submission has been received.',
    },
  });

  const addPage = (page: Omit<ThankYouPage, 'id'>): ThankYouPage => {
    const newPage: ThankYouPage = {
      ...page,
      id: `ty_${Date.now()}`,
    };
    pages.value.push(newPage);
    return newPage;
  };

  const getThankYouPage = (answers: Record<string, unknown>): ThankYouPage => {
    // Find first matching page based on conditions
    for (const page of pages.value) {
      if (page.conditions.length === 0) continue;

      const allConditionsMet = page.conditions.every(condition => {
        const answer = answers[condition.fieldId];
        return evaluateCondition(answer, condition.operator, condition.value);
      });

      if (allConditionsMet) {
        return page;
      }
    }

    return defaultPage.value;
  };

  const evaluateCondition = (value: unknown, operator: string, compareValue: unknown): boolean => {
    switch (operator) {
      case 'eq': return value === compareValue;
      case 'neq': return value !== compareValue;
      case 'gt': return typeof value === 'number' && typeof compareValue === 'number' && value > compareValue;
      case 'gte': return typeof value === 'number' && typeof compareValue === 'number' && value >= compareValue;
      case 'lt': return typeof value === 'number' && typeof compareValue === 'number' && value < compareValue;
      case 'lte': return typeof value === 'number' && typeof compareValue === 'number' && value <= compareValue;
      case 'contains': return typeof value === 'string' && typeof compareValue === 'string' && value.includes(compareValue);
      default: return false;
    }
  };

  return {
    pages,
    defaultPage,
    addPage,
    getThankYouPage,
  };
}

// Feature 14: Form Folders & Tags
export interface FormFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  formCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTag {
  id: string;
  name: string;
  color: string;
  formCount: number;
}

export function useFormFoldersAndTags() {
  const folders = ref<FormFolder[]>([]);
  const tags = ref<FormTag[]>([]);

  const createFolder = (name: string, description?: string, parentId?: string): FormFolder => {
    const folder: FormFolder = {
      id: `folder_${Date.now()}`,
      name,
      description,
      parentId,
      formCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    folders.value.push(folder);
    return folder;
  };

  const moveFormToFolder = (formId: string, folderId: string | null) => {
    // Update form's folder and adjust counts
    folders.value.forEach(folder => {
      if (folder.id === folderId) {
        folder.formCount++;
      }
    });
  };

  const createTag = (name: string, color: string): FormTag => {
    const tag: FormTag = {
      id: `tag_${Date.now()}`,
      name,
      color,
      formCount: 0,
    };
    tags.value.push(tag);
    return tag;
  };

  const tagForm = (formId: string, tagIds: string[]) => {
    // Associate tags with form
    tags.value.forEach(tag => {
      if (tagIds.includes(tag.id)) {
        tag.formCount++;
      }
    });
  };

  return {
    folders,
    tags,
    createFolder,
    moveFormToFolder,
    createTag,
    tagForm,
  };
}

// Feature 15: Duplicate Detection
export interface DuplicateDetectionConfig {
  fields: string[];
  timeWindow: number; // minutes
  action: 'block' | 'warn' | 'allow';
  message?: string;
}

export function useDuplicateDetection() {
  const recentSubmissions = ref<Array<{
    fingerprint: string;
    timestamp: Date;
  }>[]>([]);

  const generateFingerprint = (answers: Record<string, unknown>, fields: string[]): string => {
    const values = fields.map(field => answers[field]).join('|');
    return btoa(values).slice(0, 32);
  };

  const checkDuplicate = (
    answers: Record<string, unknown>,
    config: DuplicateDetectionConfig,
  ): { isDuplicate: boolean; action: string; message?: string } => {
    const fingerprint = generateFingerprint(answers, config.fields);

    const now = new Date();
    const cutoff = new Date(now.getTime() - config.timeWindow * 60000);

    // Clean old entries
    recentSubmissions.value = recentSubmissions.value.filter(
      s => s.timestamp > cutoff,
    );

    const duplicate = recentSubmissions.value.find(s => s.fingerprint === fingerprint);

    if (duplicate) {
      return {
        isDuplicate: true,
        action: config.action,
        message: config.message ?? 'A similar submission was recently received.',
      };
    }

    // Record this submission
    recentSubmissions.value.push({ fingerprint, timestamp: now });

    return { isDuplicate: false, action: 'allow' };
  };

  return {
    recentSubmissions,
    checkDuplicate,
  };
}
