import { computed, ref } from 'vue';
import type { CookielessConfig, FingerprintComponents, VisitorIdentifier } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useCookielessTracking = () => {
  const cookielessConfig = useAnalyticsConfig().cookieless as CookielessConfig | undefined;
  if (!cookielessConfig) {
    return {
      visitorId: ref<string | null>(null),
      sessionId: ref<string | null>(null),
      fingerprint: ref<FingerprintComponents | null>(null),
      isEnabled: computed(() => false),
      isFingerprintingEnabled: computed(() => false),
      generateVisitorId: async () => '',
      generateSessionId: () => '',
      generateFingerprintId: async () => '',
      collectFingerprintComponents: async () => ({}),
      getIdentifier: () => null,
      reset: async () => {},
    };
  }

  const visitorId = ref<string | null>(null);
  const sessionId = ref<string | null>(null);
  const fingerprint = ref<FingerprintComponents | null>(null);

  const isEnabled = computed(() => cookielessConfig.enabled);
  const isFingerprintingEnabled = computed(() => cookielessConfig.fingerprinting.enabled);

  const generateVisitorId = async (): Promise<string> => {
    if (!isEnabled.value) return '';

    // Check if we already have a visitor ID
    const existingId = await getStoredIdentifier('visitor');
    if (existingId) {
      visitorId.value = existingId;
      return existingId;
    }

    let newId: string;

    switch (cookielessConfig.method) {
      case 'fingerprint':
        newId = await generateFingerprintId();
        break;
      case 'local_storage':
        newId = generateUUID();
        storeIdentifier('visitor', newId, 'localStorage');
        break;
      case 'session_storage':
        newId = generateUUID();
        storeIdentifier('visitor', newId, 'sessionStorage');
        break;
      case 'indexeddb':
        newId = generateUUID();
        await storeIdentifierIndexedDB('visitor', newId);
        break;
      case 'combination':
      default:
        newId = await generateCombinationId();
        break;
    }

    visitorId.value = newId;
    return newId;
  };

  const generateSessionId = (): string => {
    if (!isEnabled.value) return '';

    const existingId = sessionStorage.getItem('analytics_session_id');
    if (existingId) {
      sessionId.value = existingId;
      return existingId;
    }

    const newId = generateUUID();
    sessionStorage.setItem('analytics_session_id', newId);
    sessionId.value = newId;
    return newId;
  };

  const generateFingerprintId = async (): Promise<string> => {
    if (!isFingerprintingEnabled.value) return generateUUID();

    const components = await collectFingerprintComponents();
    fingerprint.value = components;

    const fingerprintData = JSON.stringify(components);
    const hash = await hashString(fingerprintData);

    // Apply privacy mode
    const finalHash = applyPrivacyMode(hash);

    return finalHash;
  };

  const collectFingerprintComponents = async (): Promise<FingerprintComponents> => {
    const components: FingerprintComponents = {};
    const requestedComponents = cookielessConfig.fingerprinting.components;

    if (requestedComponents.includes('userAgent')) {
      components.userAgent = navigator.userAgent;
    }

    if (requestedComponents.includes('language')) {
      components.language = navigator.language;
      components.languages = navigator.languages as string[];
    }

    if (requestedComponents.includes('screenResolution')) {
      components.screenResolution = `${window.screen.width}x${window.screen.height}`;
      components.screenColorDepth = window.screen.colorDepth;
      components.pixelRatio = window.devicePixelRatio;
    }

    if (requestedComponents.includes('timezone')) {
      components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      components.timezoneOffset = new Date().getTimezoneOffset();
    }

    if (requestedComponents.includes('platform')) {
      components.platform = navigator.platform;
      components.hardwareConcurrency = navigator.hardwareConcurrency;
      components.deviceMemory = (navigator as Navigator & { deviceMemory?: number; }).deviceMemory;
    }

    // Additional entropy
    components.touchSupport = 'ontouchstart' in window;
    components.cookieEnabled = navigator.cookieEnabled;
    components.doNotTrack = navigator.doNotTrack ?? undefined;
    components.plugins = Array.from(navigator.plugins).map(p => p.name);
    components.viewport = `${window.innerWidth}x${window.innerHeight}`;

    // Canvas fingerprint
    if (cookielessConfig.fingerprinting.privacyMode !== 'strict') {
      components.canvasHash = await getCanvasFingerprint();
    }

    // WebGL fingerprint
    if (cookielessConfig.fingerprinting.privacyMode !== 'strict') {
      const webgl = getWebGLFingerprint();
      if (webgl) {
        components.webglVendor = webgl.vendor;
        components.webglRenderer = webgl.renderer;
      }
    }

    return components;
  };

  const getCanvasFingerprint = async (): Promise<string> => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;

      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Fingerprint', 2, 15);

      const dataUrl = canvas.toDataURL();
      return await hashString(dataUrl);
    } catch {
      return '';
    }
  };

  const getWebGLFingerprint = (): { vendor: string; renderer: string; } | null => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return null;

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      };
    } catch {
      return null;
    }
  };

  const hashString = async (str: string): Promise<string> => {
    const algorithm = cookielessConfig.fingerprinting.hashFunction;

    // Apply rotation if configured
    if (cookielessConfig.fingerprinting.rotateInterval > 0) {
      const rotationKey = Math.floor(Date.now() / cookielessConfig.fingerprinting.rotateInterval);
      str = str + rotationKey;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    if (algorithm === 'murmur') {
      // Simple hash for murmur simulation
      return simpleHash(str);
    }

    const hashBuffer = await crypto.subtle.digest(
      algorithm === 'sha512' ? 'SHA-512' : 'SHA-256',
      data,
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const applyPrivacyMode = (hash: string): string => {
    const mode = cookielessConfig.fingerprinting.privacyMode;

    switch (mode) {
      case 'strict':
        // Add random noise
        return hash + Math.random().toString(36).slice(2, 6);
      case 'balanced':
        // Add slight variation
        return hash.slice(0, -4) + Math.random().toString(36).slice(2, 6);
      case 'open':
      default:
        return hash;
    }
  };

  const generateCombinationId = async (): Promise<string> => {
    const fpId = await generateFingerprintId();
    const uuid = generateUUID();

    // Combine fingerprint with random UUID for uniqueness
    const combined = fpId.slice(0, 16) + uuid.slice(0, 16);

    // Store in multiple places for resilience
    storeIdentifier('visitor', combined, 'localStorage');
    await storeIdentifierIndexedDB('visitor', combined);

    return combined;
  };

  const generateUUID = (): string => {
    return crypto.randomUUID();
  };

  const storeIdentifier = (type: string, value: string, storage: 'localStorage' | 'sessionStorage'): void => {
    try {
      if (storage === 'localStorage') {
        localStorage.setItem(`analytics_${type}_id`, value);
      } else {
        sessionStorage.setItem(`analytics_${type}_id`, value);
      }
    } catch {
      // Storage not available
    }
  };

  const storeIdentifierIndexedDB = async (type: string, value: string): Promise<void> => {
    try {
      const db = await openDatabase();
      const tx = db.transaction('identifiers', 'readwrite');
      const store = tx.objectStore('identifiers');
      store.put({ type, value, timestamp: Date.now() });
    } catch {
      // IndexedDB not available
    }
  };

  const getStoredIdentifier = async (type: string): Promise<string | null> => {
    // Try localStorage first
    const localValue = localStorage.getItem(`analytics_${type}_id`);
    if (localValue) return localValue;

    // Try sessionStorage
    const sessionValue = sessionStorage.getItem(`analytics_${type}_id`);
    if (sessionValue) return sessionValue;

    // Try IndexedDB
    try {
      const db = await openDatabase();
      const tx = db.transaction('identifiers', 'readonly');
      const store = tx.objectStore('identifiers');
      const result = store.get(type);

      return new Promise(resolve => {
        result.onsuccess = () => {
          resolve(result.result?.value ?? null);
        };
        result.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  };

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('analytics_identifiers', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('identifiers')) {
          db.createObjectStore('identifiers', { keyPath: 'type' });
        }
      };
    });
  };

  const getIdentifier = (): VisitorIdentifier | null => {
    if (!visitorId.value || !sessionId.value) return null;

    return {
      id: visitorId.value,
      visitorId: visitorId.value,
      method: cookielessConfig.method as CookielessConfig['method'],
      createdAt: new Date(),
      lastSeen: new Date(),
      visitCount: 1,
      isNew: true,
      confidence: 1,
    };
  };

  const reset = async (): Promise<void> => {
    localStorage.removeItem('analytics_visitor_id');
    sessionStorage.removeItem('analytics_session_id');

    try {
      const db = await openDatabase();
      db.transaction('identifiers', 'readwrite').objectStore('identifiers').clear();
    } catch {
      // Ignore
    }

    visitorId.value = null;
    sessionId.value = null;
    fingerprint.value = null;
  };

  return {
    visitorId,
    sessionId,
    fingerprint,
    isEnabled,
    isFingerprintingEnabled,
    generateVisitorId,
    generateSessionId,
    generateFingerprintId,
    collectFingerprintComponents,
    getIdentifier,
    reset,
  };
};
