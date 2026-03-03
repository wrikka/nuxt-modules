import type { CreateType, Category, Feature } from './types';

export function validateComponentName(name: string): boolean {
  // Check if name is not empty
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Check if name follows kebab-case pattern
  const kebabCasePattern = /^[a-z]+(-[a-z]+)*$/;
  if (!kebabCasePattern.test(name.trim())) {
    return false;
  }

  // Check minimum length
  if (name.trim().length < 3) {
    return false;
  }

  return true;
}

export function validateCreateType(type: CreateType): boolean {
  const validTypes: CreateType[] = ['component', 'composable', 'plugin', 'theme'];
  return validTypes.includes(type);
}

export function validateCategory(category: Category): boolean {
  const validCategories: Category[] = ['atoms', 'molecules', 'organisms', 'templates', 'pages'];
  return validCategories.includes(category);
}

export function validateFeatures(features: Feature[]): boolean {
  const validFeatures: Feature[] = ['typescript', 'tests', 'stories', 'docs'];
  return features.every(feature => validFeatures.includes(feature));
}

export function sanitizeComponentName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getValidationError(
  type: 'name' | 'type' | 'category' | 'features',
  value: string | CreateType | Category | Feature[]
): string | null {
  switch (type) {
    case 'name':
      if (!validateComponentName(value as string)) {
        return 'Component name must be in kebab-case (e.g., "my-component") and at least 3 characters long';
      }
      break;
    case 'type':
      if (!validateCreateType(value as CreateType)) {
        return 'Invalid create type selected';
      }
      break;
    case 'category':
      if (!validateCategory(value as Category)) {
        return 'Invalid category selected';
      }
      break;
    case 'features':
      if (!validateFeatures(value as Feature[])) {
        return 'Invalid features selected';
      }
      break;
  }
  return null;
}
