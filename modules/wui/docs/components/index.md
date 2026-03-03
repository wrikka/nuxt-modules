---
title: Components Overview
description: Overview of all WUI components organized by atomic design principles
---

<script setup lang="ts">
import WButton from '~/components/atoms/Button.vue'
import WCard from '~/components/molecules/Card.vue'
import WCardContent from '~/components/molecules/CardContent.vue'
import WCardHeader from '~/components/molecules/CardHeader.vue'
import WCardTitle from '~/components/molecules/CardTitle.vue'
import WFlex from '~/components/atoms/Flex.vue'
import WHeading from '~/components/atoms/Heading.vue'
import WBadge from '~/components/atoms/Badge.vue'
</script>

# Components

WUI provides a comprehensive set of UI components organized following atomic design principles. Components are divided into three categories:

## 🧩 Atoms

The smallest, indivisible components that serve as the building blocks for more complex interfaces.

### Form Elements
- **Button** - Interactive buttons with multiple variants
- **Input** - Text input fields
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection component
- **Checkbox** - Boolean input control
- **Radio** - Single selection from multiple options
- **Switch** - Toggle switch control

### Display Elements
- **Text** - Typography component with variants
- **Heading** - Semantic heading components
- **Icon** - Icon display component
- **Image** - Image display with lazy loading
- **Avatar** - User avatar component
- **Badge** - Status indicators and labels
- **Chip** - Interactive tags and filters

### Layout Elements
- **Container** - Content wrapper with max-width
- **Flex** - Flexible layout container
- **Grid** - CSS Grid layout container
- **Stack** - Vertical stacking layout
- **Separator** - Visual dividers

## 🧬 Molecules

Combinations of atoms that form more complex UI patterns.

### Form Molecules
- **FormField** - Complete form field with label and validation
- **SearchInput** - Search input with icon and functionality
- **DatePicker** - Date selection component
- **FileUpload** - File upload with drag-and-drop

### Content Molecules
- **Card** - Content containers with header, content, and footer
- **Alert** - Notification and status messages
- **Accordion** - Collapsible content sections
- **Tabs** - Tabbed content navigation
- **Breadcrumb** - Navigation breadcrumb trail

### Interactive Molecules
- **Dialog** - Modal dialogs and overlays
- **Popover** - Floating content panels
- **Tooltip** - Contextual help text
- **Toast** - Temporary notifications

## 🏗️ Organisms

Complex components composed of molecules and atoms that represent complete sections of an interface.

### Data Display
- **DataTable** - Sortable and filterable data tables
- **Pagination** - Page navigation controls

### Navigation
- **Stepper** - Multi-step process indicators
- **Rating** - Star rating input/display

## Component Categories

<WFlex direction="row" gap="md" wrap="wrap" class="my-6">
  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WBadge variant="secondary">Atoms</WBadge>
      <WCardTitle>Foundation</WCardTitle>
    </WCardHeader>
    <WCardContent>
      Basic building blocks like buttons, inputs, and text elements. These are the smallest reusable components.
    </WCardContent>
  </WCard>

  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WBadge variant="secondary">Molecules</WBadge>
      <WCardTitle>Combinations</WCardTitle>
    </WCardHeader>
    <WCardContent>
      Components made by combining atoms, like form fields, cards, and navigation elements.
    </WCardContent>
  </WCard>

  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WBadge variant="secondary">Organisms</WBadge>
      <WCardTitle>Complex UI</WCardTitle>
    </WCardHeader>
    <WCardContent>
      Complete interface sections like data tables, steppers, and complex forms.
    </WCardContent>
  </WCard>
</WFlex>

## Usage Examples

Here's how you might use different types of components together:

```vue
<template>
  <!-- Organism: Complete form section -->
  <WCard>
    <WCardHeader>
      <WCardTitle>Contact Form</WCardTitle>
    </WCardHeader>
    <WCardContent>
      <WStack gap="md">
        <!-- Molecule: Form field -->
        <WFormField label="Name">
          <!-- Atom: Input -->
          <WInput placeholder="Enter your name" />
        </WFormField>
        <!-- Molecule: Form field -->
        <WFormField label="Email">
          <!-- Atom: Input -->
          <WInput type="email" placeholder="Enter your email" />
        </WFormField>
        <!-- Atom: Button -->
        <WButton>Submit</WButton>
      </WStack>
    </WCardContent>
  </WCard>
</template>
```

## Component API

Each component includes:

- **Props** - Configuration options
- **Slots** - Content insertion points
- **Events** - User interaction handling
- **TypeScript** - Full type definitions

## Next Steps

- [Button Component](./buttons) - Learn about button variants and usage
- [Form Components](./forms) - Complete form component guide
- [Layout Components](./layout) - Layout and container components
