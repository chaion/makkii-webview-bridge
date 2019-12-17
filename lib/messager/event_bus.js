"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventBus {
    constructor() {
        this.listeners = {};
        this.on = (name, cb) => {
            if (!(name in this.listeners)) {
                this.listeners[name] = [];
            }
            const fns = this.listeners[name];
            if (fns.indexOf(cb) < 0) {
                fns.push(cb);
            }
            return this;
        };
        this.off = (name, cb) => {
            if (name in this.listeners) {
                const fns = this.listeners[name];
                const idx = fns.indexOf(cb);
                if (idx >= 0) {
                    fns.splice(idx, 1);
                }
            }
            return this;
        };
        this.emit = (name, evt) => {
            if (name in this.listeners) {
                this.listeners[name].forEach(fn => {
                    fn(evt);
                });
            }
            return this;
        };
    }
}
exports.EventBus = EventBus;
