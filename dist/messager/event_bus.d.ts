export declare type evtCallback<T> = (evt?: T) => any;
export declare class EventBus<T> {
    private listeners;
    addEvtListener: (name: string, cb: evtCallback<T>) => void;
    removeEvtListener: (name: string, cb: evtCallback<T>) => void;
    emit: (name: string, evt?: T | undefined) => void;
}
