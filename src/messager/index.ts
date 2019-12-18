import { EventBus } from "./event_bus";

/**
 * Payload status
 *
 */
enum PayloadStatus {
    success,
    fail,
    pending
}

export interface Ipayload<T, V = PayloadStatus | string> {
    id: number;
    command: string;
    data: T;
    reply: boolean;
    status: V;
}

type TCallBack = (...data: any) => any;

export class Deferred<T> extends EventBus<T> implements Promise<T> {
    readonly [Symbol.toStringTag]: "Promise";
    promise: Promise<T>;
    resolve: (value?: T) => void = () => {};
    reject: (reason?: T) => void = () => {};

    constructor() {
        super();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    public then = <TResult1 = T, TResult2 = never>(
        onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
        onrejected?:
            | ((reason: any) => TResult2 | PromiseLike<TResult2>)
            | undefined
            | null
    ): Promise<TResult1 | TResult2> => {
        return this.promise.then(onfulfilled, onrejected);
    };

    // the same signature as Promise.catch
    public catch = <TResult = never>(
        onRejected?:
            | ((reason: any) => TResult | PromiseLike<TResult>)
            | undefined
            | null
    ): Promise<T | TResult> => {
        return this.promise.catch(onRejected);
    };

    public finally(onfinally?: (() => void) | null | undefined): Promise<T> {
        return this.promise.finally(onfinally);
    }
}

let count = 0;

const getUID = () => {
    return count++;
};

const getTransactionKey = (data: Ipayload<any>) =>
    `${data.command}(${data.id})`;

const SYNC_COMMAND = "MAKKII:sync";

export class Messager {
    /**
     * define A client and B client, and current client is A;
     */

    private transactions: { [key: string]: Deferred<any> } = {};
    private callbacks: { [command: string]: TCallBack } = {};
    private needWait: Array<Ipayload<any>> = [];
    private senderEnable: boolean = true;
    private senderHandler: (data: any) => void;
    private __sync: (...args: any) => Deferred<any>;

    fn: { [command: string]: (...args: any) => Deferred<any> } = {};

    constructor(senderHandler: (data: any) => void) {
        this.senderHandler = senderHandler;
        // bind B client sync func
        this.__sync = this.bind(SYNC_COMMAND);
        // define A clint sync func
        this.define(SYNC_COMMAND, this._sync);
    }

    isConnect = () => {
        return this.senderEnable && this.needWait.length === 0;
    };

    setSenderHandler = (handler: (data: any) => void) => {
        this.senderHandler = handler;
        this.initialize();
    };

    private sender = (data: Ipayload<any>) => {
        const force = data.command === SYNC_COMMAND;
        if (!force && !this.isConnect()) {
            this.needWait.push(data);
        } else {
            try {
                this.senderHandler(data);
            } catch (e) {
                this.senderEnable = false;
            }
        }
    };

    private send = (command: string, data: any) => {
        const payload: Ipayload<any> = {
            command,
            data,
            id: getUID(),
            reply: false,
            status: ""
        };
        const defer = new Deferred<any>();
        this.transactions[getTransactionKey(payload)] = defer;
        this.sender(payload);
        return defer;
    };

    private reply = (
        data: Ipayload<any>,
        result: any,
        status: PayloadStatus
    ) => {
        // reply to B
        data.reply = true;
        data.data = result;
        data.status = status;
        this.sender(data);
    };

    listener = (data: Ipayload<any>) => {
        if (data.reply) {
            // reply from  B
            const key = getTransactionKey(data);
            if (this.transactions[key]) {
                if (typeof data.status === "string") {
                    this.transactions[key].emit(data.status, data.data);
                } else {
                    if (PayloadStatus.success === data.status) {
                        this.transactions[key].resolve(data.data);
                    } else {
                        this.transactions[key].reject(data.data);
                    }
                    delete this.transactions[key];
                }
            }
        } else if (this.callbacks[data.command]) {
            // request from B
            // have defined req's command
            const emitter = (emitType: string, emitData: any) => {
                data.reply = true;
                data.data = emitData;
                data.status = emitType;
                this.sender(data);
            };
            const result = this.callbacks[data.command]([
                ...data.data,
                emitter
            ]);
            if (result && result.then) {
                // if result is a promise
                result
                    .then((d: any) =>
                        this.reply(data, d, PayloadStatus.success)
                    )
                    .catch((e: any) => this.reply(data, e, PayloadStatus.fail));
            } else {
                this.reply(data, result, PayloadStatus.success);
            }
        } else {
            // no define command
            this.reply(data, null, PayloadStatus.fail);
        }
    };

    private initialize = () => {
        if (this.needWait.length > 0) {
            const waiting = this.needWait;
            this.needWait = [];
            waiting.forEach(payload => {
                this.sender(payload);
            });
        }
    };

    private _sync = (defines: string[] = []) => {
        defines
            .filter(d => !(d in this.fn))
            .map(d => {
                this.fn[d] = this.bind(d);
            });
        this.initialize();
        return Object.keys(this.callbacks);
    };

    sync = () => {
        this.__sync(Object.keys(this.callbacks)).then(this._sync);
    };

    bind = (name: string) => {
        return (...args: any) => this.send(name, args);
    };

    define = (name: string, func: TCallBack) => {
        this.callbacks[name] = (args: any) => func(...args);
        if (this.isConnect()) {
            this.sync();
        }
    };
}
