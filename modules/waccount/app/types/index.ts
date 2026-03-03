export interface UserProfile {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	emailVerified?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface UpdateProfileData {
	name?: string;
	avatar?: string | File;
}

export interface LoginFormData {
	email: string;
	password: string;
}

export interface RegisterFormData {
	email: string;
	password: string;
	name?: string;
}
