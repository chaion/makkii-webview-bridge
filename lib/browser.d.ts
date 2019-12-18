import { Deferred } from "./messager";
export declare class Makkii {
    private _getCurrentAccount;
    private _switchAccount;
    /**
     * Current account request from makkii wallet
     */
    account: string;
    constructor();
    /**
     * Send tx
     * > try send txObj
     */
    sendTx: (txObj: any) => Deferred<string>;
    /**
     * Set current webview account by makkii
     * > this func will be call by makkii wallet
     * @param account account address
     */
    setCurrentAccount: (account: string) => void;
    /**
     * Get current account from makkii
     * > request current account to makkii
     * @return account address
     */
    getCurrentAccount: () => Promise<string>;
    /**
     * Switch account
     * > try switch account
     * @return account address
     */
    switchAccount: () => Promise<string>;
    /**
     * Check is connect to makkii
     */
    isconnect: () => boolean;
}
declare const makkii: Makkii;
export default makkii;
