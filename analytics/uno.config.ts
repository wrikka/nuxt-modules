import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
    transformerCompileClass(),
  ],
  theme: {
    colors: {
      analytics: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  shortcuts: {
    'dashboard-card': 'bg-white rounded-xl p-5 shadow-sm',
    'metric-icon': 'w-12 h-12 flex items-center justify-center rounded-xl text-white',
    'metric-value': 'text-2xl font-bold text-slate-800',
    'metric-label': 'text-sm text-slate-500',
    'section-title': 'text-base font-semibold text-slate-800 mb-4',
    'live-indicator': 'w-2 h-2 rounded-full',
    'live-indicator-active': 'live-indicator bg-emerald-500 animate-pulse',
    'live-indicator-inactive': 'live-indicator bg-slate-300',
  },
});
