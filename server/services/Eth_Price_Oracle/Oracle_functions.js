// //truffle contract is used to interact with the contract in a "truffle" way
// // const truffle = require('truffle-contract')
// //Use the contract abi with truffle-contract to create the contract obj
// const {Eth_price_Oracle_abi,
//   Eth_price_Oracle_address} = require('../../../next_app/components/es5_contract_abi.js');
// //create the contract object with the abi and truffle object


// //for promise based async requests
// const rp = require('request-promise');

// module.exports = (web3, accounts) => {
//   // logger.log(Object.keys(Oracle_truffle_contract))

// logger.log(web3)
//   // logger.log(Oracle_abi)
//   // logger.log(web3.currentProvider)
//   const Oracle_truffle_contract = new web3.eth.Contract(Eth_price_Oracle_abi,Eth_price_Oracle_address);
  
//   //hack to use truffle-contract with web3 1.0.0
//   //https://ethereum.stackexchange.com/questions/51240/error-deploying-using-truffle-contracts-cannot-read-property-apply-of-undefin
//   if (typeof Oracle_truffle_contract.currentProvider.sendAsync !== "function") {
//     Oracle_truffle_contract.currentProvider.sendAsync = function () {
//       return Oracle_truffle_contract.currentProvider.send.apply(
//         Oracle_truffle_contract.currentProvider, arguments
//       );
//     };
//   }
//   const url = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'




//     (async () => {
//       let account = await accounts.get_account()
//       let Oracle_instance = await Oracle_truffle_contract.deployed()
//       Oracle_instance.NEW_URL_SET().watch((e, r, t) => {
//         logger.log({ e, r, t })
//         logger.log('EVENTS!'.yellow)
//       })
//       Oracle_instance.NEW_ETH_PRICE().watch((e, r, t) => {
//         logger.log({ e, r, t })
//         logger.log(r.args.price.toNumber())
//         logger.log(r.args.price_timestamp.toNumber())
//         logger.log('EVENTS!'.yellow)
//       })
//       // Oracle_instance.Get_ETH_Price().watch( (e, r, t)=>{
//       //   logger.log({e, r, t})
//       //   logger.log('EVENTS!'.yellow)
//       // })
//       // (msg.sender, _price, _price_timestamp);

//       Oracle_instance.set_url('123', { from: account })


//     })()


//   return {
//     async update_current_eth_price() {
//       try {
//         let account = await accounts.get_account()
//         let eth_price = await rp(url)
//         // logger.log(eth_price)
//         const USD_price = JSON.parse(eth_price).USD
//         // logger.log(USD_price)
//         // DATA.set('current_eth_price', USD_price)
//         // await Eth_price.findOneAndUpdate({ name: 'eth' }, {
//         //   price: USD_price,
//         //   time: new Date().getTime()
//         // }, { upsert: true })
//         logger.log({ USD_price })
//         let Oracle_instance = await Oracle_truffle_contract.deployed()
//         //display the price in pennies because cannot use float
//         let set_price = await Oracle_instance.set_price(USD_price * 100, { from: account })

//       } catch (err) {
//         logger.log('err'.bgRed)
//         logger.log(err)
//       }
//     },
//     // async getPastEvents( event, { fromBlock, toBlock }){
//     //   let Oracle_instance = await Oracle_truffle_contract.deployed()

//     //   let events = await Oracle_instance.getPastEvents( event, {fromBlock, toBlock} );
//     //   logger.log(events)


//     // },
//     async address() {
//       let Oracle_instance = await Oracle_truffle_contract.deployed()
//       logger.log(Oracle_instance.address)
//       return Oracle_instance.address
//     },
//     async get(prop) {
//       let Oracle_instance = await Oracle_truffle_contract.deployed()
//       let get_prop_resp = await Oracle_instance[prop].call()
//       return { [prop]: get_prop_resp }
//     },
//     async test() {
//       let account = await accounts.get_account()

//       let Oracle_instance = await Oracle_truffle_contract.deployed()
//       let price = await Oracle_instance.get_eth_price()
//       logger.log(price)
//       await Oracle_instance.set_url(url, { from: account })


//       // let account_balance = await web3.eth.getBalance(account)
//       // logger.log(account_balance)
//     },
//     // async set_url(url){
//     //   let account = await accounts.get_account()
//     //   logger.log('account'.yellow)
//     //   logger.log(account)
//     //   let Oracle_instance = await Oracle_truffle_contract.deployed()
//     //   let get_prop_resp = await Oracle_instance.set_url("123", {
//     //     from:account
//     //   })
//     //   return get_prop_resp

//     //   // const function_call = Oracle_contract.methods.set_url(url)
//     //   // accounts.run(function_call, Oracle_contract, 0)


//     // }
//   }

// }