require("dotenv").config({ path: `${__dirname}/./../../.env` });

const {set_current_block_number} = require('../models/blockchain_data_model.js')
const Web3 = require("web3");

const INFURA_KEY = process.env.INFURA_KEY;
const BLOCKCHAIN_NETWORK = process.env.BLOCKCHAIN_NETWORK;
const BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV;
const production = BLOCKCHAIN_ENV == "production";
logger.log({ production });
const protocol = production ? "https" : "http";
const blockchain_host = production
  ? `${BLOCKCHAIN_NETWORK}.infura.io/v3/${INFURA_KEY}`
  : // ? `${BLOCKCHAIN_NETWORK}.infura.io/v3/9ae38af7e81f42459059c6af302327e8`
    `192.168.0.12:8545`;
// `192.168.0.12:9545`;//truffle develop testing
const web3 = new Web3(
  new Web3.providers.HttpProvider(`${protocol}://${blockchain_host}`)
);
const wss_web3 = production
  ? new Web3(
      new Web3.providers.WebsocketProvider(
        `wss://${BLOCKCHAIN_NETWORK}.infura.io/ws/v3/9ae38af7e81f42459059c6af302327e8`
      )
    )
  : new Web3(new Web3.providers.WebsocketProvider(`ws://${blockchain_host}`));

console.log(`${protocol}://${blockchain_host}`);
console.log(`${protocol}://${blockchain_host}`);
console.log(`${protocol}://${blockchain_host}`);

module.exports = {
  web3,
  wss_web3
};
check_block_number_timer()
var block_number_timer_started = false;
async function check_block_number_timer() {
  if (block_number_timer_started) return;

  block_number_timer_started = true;
  current_block_number = 0;
  setInterval(async ()=>{
    try {
      let blockNumber = await web3.eth.getBlockNumber();
    set_current_block_number(blockNumber)
    } catch (err) {
      logger.log('err web3service'.bgRed)
      // logger.log(err)
    }
  }, 15000)
}
