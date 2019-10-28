import { EventBus,evtCallback } from './event_bus';


enum PayloadStatus {
    success,
    fail
}


export interface Ipayload<T> {
    id: number
    command: string
    data: T
    reply: boolean
    status?: PayloadStatus
}

type TCallBack = (...data: any) => any;

class Deferred {
    promise: Promise<any>;
    resolve: (value?: any) => void = () => { };
    reject: (reason?: any) => void = () => { };

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}

let count = 0;

const getUID = () => {
    return count++;
}

const getTransactionKey = (data: Ipayload<any>) => `${data.command}(${data.id})`;

const SYNC_COMMAND = 'MAKKII:sync';


export class Messager {


    /**
     * define A client and B client, and current client is A;
     */

    private eventbus = new EventBus<Ipayload<any>>();
    private transactions: { [key: string]: Deferred } = {};
    private callbacks: { [command: string]: TCallBack } = {};
    private needWait: Array<Ipayload<any>> = [];
    private senderEnable: boolean = true;
    private senderHandler: (data: any) => void;
    private __sync: (...args:any)=> Promise<any>;

    fn:{[command: string]: (...args: any)=> Promise<any>} = {};



    constructor(senderHandler: (data: any) => void) {
        this.senderHandler = senderHandler;
        // bind B client sync func
        this.__sync = this.bind(SYNC_COMMAND);
        // define A clint sync func
        this.define(SYNC_COMMAND, this.sync);
    }

    isConnect = () => {
        return this.senderEnable&&this.needWait.length === 0
    }

    addEventListener = (name: string, cb: evtCallback<Ipayload<any>> )=>this.eventbus.addEvtListener(name, cb)

    removeEventListener = (name: string, cb: evtCallback<Ipayload<any>> )=>this.eventbus.removeEvtListener(name, cb)

    private sender = (data: Ipayload<any>) => {
        const force = data.command === SYNC_COMMAND;
        if (!force && !this.isConnect()) {
            this.needWait.push(data)
        } else {
            try{
                this.senderHandler(data)
            }catch(e){
                this.senderEnable = false;
            }
        }
        this.eventbus.emit('send', data)
    }

    private send = (command: string, data: any) => {
        const payload: Ipayload<any> = {
            command,
            data,
            id: getUID(),
            reply: false,
        }
        const defer = new Deferred();
        this.transactions[getTransactionKey(payload)] = defer;
        this.sender(payload);
        return defer.promise;
    }

    private reply = (data: Ipayload<any>, result: any, status: PayloadStatus) => {
        // reply to B
        data.reply = true;
        data.data = result;
        data.status = status;
        this.sender(data);
    }

    listener = (data: Ipayload<any>) => {
        if (data.reply) { // reply from  B
            const key = getTransactionKey(data);
            if (this.transactions[key]) {
                if (PayloadStatus.success === data.status) {
                    this.transactions[key].resolve(data.data)
                } else {
                    this.transactions[key].reject(data.data)
                }
            }
            delete this.transactions[key];
        } else if (this.callbacks[data.command]) { // request from B
            // have defined req's command
            const result = this.callbacks[data.command](data.data);
            if (result && result.then) {
                // if result is a promise
                result.then((d: any) => this.reply(data, d, PayloadStatus.success))
                .catch((e: any)=>this.reply(data,e, PayloadStatus.fail))
            }else{
                this.reply(data, result, PayloadStatus.success);
            }
        }else {
            // no define command
            this.reply(data, null, PayloadStatus.fail);
        }
        this.eventbus.emit('receive', data)
    }

    private initialize = ()=>{
        if(this.needWait.length>0){
            const waiting = this.needWait;
            this.needWait=[];
            waiting.forEach(payload => {
                this.sender(payload)
            });
            this.eventbus.emit('ready')
        }
    }

    private _sync = (defines: string[] =[]) => {
        defines.filter(d=>!(d in this.fn))
        .map(d=>{
            this.fn[d] = this.bind(d)
        });
        this.initialize();
        return Object.keys(this.callbacks);
    }

    sync = ()=> {
        this.__sync(Object.keys(this.callbacks)).then(this._sync)
    }

    bind = (name:string) => {
        return (...args: any) => this.send(name, args);
    }

    define = (name: string, func: TCallBack) => {
        this.callbacks[name] = (args: any) => func(...args);
        if(this.isConnect()){
            this.sync();
        }
    }
}