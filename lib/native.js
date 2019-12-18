"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messager_1 = require("./messager");
class Bridge {
    constructor(getWebView) {
        this.bind = (name) => this.messager.bind(name);
        this.define = (name, func) => this.messager.define(name, func);
        this.setSenderHandler = (handler) => this.messager.setSenderHandler(handler);
        this.listener = (e) => {
            let data;
            try {
                data = JSON.parse(e.nativeEvent.data);
                if (typeof data === "string")
                    data = JSON.parse(data);
            }
            catch (e) {
                //
            }
            if (data) {
                this.messager.listener(data);
            }
        };
        this.isConnect = () => this.messager.isConnect;
        this.messager = new messager_1.Messager((data) => {
            const injectCode = "{ let evt = document.createEvent('events');\n" +
                "evt.initEvent('FROM_MAKKII',true,false);\n" +
                `evt.data = ${JSON.stringify(data)};\n` +
                "document.dispatchEvent(evt);\n" +
                "}";
            const webview = getWebView();
            if (webview) {
                webview.injectJavaScript(injectCode);
            }
        });
    }
}
exports.default = Bridge;
