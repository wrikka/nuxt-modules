export declare const useAuth: () => {
    user: any;
    loggedIn: any;
    fetchUser: () => Promise<void>;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<{
        success: boolean;
        message?: never;
    } | {
        success: boolean;
        message: string;
    }>;
    logout: () => Promise<void>;
};
//# sourceMappingURL=useAuth.d.ts.map