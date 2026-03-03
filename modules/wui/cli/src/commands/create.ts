import { intro, outro, select, text, multiselect, confirm, spinner, note, log } from '@clack/prompts';
import { handleCancel } from '../utils';
import { MESSAGES, OPTIONS, CONFIG } from '../constants';
import { validateComponentName, sanitizeComponentName, getValidationError } from '../validation';
import type { CreateType, Category, Feature } from '../types';

export async function handleCreate(): Promise<void> {
  intro(MESSAGES.intro.create);

  const type = handleCancel(await select({
    message: MESSAGES.select.createType,
    options: [...OPTIONS.createTypes]
  })) as CreateType;

  let name = handleCancel(await text({
    message: MESSAGES.text.componentName(type),
    placeholder: MESSAGES.text.placeholder(type),
    validate: (value) => {
      if (!value) return 'Component name is required';
      const error = getValidationError('name', value);
      return error || undefined;
    }
  })) as string;

  // Sanitize and validate the name
  name = sanitizeComponentName(name);

  if (!validateComponentName(name)) {
    log.error(getValidationError('name', name) || 'Invalid component name');
    return;
  }

  const category = handleCancel(await select({
    message: MESSAGES.select.category,
    options: [...OPTIONS.categories]
  })) as Category;

  const _features = handleCancel(await multiselect({
    message: 'Select features to include:',
    options: [...OPTIONS.features],
    required: false
  })) as Feature[];

  const shouldCreate = handleCancel(await confirm({
    message: MESSAGES.confirm.create(type, name)
  }));

  if (shouldCreate) {
    const s = spinner();
    s.start(MESSAGES.spinner.creating);

    // Simulate creation process
    await new Promise(resolve => setTimeout(resolve, CONFIG.creationTimeout));

    s.stop(MESSAGES.success.created(type, name));

    note(MESSAGES.note.createdFiles(name, category));
  }

  outro(MESSAGES.outro.create);
}
