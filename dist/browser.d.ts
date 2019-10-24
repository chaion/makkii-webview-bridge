import { Messager } from './messager';
export declare class Makkii {
    messager: Messager;
    account: string;
    sendTx: (...args: any) => Promise<any>;
    _getCurrentAccount: (...args: any) => Promise<any>;
    _switchAccount: (...args: any) => Promise<any>;
    constructor();
    setCurretnAccount: (account: string) => void;
    getCurrentAccount: () => Promise<unknown>;
    switchAccount: () => Promise<unknown>;
    isconnect: () => boolean;
}
declare const makkii: Makkii;
export default makkii;
