import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { DeviceType, SessionEvent, SessionFilter, SessionRecording, SessionReplayConfig } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useSessionReplay = () => {
  const replayConfig = useAnalyticsConfig().sessionReplay as SessionReplayConfig;

  const isRecording = ref(false);
  const currentSession = ref<SessionRecording | null>(null);
  const events = ref<SessionEvent[]>([]);
  const startTime = ref<Date | null>(null);

  const isEnabled = computed(() => replayConfig.enabled);
  const shouldSample = computed(() => Math.random() <= replayConfig.sampleRate);

  const getDeviceType = (): DeviceType => {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Unknown';
  };

  const getOS = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown';
  };

  const startRecording = () => {
    if (!isEnabled.value || !shouldSample.value || isRecording.value) {
      return;
    }

    startTime.value = new Date();
    events.value = [];
    isRecording.value = true;

    currentSession.value = {
      id: crypto.randomUUID(),
      startTime: startTime.value,
      duration: 0,
      pageViews: 1,
      events: [],
      metadata: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
      },
    };

    setupEventListeners();
  };

  const stopRecording = () => {
    if (!isRecording.value) return;

    removeEventListeners();

    if (currentSession.value && startTime.value) {
      currentSession.value.endTime = new Date();
      currentSession.value.duration = currentSession.value.endTime.getTime() - startTime.value.getTime();
      currentSession.value.events = events.value;
    }

    isRecording.value = false;
  };

  const setupEventListeners = () => {
    document.addEventListener('click', handleClick, true);
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('keypress', handleKeyPress, true);
    window.addEventListener('resize', handleResize, true);
    window.addEventListener('popstate', handleNavigation, true);
  };

  const removeEventListeners = () => {
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('scroll', handleScroll, true);
    document.removeEventListener('input', handleInput, true);
    document.removeEventListener('keypress', handleKeyPress, true);
    window.removeEventListener('resize', handleResize, true);
    window.removeEventListener('popstate', handleNavigation, true);
  };

  const addEvent = (type: SessionEvent['type'], data: Record<string, unknown>) => {
    if (!isRecording.value) return;

    const event: SessionEvent = {
      type,
      timestamp: Date.now(),
      data,
    };

    events.value.push(event);
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (replayConfig.blockSelector && target.matches(replayConfig.blockSelector)) {
      return;
    }

    addEvent('click', {
      x: e.clientX,
      y: e.clientY,
      selector: getSelector(target),
      text: replayConfig.maskAllInputs ? undefined : target.textContent?.slice(0, 50),
    });
  };

  const handleScroll = () => {
    addEvent('scroll', {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      scrollPercent: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
    });
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (replayConfig.maskAllInputs || target.type === 'password') {
      addEvent('input', {
        selector: getSelector(target),
        value: '***',
      });
      return;
    }

    if (replayConfig.ignoreSelector && target.matches(replayConfig.ignoreSelector)) {
      return;
    }

    addEvent('input', {
      selector: getSelector(target),
      value: target.value,
    });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    addEvent('keypress', {
      key: e.key,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
    });
  };

  const handleResize = () => {
    addEvent('resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleNavigation = () => {
    if (currentSession.value) {
      currentSession.value.pageViews++;
    }
    addEvent('navigation', {
      url: window.location.href,
      title: document.title,
    });
  };

  const getSelector = (element: HTMLElement): string => {
    if (element.id) {
      return `#${element.id}`;
    }

    const path: string[] = [];
    let current = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.className && typeof current.className === 'string') {
        const classes = current.className.split(' ').filter(c => c).slice(0, 3);
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`;
        }
      }

      const siblings = current.parentElement?.children;
      if (siblings && siblings.length > 1) {
        const index = Array.from(siblings).indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }

    return path.join(' > ');
  };

  const getSession = (): SessionRecording | null => {
    return currentSession.value;
  };

  const getEvents = (): SessionEvent[] => {
    return events.value;
  };

  const filterSession = (session: SessionRecording, filter: SessionFilter): boolean => {
    if (filter.startDate && session.startTime < filter.startDate) return false;
    if (filter.endDate && session.startTime > filter.endDate) return false;
    if (filter.userId && session.userId !== filter.userId) return false;
    if (filter.url && !session.metadata.url.includes(filter.url)) return false;
    if (filter.deviceType && session.metadata.deviceType !== filter.deviceType) return false;
    if (filter.country && session.metadata.country !== filter.country) return false;
    if (filter.minDuration && session.duration < filter.minDuration) return false;
    if (filter.maxDuration && session.duration > filter.maxDuration) return false;
    return true;
  };

  onMounted(() => {
    startRecording();
  });

  onUnmounted(() => {
    stopRecording();
  });

  return {
    isRecording,
    isEnabled,
    currentSession,
    events,
    startRecording,
    stopRecording,
    getSession,
    getEvents,
    filterSession,
  };
};
