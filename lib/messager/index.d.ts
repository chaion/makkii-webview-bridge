import { EventBus } from './event_bus';
/**
 * Payload status
 *
 */
declare enum PayloadStatus {
    success = 0,
    fail = 1,
    pending = 2
}
export interface Ipayload<T, V = PayloadStatus | string> {
    id: number;
    command: string;
    data: T;
    reply: boolean;
    status: V;
}
declare type TCallBack = (...data: any) => any;
export declare class Deferred<T> extends EventBus<T> implements Promise<T> {
    readonly [Symbol.toStringTag]: 'Promise';
    promise: Promise<T>;
    resolve: (value?: T) => void;
    reject: (reason?: T) => void;
    constructor();
    then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
    catch: <TResult = never>(onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>;
}
export declare class Messager {
    /**
     * define A client and B client, and current client is A;
     */
    private transactions;
    private callbacks;
    private needWait;
    private senderEnable;
    private senderHandler;
    private __sync;
    fn: {
        [command: string]: (...args: any) => Deferred<any>;
    };
    constructor(senderHandler: (data: any) => void);
    isConnect: () => boolean;
    setSenderHandler: (handler: (data: any) => void) => void;
    private sender;
    private send;
    private reply;
    listener: (data: Ipayload<any, string | PayloadStatus>) => void;
    private initialize;
    private _sync;
    sync: () => void;
    bind: (name: string) => (...args: any) => Deferred<any>;
    define: (name: string, func: TCallBack) => void;
}
export {};
