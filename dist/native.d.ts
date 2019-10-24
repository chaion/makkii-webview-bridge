import { Messager, Ipayload } from "./messager";
import { evtCallback } from "./messager/event_bus";
export default class Bridge {
    messager: Messager;
    constructor(getWebView: () => ({
        injectJavaScript: (data: any) => any;
    }) | null);
    bind: (name: string) => (...args: any) => Promise<any>;
    define: (name: string, func: (...data: any) => any) => void;
    listener: (e: any) => void;
    addEventListener: (name: string, cb: evtCallback<Ipayload<any>>) => void;
    removeEventListener: (name: string, cb: evtCallback<Ipayload<any>>) => void;
    isConnect: () => () => boolean;
}
