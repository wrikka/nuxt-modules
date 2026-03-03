export interface VersionSnapshot {
	id: string;
	name: string;
	timestamp: Date;
	author: {
		name: string;
		avatar: string;
	};
	thumbnail: string;
	changes: string[];
	isCurrent?: boolean;
}
