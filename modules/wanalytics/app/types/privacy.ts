export interface PrivacySettings {
  gdpr: GDPRSettings;
  ccpa: CCPASettings;
  consentManagement: ConsentSettings;
  dataRetention: RetentionSettings;
  anonymization: AnonymizationSettings;
}

export interface GDPRSettings {
  enabled: boolean;
  requireConsent: boolean;
  defaultConsent?: ConsentStatus;
  consentTypes: ConsentType[];
  dataProcessingLawfulBasis?: string;
  dataController?: string;
  dataProtectionOfficer?: string;
  cookieLifetime?: number;
  showBanner?: boolean;
  bannerPosition?: 'top' | 'bottom';
  allowChange?: boolean;
  privacyPolicyUrl?: string;
  imprintUrl?: string;
  dpoContact?: string;
}

export type ConsentType =
  | 'necessary'
  | 'analytics'
  | 'marketing'
  | 'functional'
  | 'personalization';

export type ConsentStatus = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  personalization?: boolean;
};

export interface CCPASettings {
  enabled: boolean;
  doNotSellLink?: boolean;
  doNotSell: boolean;
  optOutNotice?: boolean;
  requireOptOut?: boolean;
  showNotice?: boolean;
  noticePosition?: 'top' | 'bottom' | 'modal';
  privacyPolicyUrl?: string;
  categories?: string[];
  consumerRights?: ConsumerRight[];
}

export type ConsumerRight =
  | 'access'
  | 'delete'
  | 'opt_out'
  | 'non_discrimination'
  | 'know';

export interface ConsentSettings {
  enabled: boolean;
  provider: 'custom' | 'oneTrust' | 'cookiebot' | 'quantcast';
  showBanner: boolean;
  bannerPosition: 'top' | 'bottom';
  respectDoNotTrack: boolean;
  consentExpiry: number;
}

export interface RetentionSettings {
  enabled: boolean;
  defaultPeriod: number;
  periods: Record<string, number>;
  autoDelete: boolean;
  anonymizeAfter: number;
}

export interface AnonymizationSettings {
  enabled: boolean;
  ipAnonymization: boolean;
  userAgentAnonymization: boolean;
  urlParameterStripping: string[];
  textMasking: boolean;
}

export interface DataSubjectRequest {
  id: string;
  type: DataSubjectRequestType;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  completedAt?: Date;
  requesterEmail: string;
  verificationMethod: string;
  response?: DataSubjectResponse;
}

export type DataSubjectRequestType =
  | 'access'
  | 'deletion'
  | 'portability'
  | 'correction'
  | 'restriction'
  | 'objection';

export interface DataSubjectResponse {
  data?: Record<string, unknown>;
  message?: string;
  files?: string[];
}

export interface PrivacyConfig {
  enabled: boolean;
  gdpr: boolean;
  ccpa: boolean;
  consentManagement: boolean;
  autoCompliance: boolean;
}
