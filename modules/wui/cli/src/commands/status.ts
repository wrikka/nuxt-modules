import { intro, outro, log, note } from '@clack/prompts';
import { runCommand } from '../utils';
import { MESSAGES } from '../constants';
import fs from 'node:fs/promises';

export async function handleStatus(): Promise<void> {
  intro(MESSAGES.intro.status);

  try {
    // Get git status
    const { stdout: gitStatus } = await runCommand('git', ['status', '--porcelain']);
    const hasChanges = gitStatus.trim().length > 0;

    // Get package info
    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf-8'));

    log.info(`📦 Project: ${packageJson.name}`);
    log.info(`🏷️  Version: ${packageJson.version}`);
    log.info(`🔧 Package Manager: ${packageJson.packageManager}`);
    log.info(`${hasChanges ? '🔴' : '🟢'} Git Status: ${hasChanges ? 'Has changes' : 'Clean'}`);

    if (hasChanges) {
      note(MESSAGES.note.gitChanges);
    }

  } catch (_error) {
    log.error(MESSAGES.error.statusFailed);
  }

  outro(MESSAGES.outro.status);
}
