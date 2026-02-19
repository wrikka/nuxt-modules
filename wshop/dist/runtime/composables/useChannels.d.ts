export declare const useChannels: () => {
    connectedChannels: any;
    refresh: any;
    connectChannel: (channelId: string) => Promise<void>;
    toggleChannel: (channelId: string, currentStatus: boolean) => Promise<void>;
    saveConfig: (channelId: string, config: Record<string, unknown>) => Promise<void>;
};
//# sourceMappingURL=useChannels.d.ts.map