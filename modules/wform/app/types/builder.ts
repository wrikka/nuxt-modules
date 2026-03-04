// ========== Form Builder Types ==========

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'date_time'
  | 'number'
  | 'email'
  | 'url'
  | 'phone'
  | 'file_upload'
  | 'rating'
  | 'scale'
  | 'matrix'
  | 'ranking'
  | 'signature'
  | 'payment'
  | 'section'
  | 'page_break'
  | 'hidden'
  | 'calculated';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required: boolean;
  placeholder?: string;
  validation?: FieldValidation;
  options?: FieldOption[];
  settings?: FieldSettings;
  conditions?: FieldCondition[];
  order: number;
}

export interface FieldOption {
  id: string;
  label: string;
  value: string;
  image?: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  fileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export interface FieldSettings {
  allowMultiple?: boolean;
  allowOther?: boolean;
  shuffleOptions?: boolean;
  showLabels?: boolean;
  minRating?: number;
  maxRating?: number;
  ratingIcon?: 'star' | 'heart' | 'thumb';
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  matrixRows?: string[];
  matrixColumns?: string[];
  currency?: string;
  amount?: number;
  recurring?: boolean;
}

export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'in'
  | 'empty'
  | 'not_empty';

export interface FieldCondition {
  id: string;
  fieldId: string;
  operator: ConditionOperator;
  value: unknown;
  action: 'show' | 'hide' | 'require' | 'skip' | 'go_to';
  targetFieldId: string;
}

// ========== Form Structure ==========

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  fields: FormField[];
  settings: FormSettings;
  theme: FormTheme;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  userId: string;
  workspaceId?: string;
  folderId?: string;
  version: number;
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  maxSubmissions?: number;
  requireLogin: boolean;
  showProgressBar: boolean;
  redirectUrl?: string;
  customDomain?: string;
  password?: string;
  scheduling?: {
    startDate?: Date;
    endDate?: Date;
    timezone: string;
  };
  notifications: NotificationConfig[];
  webhooks: WebhookConfig[];
  integrations: IntegrationConfig[];
  spamProtection: {
    recaptcha: boolean;
    honeypot: boolean;
    rateLimit: number;
  };
  autoSave: boolean;
  autoSaveInterval: number;
  partialResponses: boolean;
  quizMode?: QuizConfig;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logo?: string;
  coverImage?: string;
  customCss?: string;
}

export interface QuizConfig {
  enabled: boolean;
  showResults: 'immediate' | 'after_submit' | 'never';
  passingScore?: number;
  shuffleQuestions: boolean;
  allowRetake: boolean;
  maxAttempts?: number;
}

export interface NotificationConfig {
  id: string;
  type: 'email' | 'slack' | 'discord';
  trigger: 'on_submit' | 'daily_digest' | 'threshold';
  recipients: string[];
  template?: string;
  enabled: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: ('form.submit' | 'form.start' | 'form.abandon')[];
  headers?: Record<string, string>;
  secret?: string;
  enabled: boolean;
}

export interface IntegrationConfig {
  id: string;
  type: 'zapier' | 'make' | 'google_sheets' | 'airtable' | 'mailchimp' | 'hubspot' | 'salesforce';
  config: Record<string, unknown>;
  enabled: boolean;
}

// ========== Templates ==========

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  fields: FormField[];
  settings: Partial<FormSettings>;
  theme: Partial<FormTheme>;
  isDefault: boolean;
  isCustom: boolean;
  userId?: string;
  workspaceId?: string;
  tags: string[];
}

export type TemplateCategory =
  | 'contact'
  | 'survey'
  | 'event'
  | 'job'
  | 'order'
  | 'registration'
  | 'feedback'
  | 'quiz'
  | 'application'
  | 'booking'
  | 'payment'
  | 'newsletter'
  | 'rsvp'
  | 'custom';

// ========== Responses ==========

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, unknown>;
  metadata: ResponseMetadata;
  startedAt: Date;
  submittedAt?: Date;
  completionTime?: number;
  status: 'in_progress' | 'completed' | 'partial' | 'abandoned';
  score?: number;
  maxScore?: number;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ResponseMetadata {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  language?: string;
  timezone?: string;
  hiddenFields?: Record<string, string>;
}

export interface FormAnalytics {
  totalViews: number;
  totalStarts: number;
  totalSubmissions: number;
  completionRate: number;
  averageCompletionTime: number;
  abandonRate: number;
  dailyStats: DailyStat[];
  fieldStats: FieldStat[];
  deviceStats: DeviceStat[];
  sourceStats: SourceStat[];
}

export interface DailyStat {
  date: string;
  views: number;
  starts: number;
  submissions: number;
}

export interface FieldStat {
  fieldId: string;
  dropOffCount: number;
  dropOffRate: number;
  averageTimeSpent: number;
}

export interface DeviceStat {
  device: string;
  count: number;
  percentage: number;
}

export interface SourceStat {
  source: string;
  count: number;
  percentage: number;
}

// ========== Builder State ==========

export interface BuilderState {
  form: Form;
  selectedFieldId: string | null;
  draggedFieldId: string | null;
  isDragging: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'build' | 'design' | 'share' | 'responses' | 'settings';
  history: FormHistoryItem[];
  historyIndex: number;
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface FormHistoryItem {
  id: string;
  timestamp: Date;
  action: string;
  form: Form;
}

// ========== Collaboration ==========

export interface FormCollaborator {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  lastActiveAt?: Date;
}

export interface FormFolder {
  id: string;
  name: string;
  description?: string;
  userId: string;
  workspaceId?: string;
  formCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormVersion {
  id: string;
  formId: string;
  version: number;
  form: Form;
  changes: string;
  createdBy: string;
  createdAt: Date;
}

// ========== Payment ==========

export interface PaymentConfig {
  enabled: boolean;
  provider: 'stripe' | 'paypal' | 'promptpay' | 'other';
  currency: string;
  items: PaymentItem[];
  allowQuantity: boolean;
  collectShipping: boolean;
  collectBilling: boolean;
  successMessage?: string;
  redirectUrl?: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  quantity?: number;
  image?: string;
}

// ========== Export ==========

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange?: { start: Date; end: Date };
  fields?: string[];
  includeMetadata: boolean;
  includeHiddenFields: boolean;
}

