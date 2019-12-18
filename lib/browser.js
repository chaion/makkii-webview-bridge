"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messager_1 = require("./messager");
const isBrowser = typeof window !== "undefined";
class Makkii {
    constructor() {
        this.account = "";
        this.lang = "";
        this.setCurretnAccount = (account) => {
            this.account = account;
        };
        this.getCurrentAccount = () => new Promise((resolve, reject) => {
            this._getCurrentAccount()
                .then(r => {
                this.account = r;
                resolve(r);
            })
                .catch(e => {
                reject(e);
            });
        });
        this.switchAccount = () => new Promise((resolve, reject) => {
            this._switchAccount()
                .then(r => {
                this.account = r;
                resolve(r);
            })
                .catch(e => {
                reject(e);
            });
        });
        this.isconnect = () => this.messager.isConnect();
        this.messager = new messager_1.Messager((data) => {
            const { ReactNativeWebView } = window;
            if (isBrowser && ReactNativeWebView) {
                ReactNativeWebView.postMessage(JSON.stringify(data));
            }
            else {
                throw "No ReactNativeWebView";
            }
        });
        // bind
        this.sendTx = this.messager.bind("sendTx");
        this._switchAccount = this.messager.bind("switchAccount");
        this._getCurrentAccount = this.messager.bind("getCurrentAccount");
    }
}
exports.Makkii = Makkii;
const makkii = new Makkii();
if (isBrowser) {
    let originalPostMessage = window.originalPostMessage;
    if (originalPostMessage) {
        makkii.messager.sync();
    }
    else {
        const descriptor = {
            get() {
                return originalPostMessage;
            },
            set(value) {
                originalPostMessage = value;
                if (originalPostMessage) {
                    setTimeout(makkii.messager.sync, 50);
                }
            }
        };
        Object.defineProperty(window, "originalPostMessage", descriptor);
    }
    document.addEventListener("FROM_MAKKII", (e) => {
        makkii.messager.listener(e.data);
    });
}
window.makkii = makkii;
exports.default = makkii;
