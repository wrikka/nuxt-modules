import { computed, ref } from 'vue';
import type { BotDetection, BotDetectionConfig, BotIndicator, BotStatistics, BotType } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useBotDetection = () => {
  const analyticsConfig = useAnalyticsConfig();
  const botConfig = analyticsConfig.botDetection as BotDetectionConfig;

  const detectedBots = ref<BotDetection[]>([]);
  const isBot = ref(false);
  const botConfidence = ref(0);

  const isEnabled = computed(() => botConfig.enabled);

  const detect = (): BotDetection | null => {
    if (!isEnabled.value) return null;

    const indicators = [];
    let totalScore = 0;

    // User Agent check
    const uaIndicator = checkUserAgent();
    if (uaIndicator) {
      indicators.push(uaIndicator);
      totalScore += uaIndicator.weight;
    }

    // Headless browser check
    const headlessIndicator = checkHeadless();
    if (headlessIndicator) {
      indicators.push(headlessIndicator);
      totalScore += headlessIndicator.weight;
    }

    // Behavior pattern check
    const behaviorIndicator = checkBehavior();
    if (behaviorIndicator) {
      indicators.push(behaviorIndicator);
      totalScore += behaviorIndicator.weight;
    }

    // Timing pattern check
    const timingIndicator = checkTiming();
    if (timingIndicator) {
      indicators.push(timingIndicator);
      totalScore += timingIndicator.weight;
    }

    // Mouse movement check
    const mouseIndicator = checkMouseMovement();
    if (mouseIndicator) {
      indicators.push(mouseIndicator);
      totalScore += mouseIndicator.weight;
    }

    const confidence = Math.min(1, totalScore / 5);
    const isBotResult = confidence >= botConfig.flagThreshold;

    isBot.value = isBotResult;
    botConfidence.value = confidence;

    const detection: BotDetection = {
      id: crypto.randomUUID(),
      type: determineBotType(indicators),
      name: 'Unknown Bot',
      confidence,
      indicators,
      timestamp: new Date(),
      ip: '',
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (isBotResult) {
      detectedBots.value.push(detection);
    }

    return detection;
  };

  const checkUserAgent = (): BotIndicator | null => {
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot',
      'crawler',
      'spider',
      'scraper',
      'headless',
      'phantom',
      'selenium',
      'puppeteer',
      'playwright',
      'googlebot',
      'bingbot',
      'slurp',
      'duckduckbot',
    ];

    for (const pattern of botPatterns) {
      if (ua.includes(pattern)) {
        return {
          type: 'user_agent' as const,
          value: pattern,
          weight: pattern.includes('googlebot') || pattern.includes('bingbot') ? 0.3 : 0.8,
        };
      }
    }

    return null;
  };

  const checkHeadless = (): BotIndicator | null => {
    const indicators = [];

    // Check for headless Chrome
    if (navigator.webdriver === true) {
      indicators.push('webdriver');
    }

    // Check for missing plugins
    if (navigator.plugins.length === 0) {
      indicators.push('no_plugins');
    }

    // Check for missing languages
    if (navigator.languages.length === 0) {
      indicators.push('no_languages');
    }

    // Check for Chrome without plugins
    if (/chrome/i.test(navigator.userAgent) && navigator.plugins.length === 0) {
      indicators.push('chrome_no_plugins');
    }

    return indicators.length > 0
      ? {
        type: 'headless_browser' as const,
        value: indicators,
        weight: 0.7 * indicators.length,
      }
      : null;
  };

  const checkBehavior = (): BotIndicator | null => {
    // This would track behavior patterns over time
    // For now, return null as we need more data
    return null;
  };

  const checkTiming = (): BotIndicator | null => {
    // Check for superhuman timing patterns
    // This would be analyzed over multiple interactions
    return null;
  };

  const checkMouseMovement = (): BotIndicator | null => {
    // Check for linear mouse movements (bot-like)
    // This would track mouse movement patterns
    return null;
  };

  const determineBotType = (indicators: BotDetection['indicators']): BotType => {
    const ua = navigator.userAgent.toLowerCase();

    // Good bots
    if (ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('duckduckbot')) {
      return 'good_bot';
    }

    // Check indicators
    const hasScraperIndicators = indicators.some(
      i =>
        i.type === 'headless_browser'
        || (i.type === 'user_agent' && ['selenium', 'puppeteer', 'playwright'].includes(i.value as string)),
    );

    if (hasScraperIndicators) {
      return 'scraper';
    }

    return 'unknown';
  };

  const isGoodBot = (): boolean => {
    const detection = detect();
    return detection?.type === 'good_bot';
  };

  const shouldBlock = (): boolean => {
    const detection = detect();
    if (!detection) return false;

    // Don't block good bots
    if (detection.type === 'good_bot') return false;

    // Block if confidence exceeds threshold
    return detection.confidence >= botConfig.blockThreshold;
  };

  const shouldFlag = (): boolean => {
    const detection = detect();
    if (!detection) return false;

    return detection.confidence >= botConfig.flagThreshold;
  };

  const getStatistics = (period: { start: Date; end: Date; }): BotStatistics => {
    const periodBots = detectedBots.value.filter(
      b => b.timestamp >= period.start && b.timestamp <= period.end,
    );

    const byType: Record<BotType, number> = {
      crawler: 0,
      scraper: 0,
      spambot: 0,
      hackbot: 0,
      good_bot: 0,
      unknown: 0,
    };

    periodBots.forEach(b => {
      byType[b.type]++;
    });

    return {
      period,
      totalRequests: 0,
      botRequests: periodBots.length,
      botPercentage: 0,
      blockedRequests: periodBots.filter(b => b.confidence >= botConfig.blockThreshold).length,
      byType,
      topBots: getTopBots(periodBots),
      trends: [],
    };
  };

  const getTopBots = (bots: BotDetection[]) => {
    const grouped = new Map<string, { name: string; type: BotType; count: number; }>();

    bots.forEach(bot => {
      const key = bot.name || 'Unknown';
      const existing = grouped.get(key);

      if (existing) {
        existing.count++;
      } else {
        grouped.set(key, { name: key, type: bot.type, count: 1 });
      }
    });

    return Array.from(grouped.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(b => ({
        name: b.name,
        type: b.type,
        requests: b.count,
        percentage: (b.count / bots.length) * 100,
        blocked: b.type !== 'good_bot',
      }));
  };

  return {
    detectedBots,
    isBot,
    botConfidence,
    isEnabled,
    detect,
    isGoodBot,
    shouldBlock,
    shouldFlag,
    getStatistics,
  };
};
