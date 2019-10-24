
export type evtCallback<T> = (evt?: T) => any


export class EventBus<T> {
    private listeners: {[key: string]: Array<evtCallback<T>>} = {
        send: [],
        receive: [],
        ready: [],
    }
    
    addEvtListener=(name: string, cb: evtCallback<T>)=>{
        if (name in this.listeners) {
            const fns = this.listeners[name];
            if(fns.indexOf(cb)<0){
                fns.push(cb);
            }
        }
    }

    removeEvtListener=(name:string, cb: evtCallback<T>)=> {
        if (name in this.listeners) {
            const fns = this.listeners[name];
            const idx = fns.indexOf(cb);
            if (idx >= 0) {
                fns.splice(idx, 1);
            }
        }
    }

    emit = (name: string, evt?:T)=>{
        if (name in this.listeners) {
            this.listeners[name].forEach(fn=>fn(evt))
        }
    }
}