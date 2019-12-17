const {Messager} = require('./dist/messager');


const clentA = new Messager(data=>{})
const clentB = new Messager(data=>{
    clentA.listener(data)
})

clentA.setSenderHandler(data=>clentB.listener(data))


const methodA = async (a, emiter)=>{
    console.log('start methodA');
    for (let i = 0 ; i<10;i++){
        await new Promise(resolve=> setTimeout(()=>{
            emiter('test', a++)
            resolve();
        },3*1000))
    }
    emiter('end', a++)
    return a*a
}


clentA.define('methodA', methodA);

const methodB = clentB.bind('methodA');

console.log('start test+++++++++');
methodB(1).on('test', e=>{
    console.log('get methodA next=>', e)
}).on('end', e=>{
    console.log('get methodA end=>', e)
}).then(e=>{
    console.log('methodA resolve', e)
})
