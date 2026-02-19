export declare function createBackup(): Promise<{
    success: boolean;
    path: string;
    size: number;
}>;
export declare function restoreBackup(backupPath: string): Promise<{
    success: boolean;
    message: string;
}>;
export declare function listBackups(): Promise<Array<{
    path: string;
    size: number;
    createdAt: string;
}>>;
export declare function deleteBackup(backupPath: string): Promise<{
    success: boolean;
    message: string;
}>;
//# sourceMappingURL=system.d.ts.map