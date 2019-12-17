export declare type evtCallback<T> = (evt?: T) => any;
export declare class EventBus<T> {
    private listeners;
    on: (name: string, cb: evtCallback<T>) => this;
    off: (name: string, cb: evtCallback<T>) => this;
    emit: (name: string, evt?: T | undefined) => this;
}
