"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventBus {
    constructor() {
        this.listeners = {
            send: [],
            receive: [],
            ready: [],
        };
        this.addEvtListener = (name, cb) => {
            if (name in this.listeners) {
                const fns = this.listeners[name];
                if (fns.indexOf(cb) < 0) {
                    fns.push(cb);
                }
            }
        };
        this.removeEvtListener = (name, cb) => {
            if (name in this.listeners) {
                const fns = this.listeners[name];
                const idx = fns.indexOf(cb);
                if (idx >= 0) {
                    fns.splice(idx, 1);
                }
            }
        };
        this.emit = (name, evt) => {
            if (name in this.listeners) {
                this.listeners[name].forEach(fn => fn(evt));
            }
        };
    }
}
exports.EventBus = EventBus;
