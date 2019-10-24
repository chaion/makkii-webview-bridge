import { evtCallback } from './event_bus';
declare enum PayloadStatus {
    success = 0,
    fail = 1
}
export interface Ipayload<T> {
    id: number;
    command: string;
    data: T;
    reply: boolean;
    status?: PayloadStatus;
}
declare type TCallBack = (...data: any) => any;
export declare class Messager {
    /**
     * define A client and B client, and current client is A;
     */
    private eventbus;
    private transactions;
    private callbacks;
    private needWait;
    private senderEnable;
    private senderHandler;
    private __sync;
    fn: {
        [command: string]: (...args: any) => Promise<any>;
    };
    constructor(senderHandler: (data: any) => void);
    isConnect: () => boolean;
    addEventListener: (name: string, cb: evtCallback<Ipayload<any>>) => void;
    removeEventListener: (name: string, cb: evtCallback<Ipayload<any>>) => void;
    private sender;
    private send;
    private reply;
    listener: (data: Ipayload<any>) => void;
    private initialize;
    private _sync;
    sync: () => void;
    bind: (name: string) => (...args: any) => Promise<any>;
    define: (name: string, func: TCallBack) => void;
}
export {};
