import { exec } from "node:child_process";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
const execAsync = promisify(exec);
export async function createBackup() {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupDir = join(process.cwd(), "backups");
  const backupPath = join(backupDir, `backup-${timestamp}.sql`);
  try {
    await mkdir(backupDir, { recursive: true });
    const { stderr } = await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${backupPath}`);
    if (stderr) {
      console.error("Backup stderr:", stderr);
    }
    const stats = await stat(backupPath);
    return {
      success: true,
      path: backupPath,
      size: stats.size
    };
  } catch (error) {
    console.error("Backup failed:", error);
    return {
      success: false,
      path: backupPath,
      size: 0
    };
  }
}
export async function restoreBackup(backupPath) {
  try {
    const { stderr } = await execAsync(`psql ${process.env.DATABASE_URL} < ${backupPath}`);
    if (stderr) {
      console.error("Restore stderr:", stderr);
    }
    return {
      success: true,
      message: "Database restored successfully"
    };
  } catch (error) {
    console.error("Restore failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Restore failed"
    };
  }
}
export async function listBackups() {
  const backupDir = join(process.cwd(), "backups");
  try {
    const files = await readdir(backupDir);
    const backups = await Promise.all(
      files.filter((file) => file.startsWith("backup-") && file.endsWith(".sql")).map(async (file) => {
        const filePath = join(backupDir, file);
        const stats = await stat(filePath);
        return {
          path: filePath,
          size: stats.size,
          createdAt: stats.mtime.toISOString()
        };
      })
    );
    return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to list backups:", error);
    return [];
  }
}
export async function deleteBackup(backupPath) {
  try {
    await unlink(backupPath);
    return {
      success: true,
      message: "Backup deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete backup:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete backup"
    };
  }
}
