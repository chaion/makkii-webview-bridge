# Makkii webview bridge
   
 > invoke functions between makkii and web dapp, inspired by [react-native-webview-invoke](https://github.com/pinqy520/react-native-webview-invoke)
## How to use 
### web side 
```javascript
import 'makkii-webview-bridge'

const makkii = window.makkii
makkii.getCurrentAccount().then(console.log) // get current account
```
## Api
### `getcurrentAccount`
- Args
```js
symbol // coin type
```
- Return 
```js
promise<string> //current makkii account
```
### `switchAccount`
> return to makkii and switch current account
- Args
```js
symbol // coin type
```
- Return
```js
Promise<string> // new account
```
### sendTx
> return to makkii and send a Tx
- Args
```js
{to: string, value: number, gasLimit: number, gasPrice: number}
```
- Return
```js
Promise<string> // txhash
```