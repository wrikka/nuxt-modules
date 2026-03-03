import { intro, outro, select, text, note, log } from '@clack/prompts';
import { handleCancel, runCommand } from '../utils';
import { MESSAGES, OPTIONS, CONFIG } from '../constants';
import type { DevMode } from '../types';

export async function handleDev(): Promise<void> {
  intro(MESSAGES.intro.dev);

  const mode = handleCancel(await select({
    message: MESSAGES.select.devMode,
    options: [...OPTIONS.devModes]
  })) as DevMode;

  if (mode === 'custom') {
    const command = handleCancel(await text({
      message: MESSAGES.text.command,
      placeholder: MESSAGES.text.customCommand
    })) as string;

    await runCommand(command.split(' ')[0], command.split(' ').slice(1));
  } else {
    const port = handleCancel(await text({
      message: MESSAGES.text.port,
      placeholder: CONFIG.defaultPort,
      initialValue: CONFIG.defaultPort
    }));

    note(MESSAGES.note.startingServer(mode, String(port)));

    try {
      if (mode === 'docs') {
        await runCommand('bun', ['run', 'dev'], './docs');
      } else {
        log.warn(`${mode} not implemented yet`);
      }
    } catch (_error) {
      log.error(MESSAGES.error.devServerFailed);
    }
  }

  outro(MESSAGES.outro.dev);
}
