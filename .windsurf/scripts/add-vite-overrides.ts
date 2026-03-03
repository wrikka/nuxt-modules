import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const MODULES_DIR = 'modules'
const OVERRIDE_CONFIG = {
  vite: 'npm:rolldown-vite@latest'
}

async function findPackageJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const packageJsonPath = join(dir, entry.name, 'package.json')
      try {
        await readFile(packageJsonPath, 'utf-8')
        files.push(packageJsonPath)
      } catch {
        // ไม่มี package.json ในโฟลเดอร์นี้
      }
    }
  }

  return files
}

async function addOverrides(packageJsonPath: string): Promise<boolean> {
  const content = await readFile(packageJsonPath, 'utf-8')
  const pkg = JSON.parse(content)

  // ถ้ามี overrides อยู่แล้ว และมี vite อยู่แล้ว
  if (pkg.overrides?.vite === OVERRIDE_CONFIG.vite) {
    console.log(`✓ ${packageJsonPath} - มี overrides อยู่แล้ว`)
    return false
  }

  // เพิ่ม overrides
  pkg.overrides = {
    ...pkg.overrides,
    ...OVERRIDE_CONFIG
  }

  // จัดเรียง keys ใหม่
  const sortedPkg: Record<string, unknown> = {}
  const keys = Object.keys(pkg).sort()
  for (const key of keys) {
    sortedPkg[key] = pkg[key]
  }

  await writeFile(packageJsonPath, JSON.stringify(sortedPkg, null, 2) + '\n')
  console.log(`✓ ${packageJsonPath} - เพิ่ม overrides สำเร็จ`)
  return true
}

async function main(): Promise<void> {
  try {
    const packageJsonFiles = await findPackageJsonFiles(MODULES_DIR)

    if (packageJsonFiles.length === 0) {
      console.log('ไม่พบ package.json ในโฟลเดอร์ modules/')
      return
    }

    console.log(`พบ ${packageJsonFiles.length} package.json ใน modules/`)
    console.log('')

    let updatedCount = 0
    for (const file of packageJsonFiles) {
      const updated = await addOverrides(file)
      if (updated) updatedCount++
    }

    console.log('')
    console.log(`อัปเดต ${updatedCount} ไฟล์`)
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    process.exit(1)
  }
}

main()
