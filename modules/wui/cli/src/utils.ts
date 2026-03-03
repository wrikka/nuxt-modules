import { spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { spinner, cancel, isCancel } from '@clack/prompts';
import { MESSAGES } from './constants';
import type { CommandResult } from './types';

const exec = promisify(spawn);

export async function runCommand(command: string, args: string[], cwd?: string): Promise<CommandResult> {
  const s = spinner();
  s.start(MESSAGES.spinner.runningCommand(command, args));

  try {
    const result = await exec(command, args, { cwd, shell: true }) as { stdout?: string; stderr?: string };
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    s.stop(MESSAGES.success.commandCompleted(command));
    return { stdout, stderr };
  } catch (error: unknown) {
    s.stop(MESSAGES.error.commandFailed(command));
    throw error;
  }
}

export function handleCancel<T>(value: T, message: string = 'Operation cancelled'): T {
  if (isCancel(value)) {
    cancel(message);
    process.exit(0);
  }
  return value;
}
