import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { CrossDomainConfig, CrossDomainEvent, CrossDomainMessage } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useCrossDomainTracking = () => {
  const crossDomainConfig = useAnalyticsConfig().crossDomain as CrossDomainConfig;

  const isLinked = ref(false);
  const linkedDomains = ref<string[]>([]);
  void ref<Map<string, CrossDomainMessage>>(new Map());

  const isEnabled = computed(() => crossDomainConfig.enabled);
  const primaryDomain = computed(() => crossDomainConfig.domains.find(d => d.primary)?.domain);

  const init = () => {
    if (!isEnabled.value) return;

    // Check for cross-domain link in URL
    checkURLLink();

    // Setup message listener for post_message method
    if (crossDomainConfig.linkingMethod === 'post_message') {
      setupMessageListener();
    }

    // Setup shared storage listener
    if (crossDomainConfig.linkingMethod === 'shared_storage') {
      setupSharedStorageListener();
    }
  };

  const checkURLLink = () => {
    const url = new URL(window.location.href);
    const linkToken = url.searchParams.get('_link');
    const sourceDomain = url.searchParams.get('_domain');

    if (linkToken && sourceDomain) {
      // Validate source domain
      const validDomain = crossDomainConfig.domains.find(d => d.domain === sourceDomain);
      if (validDomain) {
        // Restore session from link
        void restoreFromLink(linkToken, sourceDomain);

        // Clean URL
        url.searchParams.delete('_link');
        url.searchParams.delete('_domain');
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const restoreFromLink = async (token: string, sourceDomain: string): Promise<void> => {
    try {
      // Decode link data
      const linkData = decodeLinkData(token);

      if (linkData.sessionId) {
        sessionStorage.setItem('analytics_session_id', linkData.sessionId);
      }

      if (linkData.visitorId) {
        localStorage.setItem('analytics_visitor_id', linkData.visitorId);
      }

      isLinked.value = true;
      linkedDomains.value.push(sourceDomain);

      // Notify other domains
      notifyLinked(sourceDomain);
    } catch {
      // Invalid link
    }
  };

  const decodeLinkData = (token: string): CrossDomainMessage => {
    try {
      const decoded = atob(token);
      return JSON.parse(decoded);
    } catch {
      return { type: '', source: '', target: '', timestamp: new Date() };
    }
  };

  const generateLinkToken = (): string => {
    const message: CrossDomainMessage = {
      type: 'link',
      source: window.location.hostname,
      target: '',
      sessionId: sessionStorage.getItem('analytics_session_id') ?? undefined,
      visitorId: localStorage.getItem('analytics_visitor_id') ?? undefined,
      timestamp: new Date(),
    };

    return btoa(JSON.stringify(message));
  };

  const generateCrossDomainUrl = (targetDomain: string, path: string = '/'): string | null => {
    if (!isEnabled.value) return null;

    const domainConfig = crossDomainConfig.domains.find(d => d.domain === targetDomain);
    if (!domainConfig) return null;

    const url = new URL(path, `https://${targetDomain}`);

    if (crossDomainConfig.linkingMethod === 'url_parameter') {
      const token = generateLinkToken();
      url.searchParams.set('_link', token);
      url.searchParams.set('_domain', window.location.hostname);
    }

    return url.toString();
  };

  const linkToDomain = async (targetDomain: string): Promise<boolean> => {
    if (!isEnabled.value) return false;

    const domainConfig = crossDomainConfig.domains.find(d => d.domain === targetDomain);
    if (!domainConfig) return false;

    switch (crossDomainConfig.linkingMethod) {
      case 'url_parameter':
        return linkViaUrlParameter(targetDomain);
      case 'post_message':
        return linkViaPostMessage(targetDomain);
      case 'shared_storage':
        return linkViaSharedStorage(targetDomain);
      case 'server_side':
        return linkViaServerSide(targetDomain);
      default:
        return false;
    }
  };

  const linkViaUrlParameter = (targetDomain: string): boolean => {
    const url = generateCrossDomainUrl(targetDomain);
    if (!url) return false;

    // Open in new tab or redirect
    window.open(url, '_blank');
    return true;
  };

  const linkViaPostMessage = (targetDomain: string): Promise<boolean> => {
    return new Promise(resolve => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `https://${targetDomain}/_analytics/link`;

      iframe.onload = () => {
        const message: CrossDomainMessage = {
          type: 'link',
          source: window.location.hostname,
          target: targetDomain,
          sessionId: sessionStorage.getItem('analytics_session_id') ?? undefined,
          visitorId: localStorage.getItem('analytics_visitor_id') ?? undefined,
          timestamp: new Date(),
        };

        iframe.contentWindow?.postMessage(
          { type: 'analytics_link', data: message },
          `https://${targetDomain}`,
        );

        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve(true);
        }, crossDomainConfig.timeout);
      };

      iframe.onerror = () => {
        document.body.removeChild(iframe);
        resolve(false);
      };

      document.body.appendChild(iframe);
    });
  };

  const linkViaSharedStorage = async (_targetDomain: string): Promise<boolean> => {
    // Use Shared Storage API if available
    if (!('sharedStorage' in window)) {
      return false;
    }

    try {
      const sharedStorage = (window as unknown as {
        sharedStorage: {
          set: (key: string, value: string) => Promise<void>;
          get: (key: string) => Promise<string | undefined>;
        };
      }).sharedStorage;

      await sharedStorage.set(
        'analytics_session',
        JSON.stringify({
          sessionId: sessionStorage.getItem('analytics_session_id'),
          visitorId: localStorage.getItem('analytics_visitor_id'),
          timestamp: Date.now(),
        }),
      );

      return true;
    } catch {
      return false;
    }
  };

  const linkViaServerSide = async (_targetDomain: string): Promise<boolean> => {
    // Would call backend to create cross-domain link
    return true;
  };

  const setupMessageListener = () => {
    window.addEventListener('message', handleMessage);
  };

  const handleMessage = (event: MessageEvent) => {
    // Validate origin
    const validDomain = crossDomainConfig.domains.find(d => event.origin.includes(d.domain));
    if (!validDomain) return;

    const message = event.data;

    if (message.type === 'analytics_link') {
      handleLinkMessage(message.data, event.origin);
    } else if (message.type === 'analytics_linked') {
      handleLinkedMessage(message.data);
    }
  };

  const handleLinkMessage = (data: CrossDomainMessage, origin: string) => {
    if (data.sessionId) {
      sessionStorage.setItem('analytics_session_id', data.sessionId);
    }

    if (data.visitorId) {
      localStorage.setItem('analytics_visitor_id', data.visitorId);
    }

    isLinked.value = true;
    linkedDomains.value.push(origin);

    // Acknowledge link
    window.postMessage({
      type: 'analytics_linked',
      data: { domain: window.location.hostname },
    }, '*');
  };

  const handleLinkedMessage = (data: { domain: string; }) => {
    if (!linkedDomains.value.includes(data.domain)) {
      linkedDomains.value.push(data.domain);
    }
  };

  const setupSharedStorageListener = () => {
    // Poll for shared storage updates
    setInterval(async () => {
      if (!('sharedStorage' in window)) return;

      try {
        const sharedStorage =
          (window as unknown as { sharedStorage: { get: (key: string) => Promise<string | undefined>; }; })
            .sharedStorage;
        const data = await sharedStorage.get('analytics_session');

        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.sessionId && !sessionStorage.getItem('analytics_session_id')) {
            sessionStorage.setItem('analytics_session_id', parsed.sessionId);
          }
        }
      } catch {
        // Ignore
      }
    }, 5000);
  };

  const notifyLinked = (domain: string) => {
    if (crossDomainConfig.linkingMethod === 'post_message') {
      const domainConfig = crossDomainConfig.domains.find(d => d.domain === domain);
      if (domainConfig) {
        // Would send postMessage to notify
      }
    }
  };

  const getLinkedDomains = (): string[] => {
    return linkedDomains.value;
  };

  const isDomainLinked = (domain: string): boolean => {
    return linkedDomains.value.includes(domain);
  };

  const unlinkDomain = (domain: string): boolean => {
    const index = linkedDomains.value.indexOf(domain);
    if (index === -1) return false;

    linkedDomains.value.splice(index, 1);
    return true;
  };

  const trackCrossDomainEvent = (_event: CrossDomainEvent): void => {
    // Would track cross-domain navigation events
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    window.removeEventListener('message', handleMessage);
  });

  return {
    isLinked,
    linkedDomains,
    isEnabled,
    primaryDomain,
    generateCrossDomainUrl,
    linkToDomain,
    getLinkedDomains,
    isDomainLinked,
    unlinkDomain,
    trackCrossDomainEvent,
  };
};
