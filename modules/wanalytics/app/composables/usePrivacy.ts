import { computed, onMounted, ref } from 'vue';
import type { CCPASettings, ConsentStatus, ConsentType, GDPRSettings, PrivacyConfig } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const usePrivacy = () => {
  const privacyConfig = useAnalyticsConfig().privacy as PrivacyConfig;

  const consent = ref<ConsentStatus>({
    analytics: false,
    marketing: false,
    functional: false,
    necessary: true,
  });
  const gdprSettings = ref<GDPRSettings | null>(null);
  const ccpaSettings = ref<CCPASettings | null>(null);
  const isBannerVisible = ref(false);

  const isEnabled = computed(() => privacyConfig.enabled);
  const isGDPREnabled = computed(() => privacyConfig.gdpr);
  const isCCPAEnabled = computed(() => privacyConfig.ccpa);
  const hasConsent = computed(() => consent.value.analytics || consent.value.marketing);

  const init = () => {
    if (!isEnabled.value) return;

    // Load saved consent
    const savedConsent = localStorage.getItem('analytics_consent');
    if (savedConsent) {
      consent.value = JSON.parse(savedConsent);
    } else if (privacyConfig.consentManagement) {
      // Show banner if no consent saved
      isBannerVisible.value = true;
    }

    // Initialize GDPR settings
    if (privacyConfig.gdpr) {
      initGDPR();
    }

    // Initialize CCPA settings
    if (privacyConfig.ccpa) {
      initCCPA();
    }
  };

  const initGDPR = () => {
    gdprSettings.value = {
      enabled: true,
      requireConsent: true,
      consentTypes: ['necessary', 'analytics', 'marketing', 'functional'],
      defaultConsent: { necessary: true, analytics: false, marketing: false, functional: false },
      dataProcessingLawfulBasis: 'consent',
      dataController: 'Company',
      dataProtectionOfficer: 'DPO',
      cookieLifetime: 365,
      showBanner: true,
      bannerPosition: 'bottom',
      allowChange: true,
      privacyPolicyUrl: '/privacy',
      imprintUrl: undefined,
      dpoContact: undefined,
    };
  };

  const initCCPA = () => {
    ccpaSettings.value = {
      enabled: true,
      doNotSellLink: true,
      doNotSell: false,
      optOutNotice: true,
      requireOptOut: true,
      showNotice: true,
      noticePosition: 'bottom',
      privacyPolicyUrl: '/privacy',
      categories: ['personal_info', 'usage_data', 'sensitive_info'],
      consumerRights: ['access', 'delete', 'opt_out'],
    };
  };

  const grantConsent = (types: ConsentType[]): void => {
    types.forEach(type => {
      consent.value[type] = true;
    });

    saveConsent();
    isBannerVisible.value = false;
  };

  const denyConsent = (types: ConsentType[]): void => {
    types.forEach(type => {
      if (type !== 'necessary') {
        consent.value[type] = false;
      }
    });

    saveConsent();
    isBannerVisible.value = false;
  };

  const grantAllConsent = (): void => {
    consent.value = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    saveConsent();
    isBannerVisible.value = false;
  };

  const denyAllConsent = (): void => {
    consent.value = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    saveConsent();
    isBannerVisible.value = false;
  };

  const updateConsent = (type: ConsentType, value: boolean): void => {
    if (type === 'necessary') return; // Cannot change necessary consent

    consent.value[type] = value;
    saveConsent();
  };

  const saveConsent = (): void => {
    localStorage.setItem('analytics_consent', JSON.stringify(consent.value));
    localStorage.setItem('analytics_consent_date', new Date().toISOString());
  };

  const getConsentDate = (): Date | null => {
    const dateStr = localStorage.getItem('analytics_consent_date');
    return dateStr ? new Date(dateStr) : null;
  };

  const withdrawConsent = (): void => {
    denyAllConsent();

    // Delete tracking cookies
    deleteAllCookies();

    // Clear local storage
    clearTrackingData();
  };

  const deleteAllCookies = (): void => {
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  };

  const clearTrackingData = (): void => {
    // Clear analytics-related storage
    localStorage.removeItem('analytics_session_id');
    localStorage.removeItem('analytics_user_id');

    // Clear IndexedDB databases
    if ('indexedDB' in window) {
      indexedDB.deleteDatabase('analytics_offline');
      indexedDB.deleteDatabase('analytics_events');
    }
  };

  const requestDataDeletion = async (): Promise<boolean> => {
    // Would send deletion request to backend
    return true;
  };

  const requestDataExport = async (): Promise<boolean> => {
    // Would send export request to backend
    return true;
  };

  const setDoNotSell = (value: boolean): void => {
    if (ccpaSettings.value) {
      ccpaSettings.value.doNotSell = value;
      localStorage.setItem('do_not_sell', String(value));
    }
  };

  const getDoNotSell = (): boolean => {
    return localStorage.getItem('do_not_sell') === 'true';
  };

  const checkDoNotTrack = (): boolean => {
    return navigator.doNotTrack === '1';
  };

  const shouldTrack = (): boolean => {
    if (!isEnabled.value) return false;
    if (privacyConfig.gdpr && !consent.value.analytics) return false;
    if (privacyConfig.ccpa && getDoNotSell()) return false;
    if (privacyConfig.autoCompliance && checkDoNotTrack()) return false;
    return true;
  };

  const showBanner = (): void => {
    isBannerVisible.value = true;
  };

  const hideBanner = (): void => {
    isBannerVisible.value = false;
  };

  onMounted(() => {
    init();
  });

  return {
    consent,
    gdprSettings,
    ccpaSettings,
    isBannerVisible,
    isEnabled,
    isGDPREnabled,
    isCCPAEnabled,
    hasConsent,
    init,
    grantConsent,
    denyConsent,
    grantAllConsent,
    denyAllConsent,
    updateConsent,
    getConsentDate,
    withdrawConsent,
    requestDataDeletion,
    requestDataExport,
    setDoNotSell,
    getDoNotSell,
    checkDoNotTrack,
    shouldTrack,
    showBanner,
    hideBanner,
  };
};
