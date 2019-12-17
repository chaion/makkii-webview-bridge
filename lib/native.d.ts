import { Messager } from "./messager";
export default class Bridge {
    messager: Messager;
    constructor(getWebView: () => ({
        injectJavaScript: (data: any) => any;
    }) | null);
    bind: (name: string) => (...args: any) => import("./messager").Deferred<any>;
    define: (name: string, func: (...data: any) => any) => void;
    listener: (e: any) => void;
    isConnect: () => () => boolean;
}
