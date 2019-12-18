export interface IWebview {
    injectJavaScript: (data: any) => any;
}
declare type WebViewGetter<T extends IWebview> = () => T;
export default class Bridge<T extends IWebview> {
    private webViewGetter;
    constructor(getter: WebViewGetter<T>);
    bind: (name: string) => (...args: any) => import("./messager").Deferred<any>;
    define: (name: string, func: (...data: any) => any) => void;
    setwebViewGetter: (getter: WebViewGetter<T>) => void;
    listener: (e: any) => void;
    isConnect: () => () => boolean;
}
export {};
