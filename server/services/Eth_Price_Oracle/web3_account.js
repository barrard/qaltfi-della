// require('dotenv').config()

// const PROVIDER_SETTING =  process.env.PROVIDER_SETTING
// const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY

// module.exports = (web3)=>{
//   // console.log(web3.eth.accounts.wallet)

//   async function get_account(){
//     logger.log('Get Accounts'.yellow)
//     if(PROVIDER_SETTING == "local"){
//       let accounts = await web3.eth.getAccounts()
//       return accounts[0]
//     }else if(PROVIDER_SETTING == "infura"){
//       let wallet = web3.eth.accounts.privateKeyToAccount(METAMASK_PRIVATE_KEY)
//       return  wallet.address
//     }
//   }


//   return {
//     get_account,//returns main account address

//     //run a function(method) of contract, with wet value from main account
//     async run(function_call, contract, wei_value){
//       let from_account = await get_account()
//       var wei_value = wei_value || 0;

//       const tx_params = {
//         from: from_account,
//         to: contract._address,
//         data: encode_function_call(function_call),
//         value: web3.utils.toBN(wei_value).toString(),
//         nonce : await web3.eth.getTransactionCount(from_account),
//         chainId : await web3.eth.net.getId()
//       }
//       tx_params.gas = await web3.eth.estimateGas(tx_params);

//       //hash the tx?
//       hashed_tx = {}
//       for(let key in tx_params){
//         hashed_tx[key] = web3.utils.toHex(tx_params[key])
//       }
//       logger.log(hashed_tx)


//       //Sign transaction with sending address
//       // let signed_trx = await web3.eth.accounts.signTransaction(hashed_tx, from_account)

//       // logger.log(signed_trx)

//       //sendTransaction
//       // let tx_resp = await web3.eth.sendTransaction(tx_params)
//       // logger.log(tx_resp)


//     }
//   }
  
//   function encode_function_call(func){
//     var txMethodData;

//     if (func) {
//       txMethodData = func.encodeABI();
//     } else {
//       txMethodData = "";
//     }
//     return txMethodData
//   }
// }