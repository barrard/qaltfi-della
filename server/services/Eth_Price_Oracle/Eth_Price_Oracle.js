colors = require("colors");
logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});

require("dotenv").config({ path: `${__dirname}/./../../../.env` });
const GANACHE_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const NODE_ENV = process.env.NODE_ENV;
const rp = require("request-promise");

// var Web3 = require('web3');
let { web3, wss_web3 } = require("../web3_service.js");
const {
  Eth_price_Oracle_abi,
  Eth_price_Oracle_address
} = require("../../../next_app/components/es5_contract_abi.js");
var Eth_Price_Oracle;
Eth_Price_Oracle = new web3.eth.Contract(
  Eth_price_Oracle_abi,
  Eth_price_Oracle_address
);
// logger.log(Eth_Price_Oracle);
const WS_Eth_Price_Oracle = new wss_web3.eth.Contract(
  Eth_price_Oracle_abi,
  Eth_price_Oracle_address
);
logger.log(`${__dirname}/../../.env`);

// const ACCOUNT = "0x82BF2A0Cb4939F3BC865a5b47A0863856895c163"//metamask account 2
// const ACCOUNT = "0x8acb9cfc0a1884d4cfe58d738a4479d693b87be6"//ganache account
//   const ACCOUNT = "0x763D9dD7401266BCEAB676a57935606808083a58"//metamask account

// const web3_account = require('./web3_account.js')(web3);

// logger.log(Object.keys(web3.eth.accounts.create()))
// Docs say to require truffle-contract after setting provider
// const Oracle = require('./Oracle_functions.js')(web3, web3_account)
// logger.log(Oracle)

// setInterval(() => {
//   tests()

// }, 3000);
// async function tests() {
//   try {
//     Oracle.address()
//     Oracle.test()
//     Oracle.update_current_eth_price()
//     //get url

//     // let url = await Oracle.get('url')
//     // logger.log(url)
//     // let res = await Oracle.set_url('123')
//     // logger.log(res)

//   } catch (err) {
//     logger.log('err'.bgRed)
//     logger.log(err)
//   }
// }
init();

module.exports = init;
async function init() {
  logger.log({ Eth_price_Oracle_address });
  // var wallet = web3.eth.accounts.wallet;
  // logger.log({ wallet });
  // logger.log({METAMASK_PRIVATE_KEY, GANACHE_PRIVATE_KEY})
  private_key =
    NODE_ENV == "production" ? METAMASK_PRIVATE_KEY : GANACHE_PRIVATE_KEY;
  // logger.log(private_key)

  account_obj = web3.eth.accounts.wallet.add(private_key);
  var wallet = web3.eth.accounts.wallet[0];
  // logger.log(wallet.length);
  // return
  var address = wallet.address;
  // logger.log({ wallet });
  logger.log({ address });
  web3.defaultAccount = address;

  start_loop();
  listen_for_NEW_ETH_PRICE_events();
}

function listen_for_NEW_ETH_PRICE_events() {
  WS_Eth_Price_Oracle.events
    .NEW_ETH_PRICE({
      fromBlock: "latest"
    })
    .once("data", event_data => logger.log({ event_data }))
    .on("changed", event_changed => logger.log({ event_changed }))
    .on("error", error => logger.log({ error }));
  // WS_Eth_Price_Oracle.once("NEW_ETH_PRICE", {}, (err, data) =>
  //   logger.log({ err, data })
  // );
}

var last_pennies = 0;
var last_transaction_done = true;

function check_price_change(PENNIES) {
  const price_change_limit = 10; //pennies
  const absDiff = Math.abs(last_pennies - PENNIES);
  logger.log({ price_change_limit, absDiff });

  return absDiff > price_change_limit ? true : false;
}

async function update_current_eth_price(loops_counter) {
  try {
    const url =
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=9e1cb3271ce802eee46790fd81242764ab53a8cbedf8c637d03365351fb5bdcf";
    let eth_price = await rp(url);
    logger.log(eth_price);
    const USD_price = JSON.parse(eth_price).USD;
    logger.log(USD_price);
    const PENNIES = parseFloat(parseFloat(USD_price * 100).toFixed(2));
    console.log({ PENNIES });
    var price_check = check_price_change(PENNIES);
    logger.log({ price_check });
    logger.log({ price_check, last_transaction_done });
    if (loops_counter % 20 == 0) {
      price_check = true;
      last_transaction_done = true;
    }
    if (!price_check || !last_transaction_done) return;
    // if (!last_transaction_done) return;//dev only
    logger.log("------------  SETTIG ETH PRICE  -----------------".yellow);
    last_pennies = PENNIES;
    last_transaction_done = false;

    const tx_data = {
      from: web3.defaultAccount,
      to: Eth_price_Oracle_address,
      value: "0",
      data: Eth_Price_Oracle.methods.set_price(PENNIES).encodeABI()
    };
    logger.log({ tx_data });

    // tx_data.gasPrice = await web3.eth.getGasPrice();
    tx_data.gasPrice = "10000000000";
    const gas = await web3.eth.estimateGas(tx_data);

    tx_data.gas = Math.ceil(gas + gas * 0.05); //adding 5% to gas becauase deploy campaign needs it smh
    const transaction_obj = { ...tx_data };
    // logger.log({ tx_data });

    let set_eth_price = await Eth_Price_Oracle.methods
      .set_price(PENNIES)
      .send(transaction_obj)

      .on("transactionHash", check_if_mined)
      // .on('confirmation', function(confNumber, receipt){
      //   console.log('CONFIRMATION')
      //   console.log({confNumber, receipt})
      //  })

      // .once("receipt", display_receipt)
      // .on("receipt",  (receipt) => {

      //   transaction_counter++

      //   // logger.log(receipt)
      //   // logger.log('display_receipt')

      //   const {gasUsed, events } = receipt
      //   const {NEW_ETH_PRICE} = events
      //   const {returnValues} = NEW_ETH_PRICE
      //   // logger.log(receipt)
      //   logger.log({gasUsed, returnValues})
      //   last_transaction_done = true
      //   logger.log('display_receipt'.green)
      //   logger.log('receipt'.magenta)
      // })

      // .on('receipt', display_receipt)
      .on("error", error => console.log(error));
    // logger.log(update_price)

    // DATA.set('current_eth_price', USD_price)
    // await Eth_price.findOneAndUpdate({ name: 'eth' }, {
    //   price: USD_price,
    //   time: new Date().getTime()
    // }, { upsert: true })
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

var loops_counter = 0;
var transaction_counter = 0;
var last_balance = 0;
var total_spent = 0;

async function start_loop() {
  let current_balance = await web3.eth.getBalance(web3.defaultAccount);
  logger.log(web3.defaultAccount);
  logger.log({ current_balance });
  setInterval(() => {
    update_current_eth_price(loops_counter);

    monitor();
  }, 1000 * 60*5); //every 5 minues//edited 03/12/20 due to over api limit
}

async function monitor() {
  loops_counter++;
  /* get balance */
  let current_balance = await web3.eth.getBalance(web3.defaultAccount);
  // logger.log(current_balance)
  if (last_balance) {
    const difference = (last_balance - current_balance).toString();
    const cost = web3.utils.fromWei(difference, "ether");
    total_spent += parseFloat(cost);
  }
  // logger.log({cost})
  last_balance = current_balance;
  logger.log({ loops_counter, transaction_counter, total_spent });
}

async function read_transaction(transactionHash) {
  //logger.log({transactionHash})
  //let transaction = await web3.eth.getTransaction(transactionHash);
  // const { gas, gasPrice } = transaction;
  //logger.log(transaction)
  //logger.log({ gas, gasPrice, transactionHash });
  check_if_mined(transactionHash);
}

function check_if_mined(hash) {
  var null_blockNumber_bug_count = 0;
  const miner_timer = setInterval(async () => {
    const receipt = await web3.eth.getTransaction(hash);
    // logger.log({ receipt });
    if (!receipt || !receipt.blockNumber) {
      null_blockNumber_bug_count++;
      logger.log({ null_blockNumber_bug_count });
      return;
    }
    clearInterval(miner_timer);
    display_receipt(receipt);
  }, 3000);
}

function display_receipt(receipt) {
  // logger.log('display_receipt');
  // logger.log('display_receipt');
  // logger.log('display_receipt');
  logger.log("display_receipt");
  last_transaction_done = true;

  // logger.log(receipt)
  // logger.log('display_receipt')

  const { gasPrice, gas, blockNumber } = receipt;
  // const { NEW_ETH_PRICE } = events;
  // const { returnValues } = NEW_ETH_PRICE;
  logger.log(receipt);
  logger.log({ gas, gasPrice, blockNumber });

  transaction_counter++;
  // get_events("NEW_ETH_PRICE", blockNumber - 30, "latest");
  // listen_for_NEW_ETH_PRICE_events()
  return;
}

async function get_events(event, from, to) {
  try {
    logger.log({ event, from, to });
    // WS_Eth_Price_Oracle.events.NEW_ETH_PRICE({fromBlock: from,
    //   toBlock: to}, (err, data)=>logger.log({err, data}))
    Eth_Price_Oracle.getPastEvents(
      event,
      {
        fromBlock: from,
        toBlock: to
      },
      (err, events) => logger.log({ err, events })
    );
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

// var current_block = 0;

// async function get_current_block() {
//   let block_numnber = await web3.eth.getBlockNumber();
//   logger.log(block_numnber);
//   if (current_block != block_numnber) {
//     // get_events('NEW_URL_SET', current_block, block_numnber)
//     current_block = block_numnber;
//   }
// }

// function get_block_number_timer() {
//   if (!current_block) {
//     setInterval(() => {
//       get_current_block();
//     }, 2000);
//   }
// }

// get_block_number_timer()
