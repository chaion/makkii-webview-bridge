"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_bus_1 = require("./event_bus");
var PayloadStatus;
(function (PayloadStatus) {
    PayloadStatus[PayloadStatus["success"] = 0] = "success";
    PayloadStatus[PayloadStatus["fail"] = 1] = "fail";
})(PayloadStatus || (PayloadStatus = {}));
class Deferred {
    constructor() {
        this.resolve = () => { };
        this.reject = () => { };
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
let count = 0;
const getUID = () => {
    return count++;
};
const getTransactionKey = (data) => `${data.command}(${data.id})`;
const SYNC_COMMAND = 'MAKKII:sync';
class Messager {
    constructor(senderHandler) {
        /**
         * define A client and B client, and current client is A;
         */
        this.eventbus = new event_bus_1.EventBus();
        this.transactions = {};
        this.callbacks = {};
        this.needWait = [];
        this.senderEnable = true;
        this.fn = {};
        this.isConnect = () => {
            return this.senderEnable && this.needWait.length === 0;
        };
        this.addEventListener = (name, cb) => this.eventbus.addEvtListener(name, cb);
        this.removeEventListener = (name, cb) => this.eventbus.removeEvtListener(name, cb);
        this.sender = (data) => {
            const force = data.command === SYNC_COMMAND;
            if (!force && !this.isConnect()) {
                this.needWait.push(data);
            }
            else {
                try {
                    this.senderHandler(data);
                }
                catch (e) {
                    this.senderEnable = false;
                }
            }
            this.eventbus.emit('send', data);
        };
        this.send = (command, data) => {
            const payload = {
                command,
                data,
                id: getUID(),
                reply: false,
            };
            const defer = new Deferred();
            this.transactions[getTransactionKey(payload)] = defer;
            this.sender(payload);
            return defer.promise;
        };
        this.reply = (data, result, status) => {
            // reply to B
            data.reply = true;
            data.data = result;
            data.status = status;
            this.sender(data);
        };
        this.listener = (data) => {
            if (data.reply) { // reply from  B
                const key = getTransactionKey(data);
                if (this.transactions[key]) {
                    if (PayloadStatus.success === data.status) {
                        this.transactions[key].resolve(data.data);
                    }
                    else {
                        this.transactions[key].reject(data.data);
                    }
                }
                delete this.transactions[key];
            }
            else if (this.callbacks[data.command]) { // request from B
                // have defined req's command
                const result = this.callbacks[data.command](data.data);
                if (result && result.then) {
                    // if result is a promise
                    result.then((d) => this.reply(data, d, PayloadStatus.success))
                        .catch((e) => this.reply(data, e, PayloadStatus.fail));
                }
                else {
                    this.reply(data, result, PayloadStatus.success);
                }
            }
            else {
                // no define command
                this.reply(data, null, PayloadStatus.fail);
            }
            this.eventbus.emit('receive', data);
        };
        this.initialize = () => {
            if (this.needWait.length > 0) {
                const waiting = this.needWait;
                this.needWait = [];
                waiting.forEach(payload => {
                    this.sender(payload);
                });
                this.eventbus.emit('ready');
            }
        };
        this._sync = (defines = []) => {
            defines.filter(d => !(d in this.fn))
                .map(d => {
                this.fn[d] = this.bind(d);
            });
            this.initialize();
            return Object.keys(this.callbacks);
        };
        this.sync = () => {
            this.__sync(Object.keys(this.callbacks)).then(this._sync);
        };
        this.bind = (name) => {
            return (...args) => this.send(name, args);
        };
        this.define = (name, func) => {
            this.callbacks[name] = (args) => func(...args);
            if (this.isConnect()) {
                this.sync();
            }
        };
        this.senderHandler = senderHandler;
        // bind B client sync func
        this.__sync = this.bind(SYNC_COMMAND);
        // define A clint sync func
        this.define(SYNC_COMMAND, this._sync);
    }
}
exports.Messager = Messager;
