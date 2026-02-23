import { icons as lucide } from '@iconify-json/lucide';
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
      collections: {
        lucide,
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
    transformerCompileClass(),
  ],
  shortcuts: {
    'app-shell': 'min-h-screen bg-[#0B1220] text-slate-100',
    'app-container': 'mx-auto w-full max-w-6xl px-4',
    'app-card': 'rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm',
    'app-chip': 'inline-flex items-center rounded-md bg-white/8 px-2 py-1 text-xs text-slate-200',
    'app-btn':
      'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    'app-btn-primary': 'app-btn bg-sky-500 text-white hover:bg-sky-400',
    'app-btn-ghost': 'app-btn bg-transparent hover:bg-white/8',
    'app-input':
      'w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/20',
  },
});
