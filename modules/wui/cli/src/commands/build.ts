import { intro, outro, multiselect, select, confirm, spinner } from '@clack/prompts';
import { handleCancel, runCommand } from '../utils';
import { MESSAGES, OPTIONS } from '../constants';
import type { BuildTarget, BuildMode } from '../types';

export async function handleBuild(): Promise<void> {
  intro(MESSAGES.intro.build);

  const targets = handleCancel(await multiselect({
    message: MESSAGES.select.buildTarget,
    options: [...OPTIONS.buildTargets]
  })) as BuildTarget[];

  const mode = handleCancel(await select({
    message: MESSAGES.select.buildMode,
    options: [...OPTIONS.buildModes]
  })) as BuildMode;

  const shouldContinue = handleCancel(await confirm({
    message: MESSAGES.confirm.build(targets, mode)
  }));

  if (shouldContinue) {
    for (const target of targets) {
      const s = spinner();
      s.start(MESSAGES.spinner.building(target));

      try {
        if (target === 'all') {
          await runCommand('bun', ['run', 'build']);
        } else {
          await runCommand('bun', ['run', 'build'], `./${target}`);
        }
        s.stop(MESSAGES.success.built(target));
      } catch (_error) {
        s.stop(MESSAGES.error.buildFailed(target));
      }
    }
  }

  outro(MESSAGES.outro.build);
}
