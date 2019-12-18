"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messager_1 = require("./messager");
const isBrowser = typeof window !== "undefined";
const messager = new messager_1.Messager((data) => {
    const { ReactNativeWebView } = window;
    if (isBrowser && ReactNativeWebView) {
        ReactNativeWebView.postMessage(JSON.stringify(data));
    }
    else {
        throw "No ReactNativeWebView";
    }
});
class Makkii {
    constructor() {
        /**
         * Current account request from makkii wallet
         */
        this.account = "";
        /**
         * Set current webview account by makkii
         * > this func will be call by makkii wallet
         * @param account account address
         */
        this.setCurrentAccount = (account) => {
            this.account = account;
        };
        /**
         * Get current account from makkii
         * > request current account to makkii
         * @return account address
         */
        this.getCurrentAccount = () => __awaiter(this, void 0, void 0, function* () {
            const account = yield this._getCurrentAccount();
            this.account = account;
            return account;
        });
        /**
         * Switch account
         * > try switch account
         * @return account address
         */
        this.switchAccount = () => __awaiter(this, void 0, void 0, function* () {
            const account = yield this._switchAccount();
            this.account = account;
            return account;
        });
        /**
         * Check is connect to makkii
         */
        this.isconnect = () => messager.isConnect();
        // bind
        this.sendTx = messager.bind("sendTx");
        this._switchAccount = messager.bind("switchAccount");
        this._getCurrentAccount = messager.bind("getCurrentAccount");
        // define
        messager.define("setCurrentAccount", this.setCurrentAccount);
    }
}
exports.Makkii = Makkii;
const makkii = new Makkii();
if (isBrowser) {
    let originalPostMessage = window.originalPostMessage;
    if (originalPostMessage) {
        messager.sync();
    }
    else {
        const descriptor = {
            get() {
                return originalPostMessage;
            },
            set(value) {
                originalPostMessage = value;
                if (originalPostMessage) {
                    setTimeout(messager.sync, 50);
                }
            }
        };
        Object.defineProperty(window, "originalPostMessage", descriptor);
    }
    document.addEventListener("FROM_MAKKII", (e) => {
        messager.listener(e.data);
    });
}
exports.default = makkii;
