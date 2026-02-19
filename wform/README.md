# @wrikka/wform

Nuxt module สำหรับจัดการฟอร์มอย่างครบครัน พร้อม validation, field arrays, และ error handling

## Features

- **Form Management** - จัดการสถานะฟอร์มด้วย composables ที่ใช้งานง่าย
- **Validation** - รองรับ Zod schema validation พร้อม real-time validation
- **Field Arrays** - จัดการ dynamic fields เช่น adding/removing items
- **Type Safety** - TypeScript first พร้อม full type inference
- **Error Handling** - แสดง error messages แบบอัตโนมัติ
- **Form Persistence** - บันทึก form state ลง localStorage/sessionStorage
- **Multi-Step Wizard** - สร้าง wizard forms หลายขั้นตอน
- **Conditional Fields** - แสดง/ซ่อน fields ตาม conditions

## Installation

```bash
bun add @wrikka/wform
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wform'],
  wform: {
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
  },
});
```

## Usage

### Basic Form

```vue
<script setup lang="ts">
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { form, handleSubmit } = useForm({
  schema,
  onSubmit: async (values) => {
    await login(values);
  },
});
</script>

<template>
  <WForm :form="form" @submit="handleSubmit">
    <WField name="email">
      <input v-model="form.values.email" type="email" />
    </WField>
    <WField name="password">
      <input v-model="form.values.password" type="password" />
    </WField>
    <button type="submit">Submit</button>
  </WForm>
</template>
```

### Field Arrays

```vue
<script setup lang="ts">
const { fields, append, remove } = useFieldArray('items');
</script>

<template>
  <div v-for="(field, index) in fields" :key="field.id">
    <input v-model="field.value.name" />
    <button @click="remove(index)">Remove</button>
  </div>
  <button @click="append({ name: '' })">Add Item</button>
</template>
```

## Composables

- `useForm` - จัดการสถานะฟอร์มหลัก
- `useField` - จัดการแต่ละ field
- `useFieldArray` - จัดการ dynamic arrays
- `useFormPersist` - บันทึก/กู้คืน form state จาก storage
- `useFormWizard` - จัดการ multi-step forms
- `useFormConditional` - จัดการ conditional fields

## Components

- `<WForm>` - Form wrapper component
- `<WField>` - Field wrapper พร้อม error display
- `<WFieldArray>` - Field array wrapper
- `<WErrorMessage>` - Error message display
- `<WFormWizard>` - Multi-step wizard component

## License

MIT
