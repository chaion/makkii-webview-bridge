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
const isBrowser = typeof window !== 'undefined';
class Makkii {
    constructor() {
        this.account = '';
        this.lang = '';
        this.setCurretnAccount = (account) => {
            this.account = account;
        };
        this.getCurrentAccount = () => new Promise((resolve, reject) => {
            this._getCurrentAccount().then(r => {
                this.account = r;
                resolve(r);
            }).catch(e => {
                reject(e);
            });
        });
        this.switchAccount = () => new Promise((resolve, reject) => {
            this._switchAccount().then(r => {
                this.account = r;
                resolve(r);
            }).catch(e => {
                reject(e);
            });
        });
        this.getCurrentLang = () => __awaiter(this, void 0, void 0, function* () {
            const lang = yield this._getCurrentAccount();
            this.lang = lang;
            return lang;
        });
        this.isconnect = () => this.messager.isConnect();
        this.messager = new messager_1.Messager((data) => {
            const { ReactNativeWebView } = window;
            if (isBrowser && ReactNativeWebView) {
                ReactNativeWebView.postMessage(JSON.stringify(data));
            }
            else {
                throw 'No ReactNativeWebView';
            }
        });
        // bind 
        this.sendTx = this.messager.bind('sendTx');
        this._switchAccount = this.messager.bind('switchAccount');
        this._getCurrentAccount = this.messager.bind('getCurrentAccount');
        this._getCurrentLang = this.messager.bind('getCurrentLang');
        this.getCurrentLang();
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
            },
        };
        Object.defineProperty(window, 'originalPostMessage', descriptor);
    }
    document.addEventListener('FROM_MAKKII', (e) => {
        makkii.messager.listener(e.data);
    });
}
window.makkii = makkii;
exports.default = makkii;
