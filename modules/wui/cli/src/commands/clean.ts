import { intro, outro, multiselect, confirm, spinner, note } from '@clack/prompts';
import { handleCancel, runCommand } from '../utils';
import { MESSAGES, OPTIONS, CONFIG } from '../constants';
import type { CleanTarget } from '../types';

export async function handleClean(): Promise<void> {
  intro(MESSAGES.intro.clean);

  const cleanTargets = handleCancel(await multiselect({
    message: MESSAGES.select.cleanTarget,
    options: [...OPTIONS.cleanTargets]
  })) as CleanTarget[];

  const shouldClean = handleCancel(await confirm({
    message: MESSAGES.confirm.clean
  }));

  if (shouldClean) {
    for (const target of cleanTargets) {
      const s = spinner();
      s.start(MESSAGES.spinner.cleaning(target));

      try {
        if (target === 'node_modules') {
          await runCommand('rm', ['-rf', 'node_modules']);
        } else if (target === 'dist') {
          await runCommand('rm', ['-rf', 'dist']);
        }

        await new Promise(resolve => setTimeout(resolve, CONFIG.cleaningDelay));
        s.stop(MESSAGES.success.cleaned(target));
      } catch (_error) {
        s.stop(MESSAGES.error.cleanFailed(target));
      }
    }

    note(MESSAGES.note.restoreDeps);
  }

  outro(MESSAGES.outro.clean);
}
