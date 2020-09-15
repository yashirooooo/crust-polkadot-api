import { Server } from 'mock-socket';
declare const TEST_WS_URL = "ws://localhost:9955";
interface Scope {
    body: {
        [index: string]: Record<string, any>;
    };
    requests: number;
    server: Server;
    done: any;
}
interface ErrorDef {
    id: number;
    error: {
        code: number;
        message: string;
    };
}
declare function mockWs(requests: ({
    method: string;
} & ErrorDef)[], wsUrl?: string): Scope;
export { TEST_WS_URL, mockWs };
