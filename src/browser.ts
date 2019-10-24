import {Messager} from './messager';
const isBrowser  = typeof window !== 'undefined';


export class Makkii {
    messager: Messager;
    account: string = '';
    sendTx: (...args: any) => Promise<any>;
    _getCurrentAccount:(...args: any) => Promise<any>;
    _switchAccount:(...args: any) => Promise<any>;

    constructor() {
        this.messager =  new Messager( (data:any)=> {
            const {ReactNativeWebView} = window;
            if(isBrowser && ReactNativeWebView) {
                ReactNativeWebView.postMessage(JSON.stringify(data))
            }else{
                throw 'No ReactNativeWebView'
            }
        });
        // bind 
        this.sendTx = this.messager.bind('sendTx');
        this._switchAccount = this.messager.bind('switchAccount');
        this._getCurrentAccount = this.messager.bind('getCurrentAccount');
    }

    setCurretnAccount = (account: string) => {
        this.account = account;
    }
    getCurrentAccount = ()=> new Promise((resolve,reject)=>{
        this._getCurrentAccount().then(r=>{
            this.account =r;
            resolve(r)
        }).catch(e=>{
            reject(e)
        });
    })
    switchAccount = () => new Promise((resolve, reject) => {
        this._switchAccount().then(r => {
            this.account = r;
            resolve(r)
        }).catch(e => {
            reject(e)
        })
    })
    isconnect = ()=>this.messager.isConnect();

}


const makkii = new Makkii();


if (isBrowser) {
    let originalPostMessage = window.originalPostMessage;

    if (originalPostMessage) {
        makkii.messager.sync();
    } else {
        const descriptor: any = {
            get() {
                return originalPostMessage;
            },
            set(value: ((message: any, targetOrigin: string, transfer?: Transferable[] | undefined) => void) & ((message: any, targetOrigin: string, transfer?: Transferable[] | undefined) => void)) {
                originalPostMessage = value;
                if (originalPostMessage) {
                    setTimeout(makkii.messager.sync, 50);
                }
            },
        };
        Object.defineProperty(window, 'originalPostMessage', descriptor);
    }
    document.addEventListener('FROM_MAKKII', (e:any) => {
        makkii.messager.listener(e.data);
    });
}

window.makkii = makkii;

export default makkii;