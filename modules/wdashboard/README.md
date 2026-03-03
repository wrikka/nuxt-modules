# @wrikka/wdashboard

Dashboard module with 14 essential tabs for Nuxt applications.

## Features

- **14 Essential Tabs**: Profile, Account, Security, Privacy, Data, Settings, Notifications, Billing, Activity, Devices, Accessibility, Backup, Help, About
- **Built with @wrikka/wui**: Uses shared UI components for consistent design
- **Responsive Layout**: Mobile-first sidebar navigation
- **TypeScript**: Fully typed components and composables

## Installation

```bash
bun add @wrikka/wdashboard
```

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wdashboard']
})
```

```vue
<!-- app.vue -->
<template>
  <WDashboard />
</template>
```

## Tabs

### User Management
- **Profile**: User profile information and avatar
- **Account**: Account settings, language, timezone
- **Security**: Password, 2FA, active sessions
- **Privacy**: Privacy settings and data control

### Data & Settings
- **Data**: Storage usage, data export, deletion
- **Settings**: Appearance, regional, editor settings
- **Notifications**: Email, push, in-app notifications
- **Backup**: Automatic backup, restore, history

### System
- **Billing**: Plans, payment methods, invoices
- **Activity**: Activity log and statistics
- **Devices**: Device management and security
- **Accessibility**: Vision, motion, screen reader settings

### Support
- **Help**: FAQ, documentation, contact support
- **About**: App info, legal, credits

## Development

```bash
# Install dependencies
bun install

# Run playground
bun run dev

# Build module
bun run build
```

## License

MIT
