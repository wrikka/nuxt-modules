---
title: Button Component
description: Interactive button component with multiple variants and sizes
---

<script setup lang="ts">
import WButton from '~/components/atoms/Button.vue'
import WFlex from '~/components/atoms/Flex.vue'
import WHeading from '~/components/atoms/Heading.vue'
</script>

# Button

The Button component is a versatile interactive element that supports multiple variants, sizes, and states.

## Basic Usage

<DemoBlock title="Basic Button" description="Simple button with default styling">
  <template #preview>
    <WButton>Click me</WButton>
  </template>
  <template #code>
&lt;WButton&gt;Click me&lt;/WButton&gt;
  </template>
</DemoBlock>

## Variants

The Button component supports several variants to fit different design needs.

<DemoBlock title="Button Variants" description="Different visual styles for various use cases">
  <template #preview>
    <WFlex gap="md" wrap="wrap">
      <WButton variant="default">Default</WButton>
      <WButton variant="secondary">Secondary</WButton>
      <WButton variant="outline">Outline</WButton>
      <WButton variant="ghost">Ghost</WButton>
      <WButton variant="link">Link</WButton>
      <WButton variant="destructive">Destructive</WButton>
    </WFlex>
  </template>
  <template #code>
&lt;WFlex gap="md" wrap="wrap"&gt;
  &lt;WButton variant="default"&gt;Default&lt;/WButton&gt;
  &lt;WButton variant="secondary"&gt;Secondary&lt;/WButton&gt;
  &lt;WButton variant="outline"&gt;Outline&lt;/WButton&gt;
  &lt;WButton variant="ghost"&gt;Ghost&lt;/WButton&gt;
  &lt;WButton variant="link"&gt;Link&lt;/WButton&gt;
  &lt;WButton variant="destructive"&gt;Destructive&lt;/WButton&gt;
&lt;/WFlex&gt;
  </template>
</DemoBlock>

## Sizes

Buttons come in different sizes to accommodate various layout requirements.

<DemoBlock title="Button Sizes" description="Different button sizes for various contexts">
  <template #preview>
    <WFlex gap="md" align="center">
      <WButton size="sm">Small</WButton>
      <WButton size="default">Default</WButton>
      <WButton size="lg">Large</WButton>
      <WButton size="icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"/>
        </svg>
      </WButton>
    </WFlex>
  </template>
  <template #code>
&lt;WFlex gap="md" align="center"&gt;
  &lt;WButton size="sm"&gt;Small&lt;/WButton&gt;
  &lt;WButton size="default"&gt;Default&lt;/WButton&gt;
  &lt;WButton size="lg"&gt;Large&lt;/WButton&gt;
  &lt;WButton size="icon"&gt;
    &lt;!-- Icon content --&gt;
  &lt;/WButton&gt;
&lt;/WFlex&gt;
  </template>
</DemoBlock>

## States

Buttons can display different states including loading and disabled.

<DemoBlock title="Button States" description="Loading and disabled button states">
  <template #preview>
    <WFlex gap="md" wrap="wrap">
      <WButton disabled>Disabled</WButton>
      <WButton loading>Loading</WButton>
      <WButton variant="outline" disabled>Disabled Outline</WButton>
      <WButton variant="outline" loading>Loading Outline</WButton>
    </WFlex>
  </template>
  <template #code>
&lt;WFlex gap="md" wrap="wrap"&gt;
  &lt;WButton disabled&gt;Disabled&lt;/WButton&gt;
  &lt;WButton loading&gt;Loading&lt;/WButton&gt;
  &lt;WButton variant="outline" disabled&gt;Disabled Outline&lt;/WButton&gt;
  &lt;WButton variant="outline" loading&gt;Loading Outline&lt;/WButton&gt;
&lt;/WFlex&gt;
  </template>
</DemoBlock>

## With Icons

Buttons can contain icons alongside text for better visual communication.

<DemoBlock title="Buttons with Icons" description="Buttons enhanced with icons">
  <template #preview>
    <WFlex gap="md" wrap="wrap">
      <WButton>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </svg>
        Add Item
      </WButton>
      <WButton variant="outline">
        Download
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ml-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </WButton>
      <WButton variant="ghost" size="icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="12" cy="5" r="1"/>
          <circle cx="12" cy="19" r="1"/>
        </svg>
      </WButton>
    </WFlex>
  </template>
  <template #code>
&lt;WFlex gap="md" wrap="wrap"&gt;
  &lt;WButton&gt;
    &lt;!-- Icon --&gt;
    Add Item
  &lt;/WButton&gt;
  &lt;WButton variant="outline"&gt;
    Download
    &lt;!-- Icon --&gt;
  &lt;/WButton&gt;
  &lt;WButton variant="ghost" size="icon"&gt;
    &lt;!-- Icon --&gt;
  &lt;/WButton&gt;
&lt;/WFlex&gt;
  </template>
</DemoBlock>

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Whether to show loading spinner |

### Events

| Event | Description |
|-------|-------------|
| `click` | Fired when button is clicked |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button content (text, icons, etc.) |

## Accessibility

- Buttons have proper `focus-visible` styling
- Disabled buttons have `pointer-events-none` and reduced opacity
- Loading buttons show appropriate loading indicators
- All buttons include proper ARIA attributes when needed
