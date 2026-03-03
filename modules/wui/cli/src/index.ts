// Re-export all modules for cleaner imports
export * from './types';
export * from './utils';
export * from './constants';
export * from './validation';

// Export commands
export { handleDev } from './commands/dev';
export { handleCreate } from './commands/create';
export { handleBuild } from './commands/build';
export { handleStatus } from './commands/status';
export { handleClean } from './commands/clean';

// Main CLI function
import { intro, outro, select } from '@clack/prompts';
import { handleCancel } from './utils';
import { MESSAGES, OPTIONS } from './constants';
import { handleDev } from './commands/dev';
import { handleCreate } from './commands/create';
import { handleBuild } from './commands/build';
import { handleStatus } from './commands/status';
import { handleClean } from './commands/clean';
import type { Action } from './types';

async function main(): Promise<void> {
  intro(MESSAGES.intro.main);

  const action = handleCancel(await select({
    message: MESSAGES.select.action,
    options: [...OPTIONS.actions]
  })) as Action;

  await handleAction(action);
  outro(MESSAGES.outro.main);
}

async function handleAction(action: Action): Promise<void> {
  switch (action) {
    case 'dev':
      await handleDev();
      break;
    case 'create':
      await handleCreate();
      break;
    case 'build':
      await handleBuild();
      break;
    case 'status':
      await handleStatus();
      break;
    case 'clean':
      await handleClean();
      break;
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main, handleAction };
