import { Messager } from "./messager";

const messager = new Messager(() => {});

export interface IWebview {
    injectJavaScript: (data: any) => any;
}

type WebViewGetter<T extends IWebview> = () => T;
export default class Bridge<T extends IWebview> {
    private webViewGetter: WebViewGetter<T>;

    constructor(getter: WebViewGetter<T>) {
        this.webViewGetter = getter;
        messager.setSenderHandler(data => {
            const injectCode =
                "{ let evt = document.createEvent('events');\n" +
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
    bind = (name: string) => {
        messager.bind(name);
        return this;
    };

    define = (name: string, func: (...data: any) => any) => {
        messager.define(name, func);
        return this;
    };

    setwebViewGetter = (getter: WebViewGetter<T>) => {
        this.webViewGetter = getter;
        messager.initialize();
    };
    listener = (e: any) => {
        let data: any;
        try {
            data = JSON.parse(e.nativeEvent.data);
            if (typeof data === "string") data = JSON.parse(data);
        } catch (e) {
            //
        }
        if (data) {
            messager.listener(data);
        }
    };
    isConnect = () => messager.isConnect;
}
