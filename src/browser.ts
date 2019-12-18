import { Messager, Deferred } from "./messager";
const isBrowser = typeof window !== "undefined";

const messager = new Messager((data: any) => {
    const { ReactNativeWebView } = window;
    if (isBrowser && ReactNativeWebView) {
        ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
        throw "No ReactNativeWebView";
    }
});

export class Makkii {
    private _getCurrentAccount: (...args: any) => Deferred<string>;
    private _switchAccount: (...args: any) => Deferred<string>;

    /**
     * Current account request from makkii wallet
     */
    public account: string = "";

    constructor() {
        // bind
        this.sendTx = messager.bind("sendTx");
        this._switchAccount = messager.bind("switchAccount");
        this._getCurrentAccount = messager.bind("getCurrentAccount");
        // define
        messager.define("setCurrentAccount", this.setCurrentAccount);
    }

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
    setCurrentAccount = (account: string) => {
        this.account = account;
    };

    /**
     * Get current account from makkii
     * > request current account to makkii
     * @return account address
     */
    getCurrentAccount = async () => {
        const account = await this._getCurrentAccount();
        this.account = account;
        return account;
    };

    /**
     * Switch account
     * > try switch account
     * @return account address
     */
    switchAccount = async () => {
        const account = await this._switchAccount();
        this.account = account;
        return account;
    };

    /**
     * Check is connect to makkii
     */
    isconnect = () => messager.isConnect();
}

const makkii = new Makkii();

if (isBrowser) {
    let originalPostMessage = window.originalPostMessage;

    if (originalPostMessage) {
        messager.sync();
    } else {
        const descriptor: any = {
            get() {
                return originalPostMessage;
            },
            set(
                value: ((
                    message: any,
                    targetOrigin: string,
                    transfer?: Transferable[] | undefined
                ) => void) &
                    ((
                        message: any,
                        targetOrigin: string,
                        transfer?: Transferable[] | undefined
                    ) => void)
            ) {
                originalPostMessage = value;
                if (originalPostMessage) {
                    setTimeout(messager.sync, 50);
                }
            }
        };
        Object.defineProperty(window, "originalPostMessage", descriptor);
    }
    document.addEventListener("FROM_MAKKII", (e: any) => {
        messager.listener(e.data);
    });
}

export default makkii;
