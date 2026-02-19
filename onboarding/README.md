# @wrikka/onboarding

Nuxt module for user onboarding flows with step management.

## Features

- Step-by-step onboarding flows
- Progress persistence
- Skip functionality
- Custom actions (link, form, custom)
- Progress tracking
- Auto-start option

## Installation

```bash
bun add @wrikka/onboarding
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/onboarding'],
  onboarding: {
    enabled: true,
    autoStart: true,
    persistProgress: true,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome!',
        description: "Let's get you started",
        icon: '🎉',
        required: true,
      },
      {
        id: 'profile',
        title: 'Complete your profile',
        description: 'Add your details',
        icon: '👤',
        required: true,
        action: {
          type: 'link',
          target: '/settings/profile',
        },
      },
      {
        id: 'team',
        title: 'Invite your team',
        description: 'Collaborate with others',
        icon: '👥',
        required: false,
        action: {
          type: 'link',
          target: '/settings/team',
        },
      },
    ],
    skipable: true,
    showProgress: true,
    debug: false,
  },
});
```

## Usage

### Start Onboarding

```typescript
const { start, isActive, steps, progress } = useOnboarding();

// Start onboarding
start();

// Check if active
if (isActive.value) {
  console.log('Current step:', progress.value.currentStep);
}
```

### Complete Steps

```typescript
const { completeStep, skipStep, nextStep, previousStep } = useOnboarding();

// Complete current step
await completeStep('profile');

// Skip optional step
await skipStep('team');

// Navigate steps
goToStep(nextStep.value?.id);
```

### Progress Tracking

```typescript
const { progress, currentStepIndex } = useOnboarding();

// Get completion percentage
console.log('Progress:', progress.value.percentage + '%');

// Check if completed
if (progress.value.completed) {
  console.log('Onboarding finished!');
}
```

### Reset

```typescript
const { reset } = useOnboarding();

// Reset all progress
reset();
```

## License

MIT
