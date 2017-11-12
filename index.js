var IOTA = require('iota.lib.js')

var seed = 'ZGEWNWYJWBN9DPYOU9VZPIVFXYOZKMVOJGYRJWGTZXXNUADVAZHQNHDANIUKNNCDJXDNRZDLLEFSUIVIK';
var peers = [
  'udp://node1.puyuma.org:14265'
  , 'udp://n1.iota-node.de:14600'
  , 'udp://node.tangle.works:14700'
  , 'udp://m1.iotaledger.net:15100'
];

// Create IOTA instance with host and port as provider
var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265
});

var check = err => {
  if(err){
    throw err;
  }
};

const call = (api,seed) => new Promise((ok,fail)=> {
  const cb = (err, res) => {
    if(err){
      fail(err);
    }else{
      ok(res);
    }
  };
  if(seed){
    iota.api[api](seed, cb);
  }else{
    iota.api[api](cb);
  }
});

const wrapLog = p => p.then(x=>{
  console.log(x);
  return x;
});

var isObject = x => typeof x == "object" && !Array.isArray(x);

function logCall(args, tag) {
  return call.apply(null,args)
    .then(res=>{
      if (!tag && !isObject(res)){
        tag = tag || args[0];
      }
      if(tag){
        let msg = {};
        msg[tag] = res;
        console.log(msg);
      }else{
        console.log(res);
      }
      return res;
    });
}

console.log({version: iota.version});

logCall(['getNodeInfo'])
  .then(()=>logCall(['addNeighbors', peers]))
  .then(()=>logCall(['getNeighbors']))
  .then(()=>logCall(['getAccountData', seed]))
  .catch(err=>console.error(err))
;

if (false) {
    console.log(res)

    call('addNeighbors',['']).then(x=>console.log(x))

    call('getNeighbors')
      .then(peers=>console.log({peers}));

    call('getTransfers', seed)
      .then(txs=>console.log({txs}));

    call('getAccountData', seed)
      .then(res=>console.log(res))
      .catch(err=>console.error(err));
}
