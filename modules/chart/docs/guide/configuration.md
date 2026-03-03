# Configuration

## Module Setup

Add the chart module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wpackages/chart'],
  // Optional module configuration
  chart: {
    // Global chart configuration
    theme: 'light', // default theme
    responsive: true, // enable responsive behavior
    animation: true, // enable animations
    // Color scheme
    colors: {
      primary: '#3b82f6',
      secondary: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  }
})
```

## UnoCSS Configuration

The module uses UnoCSS for utility-first styling. Ensure UnoCSS is properly configured in your project.

### Install UnoCSS

```bash
npm install @unocss/nuxt
```

### Configure UnoCSS

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@unocss/nuxt'],
  unocss: {
    // UnoCSS configuration
    theme: {
      colors: {
        // Custom colors for charts
        chart: {
          primary: '#3b82f6',
          secondary: '#ef4444',
          accent: '#10b981'
        }
      }
    }
  }
})
```

## Icon Support

For icon support in chart components, install and configure @nuxt/icon.

### Install @nuxt/icon

```bash
npm install @nuxt/icon
```

### Configure @nuxt/icon

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/icon'],
  icon: {
    // Icon configuration
    size: '1em',
    class: 'chart-icon'
  }
})
```

## Theme Configuration

### Global Theme Setup

Configure the default theme for all charts:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    theme: 'dark' // or 'light' or 'auto'
  }
})
```

### Runtime Theme Switching

```vue
<script setup lang="ts">
import { useChartTheme } from '@wpackages/chart'

const { theme, setTheme } = useChartTheme('light')

// Set theme programmatically
setTheme('dark')
</script>
```

## Chart Defaults

Configure default settings for all charts:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    defaults: {
      // Default chart options
      bar: {
        horizontal: false,
        rounded: true
      },
      line: {
        smooth: false,
        dots: true
      },
      pie: {
        showLabels: true,
        donut: false
      },
      area: {
        fill: true,
        opacity: 0.7
      }
    }
  }
})
```

## Responsive Configuration

Configure responsive breakpoints:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    responsive: {
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280
      },
      mobile: {
        // Mobile-specific options
        legend: 'bottom',
        tooltip: 'compact'
      },
      tablet: {
        // Tablet-specific options
        grid: true,
        zoom: false
      }
    }
  }
})
```

## Performance Configuration

Optimize performance for large datasets:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    performance: {
      // Enable virtual scrolling for large datasets
      virtualScrolling: true,
      // Maximum data points to render
      maxDataPoints: 10000,
      // Enable data sampling
      dataSampling: true,
      // Sampling rate (1 = no sampling, 0.1 = 10% of data)
      samplingRate: 0.5
    }
  }
})
```

## Export/Import Configuration

Configure data export and import options:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    export: {
      formats: ['json', 'csv', 'png', 'svg', 'pdf'],
      defaultFormat: 'json',
      includeMetadata: true
    },
    import: {
      maxFileSize: '10MB',
      allowedFormats: ['json', 'csv'],
      validateData: true
    }
  }
})
```

## Animation Configuration

Configure chart animations:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    animation: {
      enabled: true,
      duration: 1000,
      easing: 'ease-out',
      delay: 0
    }
  }
})
```

## Accessibility Configuration

Configure accessibility features:

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  chart: {
    accessibility: {
      ariaLabels: true,
      keyboardNavigation: true,
      highContrast: false,
      screenReader: true
    }
  }
})
```
