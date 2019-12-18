export type evtCallback<T> = (evt?: T) => any;

export class EventBus<T> {
    private listeners: { [key: string]: Array<evtCallback<T>> } = {};

    on = (name: string, cb: evtCallback<T>) => {
        if (!(name in this.listeners)) {
            this.listeners[name] = [];
        }
        const fns = this.listeners[name];
        if (fns.indexOf(cb) < 0) {
            fns.push(cb);
        }
        return this;
    };

    off = (name: string, cb: evtCallback<T>) => {
        if (name in this.listeners) {
            const fns = this.listeners[name];
            const idx = fns.indexOf(cb);
            if (idx >= 0) {
                fns.splice(idx, 1);
            }
        }
        return this;
    };

    emit = (name: string, evt?: T) => {
        if (name in this.listeners) {
            this.listeners[name].forEach(fn => {
                fn(evt);
            });
        }
        return this;
    };
}
