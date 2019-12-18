const {Messager} = require("./lib/messager");


const clentA = new Messager(data=>{});
const clentB = new Messager(data=>{
    clentA.listener(data);
});

clentA.setSenderHandler(data=>clentB.listener(data));


async function methodA(a, emiter){
    for (let i = 0 ; i<10;i++){
        await new Promise(resolve=> setTimeout(()=>{
            emiter("test", [a++, Date.now()]);
            resolve();
        },3*1000));
    }
    emiter("end", a++);
    return a*a;
}


clentA.define("methodA", methodA);

const methodB = clentB.bind("methodA");

console.log("start test+++++++++");
methodB(1).on("test", ([e, timestamp])=>{
    console.log(timestamp, " get methodA next=>", e);
}).on("end", e=>{
    console.log("get methodA end=>", e);
}).then(e=>{
    console.log("methodA resolve", e);
}).catch(err=>{
    console.log("methodA error=>", err);
});
