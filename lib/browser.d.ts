import { Messager, Deferred } from "./messager";
export declare class Makkii {
    messager: Messager;
    account: string;
    lang: string;
    sendTx: (...args: any) => Deferred<any>;
    _getCurrentAccount: (...args: any) => Deferred<any>;
    _switchAccount: (...args: any) => Deferred<any>;
    constructor();
    setCurretnAccount: (account: string) => void;
    getCurrentAccount: () => Promise<unknown>;
    switchAccount: () => Promise<unknown>;
    isconnect: () => boolean;
}
declare const makkii: Makkii;
export default makkii;
