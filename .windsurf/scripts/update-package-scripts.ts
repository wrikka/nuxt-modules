#!/usr/bin/env bun

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, relative } from 'path'

const requiredScripts = {
  dev: 'nuxt dev',
  build: 'nuxt-build-module',
  lint: 'nuxt typecheck && oxlint --type-aware --fix && biome lint --write',
  release: 'release-it',
  test: 'vitest'
}

async function findPackageJson(dir: string, results: string[] = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      await findPackageJson(fullPath, results)
    } else if (entry.isFile() && entry.name === 'package.json') {
      results.push(fullPath)
    }
  }
  return results
}

async function updatePackageJson(filePath: string) {
  try {
    const content = await readFile(filePath, 'utf-8')
    const pkg = JSON.parse(content)
    if (!pkg.scripts) pkg.scripts = {}
    Object.assign(pkg.scripts, requiredScripts)
    const updatedContent = JSON.stringify(pkg, null, 2) + '\n'
    await writeFile(filePath, updatedContent, 'utf-8')
    console.log(`Updated: ${relative(process.cwd(), filePath)}`)
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message)
  }
}

async function main() {
  const packages = await findPackageJson(process.cwd())
  console.log(`Found ${packages.length} package.json files`)
  for (const pkg of packages) {
    await updatePackageJson(pkg)
  }
  console.log('Done updating package.json scripts')
}

main().catch(console.error)
