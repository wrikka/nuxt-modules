export declare function useStockWebSocket(stockAlerts: any, stockMovements: any, stockTransfers: any, stockAdjustments: any): {
    initializeWebSocket: () => void;
    socket: import("vue").Ref<{
        binaryType: BinaryType;
        readonly bufferedAmount: number;
        readonly extensions: string;
        onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
        onerror: ((this: WebSocket, ev: Event) => any) | null;
        onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
        onopen: ((this: WebSocket, ev: Event) => any) | null;
        readonly protocol: string;
        readonly readyState: number;
        readonly url: string;
        close: (code?: number, reason?: string) => void;
        send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
        readonly CONNECTING: 0;
        readonly OPEN: 1;
        readonly CLOSING: 2;
        readonly CLOSED: 3;
        addEventListener: {
            <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        };
        removeEventListener: {
            <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        };
        dispatchEvent: {
            (event: Event): boolean;
            (event: Event): boolean;
        };
    } | null, WebSocket | {
        binaryType: BinaryType;
        readonly bufferedAmount: number;
        readonly extensions: string;
        onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
        onerror: ((this: WebSocket, ev: Event) => any) | null;
        onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
        onopen: ((this: WebSocket, ev: Event) => any) | null;
        readonly protocol: string;
        readonly readyState: number;
        readonly url: string;
        close: (code?: number, reason?: string) => void;
        send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
        readonly CONNECTING: 0;
        readonly OPEN: 1;
        readonly CLOSING: 2;
        readonly CLOSED: 3;
        addEventListener: {
            <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        };
        removeEventListener: {
            <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        };
        dispatchEvent: {
            (event: Event): boolean;
            (event: Event): boolean;
        };
    } | null>;
};
//# sourceMappingURL=useStockWebSocket.d.ts.map