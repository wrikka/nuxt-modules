import { computed, ref } from 'vue';
import type { BrowserData, DeviceAnalytics, DeviceConfig, DeviceInfo, OSData, ScreenData } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useDeviceAnalytics = () => {
  const deviceConfig = useAnalyticsConfig().device as DeviceConfig;

  const currentDevice = ref<DeviceInfo | null>(null);
  const browserData = ref<BrowserData[]>([]);
  const osData = ref<OSData[]>([]);
  const screenData = ref<ScreenData[]>([]);
  const isLoading = ref(false);

  const isEnabled = computed(() => deviceConfig.enabled);

  const detectDevice = (): DeviceInfo => {
    const device: DeviceInfo = {
      type: getDeviceType(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenDensity: window.devicePixelRatio,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      touchSupport: 'ontouchstart' in window,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number; }).deviceMemory,
      browser: getBrowser(),
      browserVersion: getBrowserVersion(),
      os: getOS(),
      osVersion: getOSVersion(),
      engine: getEngine(),
      engineVersion: getEngineVersion(),
      screen: deviceConfig.trackScreen
        ? {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio,
          orientation: getOrientation(),
        }
        : undefined,
      viewport: deviceConfig.trackViewport
        ? {
          width: window.innerWidth,
          height: window.innerHeight,
        }
        : undefined,
      language: deviceConfig.trackLanguage ? navigator.language : undefined,
      languages: deviceConfig.trackLanguage ? navigator.languages as string[] : undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      plugins: deviceConfig.trackPlugins ? getPlugins() : undefined,
      connection: getConnection(),
    };

    currentDevice.value = device;
    return device;
  };

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' | 'smarttv' | 'console' | 'wearable' => {
    const ua = navigator.userAgent;

    if (/smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast/i.test(ua)) return 'smarttv';
    if (/xbox|playstation|nintendo/i.test(ua)) return 'console';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone|ipod|blackberry|opera mini/i.test(ua)) return 'mobile';
    if (/watch|wearable/i.test(ua)) return 'wearable';
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;

    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
    return 'Unknown';
  };

  const getBrowserVersion = (): string => {
    const ua = navigator.userAgent;
    const browser = getBrowser();

    const patterns: Record<string, RegExp> = {
      'Edge': /Edg\/(\d+)/,
      'Opera': /OPR\/(\d+)/,
      'Chrome': /Chrome\/(\d+)/,
      'Firefox': /Firefox\/(\d+)/,
      'Safari': /Version\/(\d+)/,
      'Internet Explorer': /(?:MSIE |rv:)(\d+)/,
    };

    const pattern = patterns[browser];
    if (pattern) {
      const match = ua.match(pattern);
      return match ? match[1] : 'Unknown';
    }

    return 'Unknown';
  };

  const getOS = (): string => {
    const ua = navigator.userAgent;

    if (ua.includes('Windows NT 10')) return 'Windows 10';
    if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (ua.includes('Windows NT 6.2')) return 'Windows 8';
    if (ua.includes('Windows NT 6.1')) return 'Windows 7';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS X')) return 'macOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('CrOS')) return 'Chrome OS';
    return 'Unknown';
  };

  const getOSVersion = (): string => {
    const ua = navigator.userAgent;
    const os = getOS();

    if (os === 'macOS') {
      const match = ua.match(/Mac OS X (\d+[._]\d+)/);
      return match ? match[1].replace('_', '.') : 'Unknown';
    }
    if (os === 'Android') {
      const match = ua.match(/Android (\d+(\.\d+)?)/);
      return match ? match[1] : 'Unknown';
    }
    if (os === 'iOS') {
      const match = ua.match(/OS (\d+_\d+)/);
      return match ? match[1].replace('_', '.') : 'Unknown';
    }
    if (os.startsWith('Windows')) {
      return os.replace('Windows ', '');
    }

    return 'Unknown';
  };

  const getEngine = (): string => {
    const ua = navigator.userAgent;

    if (ua.includes('Gecko/') && ua.includes('Firefox')) return 'Gecko';
    if (ua.includes('AppleWebKit/')) return 'WebKit';
    if (ua.includes('Trident/')) return 'Trident';
    if (ua.includes('Presto/')) return 'Presto';
    return 'Unknown';
  };

  const getEngineVersion = (): string => {
    const ua = navigator.userAgent;
    const engine = getEngine();

    const patterns: Record<string, RegExp> = {
      'Gecko': /Gecko\/(\d+)/,
      'WebKit': /AppleWebKit\/(\d+\.\d+)/,
      'Trident': /Trident\/(\d+\.\d+)/,
      'Presto': /Presto\/(\d+\.\d+)/,
    };

    const pattern = patterns[engine];
    if (pattern) {
      const match = ua.match(pattern);
      return match ? match[1] : 'Unknown';
    }

    return 'Unknown';
  };

  const getOrientation = (): string => {
    if (screen.orientation) {
      return screen.orientation.type.replace('-primary', '');
    }
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  };

  const getPlugins = (): string[] => {
    return Array.from(navigator.plugins).map(p => p.name);
  };

  const getConnection = (): DeviceInfo['connection'] => {
    const conn =
      (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number; }; })
        .connection;

    if (conn) {
      return {
        type: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
      };
    }

    return undefined;
  };

  const getBrowserAnalytics = async (_period: { start: Date; end: Date; }): Promise<BrowserData[]> => {
    if (!isEnabled.value) return [];

    // Mock data
    const browsers: BrowserData[] = [
      {
        browser: 'Chrome',
        version: '120',
        visitors: 4500,
        sessions: 5500,
        pageViews: 22000,
        bounceRate: 34,
        avgSessionDuration: 185,
      },
      {
        browser: 'Safari',
        version: '17',
        visitors: 1500,
        sessions: 1800,
        pageViews: 7200,
        bounceRate: 38,
        avgSessionDuration: 165,
      },
      {
        browser: 'Firefox',
        version: '121',
        visitors: 800,
        sessions: 960,
        pageViews: 3840,
        bounceRate: 36,
        avgSessionDuration: 175,
      },
      {
        browser: 'Edge',
        version: '120',
        visitors: 600,
        sessions: 720,
        pageViews: 2880,
        bounceRate: 35,
        avgSessionDuration: 180,
      },
    ];

    browserData.value = browsers;
    return browsers;
  };

  const getOSAnalytics = async (_period: { start: Date; end: Date; }): Promise<OSData[]> => {
    if (!isEnabled.value) return [];

    // Mock data
    const os: OSData[] = [
      {
        os: 'Windows',
        version: '10',
        visitors: 3000,
        sessions: 3600,
        pageViews: 14400,
        bounceRate: 36,
        avgSessionDuration: 170,
      },
      {
        os: 'macOS',
        version: '14',
        visitors: 2000,
        sessions: 2400,
        pageViews: 9600,
        bounceRate: 33,
        avgSessionDuration: 190,
      },
      {
        os: 'iOS',
        version: '17',
        visitors: 1200,
        sessions: 1440,
        pageViews: 5760,
        bounceRate: 40,
        avgSessionDuration: 145,
      },
      {
        os: 'Android',
        version: '14',
        visitors: 800,
        sessions: 960,
        pageViews: 3840,
        bounceRate: 42,
        avgSessionDuration: 135,
      },
      { os: 'Linux', visitors: 400, sessions: 480, pageViews: 1920, bounceRate: 30, avgSessionDuration: 210 },
    ];

    osData.value = os;
    return os;
  };

  const getScreenAnalytics = async (_period: { start: Date; end: Date; }): Promise<ScreenData[]> => {
    if (!isEnabled.value || !deviceConfig.trackScreen) return [];

    // Mock data
    const screens: ScreenData[] = [
      {
        resolution: '1920x1080',
        visitors: 2500,
        sessions: 3000,
        pageViews: 12000,
        bounceRate: 32,
        avgSessionDuration: 195,
      },
      {
        resolution: '1366x768',
        visitors: 1200,
        sessions: 1440,
        pageViews: 5760,
        bounceRate: 38,
        avgSessionDuration: 160,
      },
      {
        resolution: '2560x1440',
        visitors: 800,
        sessions: 960,
        pageViews: 3840,
        bounceRate: 30,
        avgSessionDuration: 205,
      },
      { resolution: '390x844', visitors: 600, sessions: 720, pageViews: 2880, bounceRate: 45, avgSessionDuration: 125 },
    ];

    screenData.value = screens;
    return screens;
  };

  const getDeviceSummary = async (period: { start: Date; end: Date; }): Promise<DeviceAnalytics> => {
    const browsers = await getBrowserAnalytics(period);
    const os = await getOSAnalytics(period);
    const screens = await getScreenAnalytics(period);

    return {
      period,
      devices: [
        {
          type: 'desktop',
          visitors: 5500,
          sessions: 6600,
          pageViews: 26400,
          bounceRate: 32,
          avgSessionDuration: 190,
          conversionRate: 3.5,
          percentage: 68.75,
        },
        {
          type: 'mobile',
          visitors: 2000,
          sessions: 2400,
          pageViews: 9600,
          bounceRate: 42,
          avgSessionDuration: 140,
          conversionRate: 2.1,
          percentage: 25,
        },
        {
          type: 'tablet',
          visitors: 500,
          sessions: 600,
          pageViews: 2400,
          bounceRate: 38,
          avgSessionDuration: 160,
          conversionRate: 2.8,
          percentage: 6.25,
        },
      ],
      browsers,
      os,
      screens,
      summary: {
        topDevice: 'desktop',
        topBrowser: 'Chrome',
        topOS: 'Windows',
        topResolution: '1920x1080',
        mobilePercentage: 25,
        desktopPercentage: 68.75,
        tabletPercentage: 6.25,
      },
    };
  };

  return {
    currentDevice,
    browserData,
    osData,
    screenData,
    isLoading,
    isEnabled,
    detectDevice,
    getBrowserAnalytics,
    getOSAnalytics,
    getScreenAnalytics,
    getDeviceSummary,
  };
};
