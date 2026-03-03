#!/usr/bin/env bun

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const excludeDirs = new Set(['.git', 'node_modules', '.nuxt', '.vscode', '.codeium', '.windsurf', 'dist', 'build', '.output']);
const excludeExtensions = new Set(['.lock', '.log', '.min.js', '.min.css']);

// อ่าน .gitignore
if (existsSync('.gitignore')) {
  try {
    const gitignore = readFileSync('.gitignore', 'utf-8');
    const lines = gitignore.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    for (const line of lines) {
      if (line.endsWith('/')) {
        excludeDirs.add(line.slice(0, -1));
      } else if (line.startsWith('*.') && !line.includes('*', 1)) {
        const ext = line.slice(1);
        excludeExtensions.add(ext);
      }
    }
  } catch (e) {
    // ignore
  }
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (!excludeDirs.has(item)) {
          getAllFiles(fullPath, files);
        }
      } else {
        const ext = item.includes('.') ? item.substring(item.lastIndexOf('.')) : '';
        if (!excludeExtensions.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (e) {
    // skip
  }
  return files;
}

try {
  const files = getAllFiles('.');
  const fileLines = files
    .map(file => {
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        return { file, lines };
      } catch (e) {
        return { file, lines: 0 };
      }
    })
    .filter(item => item.lines > 0);

  fileLines.sort((a, b) => b.lines - a.lines);

  console.log('Top 20 longest files:');
  fileLines.slice(0, 20).forEach((item, index) => {
    console.log(`${index + 1}. ${item.lines} lines - ${item.file}`);
  });
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : String(error));
}
