"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messager_1 = require("./messager");
const messager = new messager_1.Messager(() => { });
class Bridge {
    constructor(getter) {
        this.bind = (name) => {
            messager.bind(name);
            return this;
        };
        this.define = (name, func) => {
            messager.define(name, func);
            return this;
        };
        this.setwebViewGetter = (getter) => {
            this.webViewGetter = getter;
            messager.initialize();
        };
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
                messager.listener(data);
            }
        };
        this.isConnect = () => messager.isConnect;
        this.webViewGetter = getter;
        messager.setSenderHandler(data => {
            const injectCode = "{ let evt = document.createEvent('events');\n" +
                "evt.initEvent('FROM_MAKKII',true,false);\n" +
                `evt.data = ${JSON.stringify(data)};\n` +
                "document.dispatchEvent(evt);\n" +
                "}";
            const webview = this.webViewGetter();
            if (webview) {
                webview.injectJavaScript(injectCode);
            }
        });
    }
}
exports.default = Bridge;
