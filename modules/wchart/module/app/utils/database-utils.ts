/**
 * Get column value from database row
 */
export const getColumnValue = (row: any, column: string): any => {
	if (typeof row === "object" && row !== null) {
		return row[column] ?? null;
	}
	return null;
};
