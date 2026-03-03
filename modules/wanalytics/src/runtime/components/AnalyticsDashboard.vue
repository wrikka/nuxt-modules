<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWebVitals } from '../composables/useWebVitals';
import { useErrorTracking } from '../composables/useErrorTracking';

const props = defineProps<{
  refreshInterval?: number;
  showWebVitals?: boolean;
  showErrors?: boolean;
  showGeo?: boolean;
  showDevices?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', data: DashboardData): void;
}>();

const refreshInterval = computed(() => props.refreshInterval ?? 5000);
const showWebVitals = computed(() => props.showWebVitals ?? true);
const showErrors = computed(() => props.showErrors ?? true);

const { getAllMetrics, isEnabled: webVitalsEnabled } = useWebVitals();
const { errors, isEnabled: errorTrackingEnabled } = useErrorTracking();

const isLive = ref(true);
const lastUpdate = ref(new Date());
const visitorCount = ref(0);
const pageViewCount = ref(0);
const errorCount = ref(0);
const topPages = ref<TopPage[]>([]);
const topReferrers = ref<TopReferrer[]>([]);
const activeUsers = ref(0);

interface TopPage {
  url: string;
  views: number;
  change: number;
}

interface TopReferrer {
  source: string;
  visitors: number;
  percentage: number;
}

interface DashboardData {
  visitors: number;
  pageViews: number;
  errors: number;
  activeUsers: number;
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  webVitals: Record<string, number>;
  lastUpdate: Date;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

const updateData = () => {
  // Simulate real-time data updates
  visitorCount.value += Math.floor(Math.random() * 5);
  pageViewCount.value += Math.floor(Math.random() * 10);
  
  if (errorTrackingEnabled.value) {
    errorCount.value = errors.value.length;
  }

  // Update top pages
  topPages.value = [
    { url: '/home', views: Math.floor(Math.random() * 1000) + 500, change: Math.random() * 20 - 10 },
    { url: '/products', views: Math.floor(Math.random() * 800) + 300, change: Math.random() * 20 - 10 },
    { url: '/about', views: Math.floor(Math.random() * 500) + 200, change: Math.random() * 20 - 10 },
    { url: '/contact', views: Math.floor(Math.random() * 300) + 100, change: Math.random() * 20 - 10 },
    { url: '/blog', views: Math.floor(Math.random() * 200) + 50, change: Math.random() * 20 - 10 },
  ];

  // Update top referrers
  topReferrers.value = [
    { source: 'Direct', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 35 },
    { source: 'Google', visitors: Math.floor(Math.random() * 800) + 300, percentage: 28 },
    { source: 'Twitter', visitors: Math.floor(Math.random() * 300) + 100, percentage: 15 },
    { source: 'Facebook', visitors: Math.floor(Math.random() * 200) + 50, percentage: 12 },
    { source: 'LinkedIn', visitors: Math.floor(Math.random() * 100) + 30, percentage: 10 },
  ];

  activeUsers.value = Math.floor(Math.random() * 50) + 10;
  lastUpdate.value = new Date();

  const dashboardData: DashboardData = {
    visitors: visitorCount.value,
    pageViews: pageViewCount.value,
    errors: errorCount.value,
    activeUsers: activeUsers.value,
    topPages: topPages.value,
    topReferrers: topReferrers.value,
    webVitals: {},
    lastUpdate: lastUpdate.value,
  };

  if (webVitalsEnabled.value && showWebVitals.value) {
    const metrics = getAllMetrics();
    metrics.forEach(m => {
      dashboardData.webVitals[m.name] = m.value;
    });
  }

  emit('update', dashboardData);
};

const startLiveUpdates = () => {
  isLive.value = true;
  intervalId = setInterval(updateData, refreshInterval.value);
};

const stopLiveUpdates = () => {
  isLive.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const toggleLive = () => {
  if (isLive.value) {
    stopLiveUpdates();
  } else {
    startLiveUpdates();
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const getChangeClass = (change: number): string => change >= 0 ? 'text-emerald-500' : 'text-red-500';

onMounted(() => {
  updateData();
  startLiveUpdates();
});

onUnmounted(() => {
  stopLiveUpdates();
});
</script>

<template>
  <div class="font-system bg-slate-50 rounded-xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-1.5rem font-semibold text-slate-800">
        Real-time Analytics
      </h2>
      <div class="flex items-center gap-4">
        <span class="text-sm text-slate-500">
          Last updated: {{ lastUpdate.toLocaleTimeString() }}
        </span>
        <button
          class="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-500 cursor-pointer transition-all"
          :class="isLive ? 'bg-emerald-50! border-emerald-500! text-emerald-600!' : ''"
          @click="toggleLive"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"
          />
          {{ isLive ? 'Live' : 'Paused' }}
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Visitors -->
      <div class="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
        <div class="w-12 h-12 flex items-center justify-center rounded-xl text-white bg-gradient-to-br from-blue-500 to-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-1.5rem font-bold text-slate-800">{{ formatNumber(visitorCount) }}</span>
          <span class="text-sm text-slate-500">Visitors</span>
        </div>
      </div>

      <!-- Page Views -->
      <div class="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
        <div class="w-12 h-12 flex items-center justify-center rounded-xl text-white bg-gradient-to-br from-violet-500 to-violet-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-1.5rem font-bold text-slate-800">{{ formatNumber(pageViewCount) }}</span>
          <span class="text-sm text-slate-500">Page Views</span>
        </div>
      </div>

      <!-- Active Users -->
      <div class="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
        <div class="w-12 h-12 flex items-center justify-center rounded-xl text-white bg-gradient-to-br from-emerald-500 to-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-1.5rem font-bold text-slate-800">{{ activeUsers }}</span>
          <span class="text-sm text-slate-500">Active Now</span>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="showErrors && errorTrackingEnabled" class="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
        <div
          class="w-12 h-12 flex items-center justify-center rounded-xl text-white"
          :class="errorCount > 0 ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-amber-500 to-amber-700'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-1.5rem font-bold text-slate-800">{{ errorCount }}</span>
          <span class="text-sm text-slate-500">Errors</span>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Top Pages -->
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h3 class="text-base font-semibold text-slate-800 mb-4">Top Pages</h3>
        <div class="flex flex-col gap-3">
          <div
            v-for="page in topPages"
            :key="page.url"
            class="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
          >
            <span class="text-sm font-medium text-slate-800">{{ page.url }}</span>
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-500">{{ formatNumber(page.views) }}</span>
              <span class="text-xs font-semibold" :class="getChangeClass(page.change)">
                {{ formatChange(page.change) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h3 class="text-base font-semibold text-slate-800 mb-4">Traffic Sources</h3>
        <div class="flex flex-col gap-3">
          <div
            v-for="referrer in topReferrers"
            :key="referrer.source"
            class="flex items-center gap-3"
          >
            <span class="w-20 text-sm font-medium text-slate-800">{{ referrer.source }}</span>
            <div class="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded transition-all"
                :style="{ width: `${referrer.percentage}%` }"
              />
            </div>
            <span class="w-10 text-xs text-slate-500 text-right">{{ referrer.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Web Vitals -->
      <div v-if="showWebVitals && webVitalsEnabled" class="bg-white rounded-xl p-5 shadow-sm">
        <h3 class="text-base font-semibold text-slate-800 mb-4">Web Vitals</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col p-3 bg-slate-50 rounded-lg">
            <span class="text-xs text-slate-500 mb-1">LCP</span>
            <span class="text-base font-semibold text-emerald-500">2.1s</span>
          </div>
          <div class="flex flex-col p-3 bg-slate-50 rounded-lg">
            <span class="text-xs text-slate-500 mb-1">FID</span>
            <span class="text-base font-semibold text-emerald-500">45ms</span>
          </div>
          <div class="flex flex-col p-3 bg-slate-50 rounded-lg">
            <span class="text-xs text-slate-500 mb-1">CLS</span>
            <span class="text-base font-semibold text-amber-500">0.15</span>
          </div>
          <div class="flex flex-col p-3 bg-slate-50 rounded-lg">
            <span class="text-xs text-slate-500 mb-1">TTFB</span>
            <span class="text-base font-semibold text-emerald-500">180ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
