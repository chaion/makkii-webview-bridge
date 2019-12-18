export interface IWebview {
    injectJavaScript: (data: any) => any;
}
declare type WebViewGetter<T extends IWebview> = () => T;
export default class Bridge<T extends IWebview> {
    private webViewGetter;
    constructor(getter: WebViewGetter<T>);
    bind: (name: string) => this;
    define: (name: string, func: (...data: any) => any) => this;
    setwebViewGetter: (getter: WebViewGetter<T>) => void;
    listener: (e: any) => void;
    isConnect: () => () => boolean;
}
export {};
